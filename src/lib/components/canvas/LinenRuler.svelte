<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { Geometry } from '../../logic/geometry.js';

	let { orientation = 'horizontal' } = $props<{ orientation: 'horizontal' | 'vertical' }>();

	let w = $derived(atelier.linen.width);
	let h = $derived(atelier.linen.height);
	let size = $derived(orientation === 'horizontal' ? w : h);
	let needlePos = $derived(orientation === 'horizontal' ? atelier.needle.pos.x : atelier.needle.pos.y);

	// Adaptive Interval based on Zoom
	let majorInterval = $derived.by(() => {
		const zoom = atelier.studio.zoomLevel;
		if (zoom <= 0.5) return 16;
		if (zoom <= 1.5) return 8;
		if (zoom <= 4) return 4;
		return 2;
	});

	let fitDimension = $derived(atelier.linen.getFitDimension(orientation));

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

	let labelsTransform = $derived.by(() => {
		const effectiveZoom = atelier.studio.zoomLevel;
		const posPct = ((needlePos + 0.5) / size) * 100;

		if (atelier.studio.zoomLevel <= 1) {
			return orientation === 'horizontal' 
				? `translate(-50%, 0) scale(${effectiveZoom})`
				: `translate(0, -50%) scale(${effectiveZoom})`;
		} else {
			return orientation === 'horizontal'
				? `translate(-${posPct}%, 0) scale(${effectiveZoom})`
				: `translate(0, -${posPct}%) scale(${effectiveZoom})`;
		}
	});

	let counterScale = $derived(1 / atelier.studio.zoomLevel);
</script>

<div
	class="pointer-events-none relative h-full w-full overflow-hidden bg-[#fdf6e3] backdrop-blur-sm"
	role="presentation"
	aria-label="{orientation} ruler"
>
	<!-- 
		The Ruler Content Surface:
		Shares the exact same transform logic as the Linen to ensure perfect sync.
	-->
	<div
		class="absolute flex {orientation === 'vertical' ? 'flex-col' : ''}"
		style="
			left: {orientation === 'horizontal' ? '50%' : '0'};
			top: {orientation === 'vertical' ? '50%' : '0'};
			transform: {labelsTransform}; 
			transform-origin: {orientation === 'horizontal' ? 'center top' : 'left center'};
			{orientation === 'horizontal' ? 'width' : 'height'}: {fitDimension};
			{orientation === 'vertical' ? 'width' : 'height'}: 100%;
		"
	>
		<!-- Ticks (CSS Gradients) -->
		<div
			class="absolute opacity-10 {orientation === 'horizontal' ? 'bottom-0 left-0 right-0 h-1/2' : 'right-0 top-0 bottom-0 w-1/2'}"
			style="
				background-image: linear-gradient({orientation === 'horizontal' ? 'to right' : 'to bottom'}, 
					rgba(0,0,0,1) 1px, transparent 1px);
				background-size: {orientation === 'horizontal' ? `calc(100% / ${size}) 100%` : `100% calc(100% / ${size})`};
			"
		></div>

		<!-- Major Ticks -->
		<div
			class="absolute opacity-20 {orientation === 'horizontal' ? 'bottom-0 left-0 right-0 h-3/4' : 'right-0 top-0 bottom-0 w-3/4'}"
			style="
				background-image: linear-gradient({orientation === 'horizontal' ? 'to right' : 'to bottom'}, 
					rgba(0,0,0,1) 1.5px, transparent 1.5px);
				background-size: {orientation === 'horizontal' ? `calc(100% / ${size} * ${majorInterval}) 100%` : `100% calc(100% / ${size} * ${majorInterval})`};
			"
		></div>

		<!-- Labels -->
		{#each markers as marker (marker.pos)}
			<div
				class="absolute flex items-center justify-center"
				style="
					{orientation === 'horizontal' ? 'left' : 'top'}: {(marker.pos / size) * 100}%;
					{orientation === 'horizontal' ? 'width' : 'height'}: {100 / size}%;
					{orientation === 'horizontal' ? 'height' : 'width'}: 100%;
				"
			>
				<div style="transform: scale({counterScale}) {orientation === 'vertical' ? 'rotate(-90deg)' : ''};">
					<span
						class="font-mono text-[12px] font-medium text-black/50 whitespace-nowrap"
					>
						{marker.label}
					</span>
				</div>
			</div>
		{/each}

		<!-- 
			Highlight Indicator:
			Now inside the transformed container, guaranteed to sync.
		-->
		<div
			class="absolute z-20 transition-all duration-75 ease-out {orientation === 'horizontal'
				? 'top-0 bottom-0 bg-brand shadow-[0_0_8px_rgba(211,54,130,0.5)]'
				: 'left-0 right-0 bg-brand shadow-[0_0_8px_rgba(211,54,130,0.5)]'}"
			style="
				{orientation === 'horizontal' ? 'left' : 'top'}: {((needlePos + 0.5) / size) * 100}%;
				{orientation === 'horizontal' ? 'width' : 'height'}: calc(1px * {counterScale});
			"
		>
			<div 
				class="absolute top-1/2 left-1/2 bg-brand/90 backdrop-blur-sm px-1.5 py-0.5 rounded-sm shadow-lg border border-white/20"
				style="transform: translate(-50%, -50%) scale({counterScale}) {orientation === 'vertical' ? 'rotate(-90deg)' : ''};"
			>
				<span class="font-mono text-[12px] font-bold text-white leading-none">
					{Geometry.toCartesianLabel(needlePos, size, orientation === 'vertical')}
				</span>
			</div>
		</div>
	</div>
</div>
