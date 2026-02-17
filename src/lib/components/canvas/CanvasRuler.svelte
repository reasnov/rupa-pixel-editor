<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { Geometry } from '../../logic/geometry.js';

	let { orientation = 'horizontal' } = $props<{ orientation: 'horizontal' | 'vertical' }>();

	let w = $derived(editor.canvas.width);
	let h = $derived(editor.canvas.height);
	let size = $derived(orientation === 'horizontal' ? w : h);
	let cursorCoord = $derived(
		orientation === 'horizontal' ? editor.cursor.pos.x : editor.cursor.pos.y
	);

	// Adaptive Interval based on Zoom
	let majorInterval = $derived.by(() => {
		const zoom = editor.studio.zoomLevel;
		if (zoom <= 0.5) return 16;
		if (zoom <= 1.5) return 8;
		if (zoom <= 4) return 4;
		return 2;
	});

	// The base dimension (without zoom) that fits the viewport
	let baseFitDimension = $derived(editor.canvas.getFitDimension(orientation));
	let zoom = $derived(editor.studio.zoomLevel);

	// Only render major markers for labels
	let markers = $derived.by(() => {
		const result = [];
		for (let i = 0; i < size; i++) {
			const label = Geometry.toCartesianLabel(i, size, orientation === 'vertical');
			if (label % majorInterval === 0 || i === 0 || i === size - 1) {
				result.push({ pos: i, label });
			}
		}
		return result;
	});

	/**
	 * Translation logic to sync with the Canvas movement.
	 * We use pixels instead of percentage for the container to avoid scale artifacts.
	 */
	let scrollTransform = $derived.by(() => {
		// Overview Mode (zoom <= 1)
		if (zoom <= 1) {
			return orientation === 'horizontal' ? 'translate(-50%, 0)' : 'translate(0, -50%)';
		}

		// Focused Mode (Follow Cursor)
		// We mirror the translate(-xPct, -yPct) from AtelierState
		const posPct = ((cursorCoord + 0.5) / size) * 100;
		return orientation === 'horizontal' ? `translate(-${posPct}%, 0)` : `translate(0, -${posPct}%)`;
	});
</script>

<div
	class="pointer-events-none relative h-full w-full overflow-hidden bg-latte-foam/80 backdrop-blur-sm"
	role="presentation"
>
	<!-- 
		The Ruler Strip:
		Instead of scaling, we change the size (width/height) and translate it.
		This keeps the thickness and text size perfectly constant.
	-->
	<div
		class="absolute flex {orientation === 'vertical' ? 'flex-col' : ''}"
		style="
			left: {orientation === 'horizontal' ? '50%' : '0'};
			top: {orientation === 'vertical' ? '50%' : '0'};
			transform: {scrollTransform}; 
			{orientation === 'horizontal' ? 'width' : 'height'}: calc({baseFitDimension} * {zoom});
			{orientation === 'vertical' ? 'width' : 'height'}: 100%;
		"
	>
		<!-- Ticks Layer (Subtle) -->
		<div
			class="absolute opacity-10 {orientation === 'horizontal'
				? 'right-0 bottom-0 left-0 h-1/2'
				: 'top-0 right-0 bottom-0 w-1/2'}"
			style="
				background-image: linear-gradient({orientation === 'horizontal' ? 'to right' : 'to bottom'}, 
					var(--color-charcoal) 1px, transparent 1px);
				background-size: {orientation === 'horizontal'
				? `calc(100% / ${size}) 100%`
				: `100% calc(100% / ${size})`};
			"
		></div>

		<!-- Major Ticks Layer -->
		<div
			class="absolute opacity-20 {orientation === 'horizontal'
				? 'right-0 bottom-0 left-0 h-3/4'
				: 'top-0 right-0 bottom-0 w-3/4'}"
			style="
				background-image: linear-gradient({orientation === 'horizontal' ? 'to right' : 'to bottom'}, 
					var(--color-charcoal) 1.5px, transparent 1.5px);
				background-size: {orientation === 'horizontal'
				? `calc(100% / ${size} * ${majorInterval}) 100%`
				: `100% calc(100% / ${size} * ${majorInterval})`};
			"
		></div>

		<!-- Labels: Fixed font size, no scaling -->
		{#each markers as marker (marker.pos)}
			<div
				class="absolute flex items-center justify-center"
				style="
					{orientation === 'horizontal' ? 'left' : 'top'}: {(marker.pos / size) * 100}%;
					{orientation === 'horizontal' ? 'width' : 'height'}: {100 / size}%;
					{orientation === 'horizontal' ? 'height' : 'width'}: 100%;
					{orientation === 'horizontal' ? 'padding-bottom: 4px;' : 'padding-right: 4px;'}
				"
			>
				<span
					class="font-mono text-[8px] font-bold text-charcoal/40"
					style="transform: {orientation === 'vertical' ? 'rotate(-90deg)' : 'none'};"
				>
					{marker.label}
				</span>
			</div>
		{/each}

		<!-- 
			Active Position Highlight
		-->
		<div
			class="absolute z-20 bg-brand transition-all duration-75 ease-out"
			style="
				{orientation === 'horizontal' ? 'left' : 'top'}: {((cursorCoord + 0.5) / size) * 100}%;
				{orientation === 'horizontal'
				? 'width: 1px; top: 0; bottom: 0;'
				: 'height: 1px; left: 0; right: 0;'}
			"
		>
			<div
				class="absolute top-1/2 left-1/2 rounded-sm bg-brand px-1 py-0.5 shadow-sm"
				style="transform: translate(-50%, -50%) {orientation === 'vertical'
					? 'rotate(-90deg)'
					: ''};"
			>
				<span class="font-mono text-[9px] leading-none font-bold text-white">
					{Geometry.toCartesianLabel(cursorCoord, size, orientation === 'vertical')}
				</span>
			</div>
		</div>
	</div>
</div>
