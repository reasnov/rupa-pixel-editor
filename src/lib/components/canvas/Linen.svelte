<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import LinenGuides from './LinenGuides.svelte';
	import Stitch from './Stitch.svelte';
	import SelectionLasso from './SelectionLasso.svelte';

	// The dimensions of the weave
	let w = $derived(atelier.linen.width);
	let h = $derived(atelier.linen.height);

	/**
	 * Precise fitting logic:
	 * We want to fit W x H pixels into the parent, but we must reserve
	 * space for a 1-pixel margin on all sides.
	 * Thus, we treat the 'available' size as being for (W+2) x (H+2) units.
	 */
	let fitWidth = $derived(`calc(100% * ${w} / (${w} + 2))`);
	let fitHeight = $derived(`calc(100% * ${h} / (${h} + 2))`);
</script>

<!-- The Loom Viewport (Parent Container inside the Artisan Frame) -->
<div class="loom-viewport relative flex h-full w-full items-center justify-center overflow-hidden">
	<!-- 
		The Loom Container:
		- Uses aspect-ratio to force 1:1 pixel proportions.
		- Clamped by min() to ensure it fits both width and height constraints of the Artisan Frame.
	-->
	<div
		class="loom-container absolute top-1/2 left-1/2 origin-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
		style="
			transform: {atelier.cameraTransform};
			aspect-ratio: {w} / {h};
			width: min({fitWidth}, calc({fitHeight} * ({w} / {h})));
		"
	>
		<!-- The Actual Linen (The Grid) -->
		<div
			class="stitch-grid-pattern artisan-checker-small relative h-full w-full shadow-[0_10px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
			style="
				display: grid;
				grid-template-columns: repeat({w}, 1fr); 
				grid-template-rows: repeat({h}, 1fr);
				--grid-cols: {w}; 
				--grid-rows: {h}; 
				background-color: {atelier.studio.canvasBgColor};
			"
		>
			<LinenGuides />

			{#each atelier.linen.compositeStitches as color, i (i)}
				{@const x = i % w}
				{@const y = Math.floor(i / w)}

				<Stitch {color} {x} {y} activeX={atelier.needle.pos.x} activeY={atelier.needle.pos.y} />
			{/each}

			<SelectionLasso />
		</div>
	</div>
</div>

<style>
	.loom-viewport {
		/* Subdued background for the area inside the Artisan Frame but outside the Linen */
		background-color: rgba(88, 110, 117, 0.03);
	}

	.loom-container {
		/* Ensure pixels are always square regardless of parent flex/grid behavior */
		display: block;
	}
</style>
