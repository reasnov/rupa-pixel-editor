<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { synapse } from '../../engine/synapse.svelte.js';
	import { shuttlepoint } from '../../engine/shuttlepoint.svelte.js';
	import LinenGuides from './LinenGuides.svelte';
	import Stitch from './Stitch.svelte';
	import SelectionLasso from './SelectionLasso.svelte';
	import GhostFrame from './GhostFrame.svelte';

	let gridEl = $state<HTMLElement | null>(null);

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

	// Ghost (Onion Skinning) Logic
	let ghosts = $derived.by(() => {
		if (!atelier.studio.showGhostThreads) return [];
		const activeIdx = atelier.project.activeFrameIndex;
		const results = [];

		// Frame n-1
		if (activeIdx > 0) {
			results.push({
				stitches: atelier.project.frames[activeIdx - 1].compositeStitches,
				opacity: 0.3
			});
		}
		// Frame n-2
		if (activeIdx > 1) {
			results.push({
				stitches: atelier.project.frames[activeIdx - 2].compositeStitches,
				opacity: 0.1
			});
		}
		return results;
	});

	// Register the grid element with Synapse when it's available
	$effect(() => {
		if (gridEl) {
			// This allows Synapse/ShuttlePoint to know the bounding box for mapping
			// TheLoom.mount will use this reference.
		}
	});

	// Check if the current stroke is snapped for visual feedback
	let isSnapped = $derived(shuttlepoint.isSnappedState);

	// High-performance track string
	let polylinePoints = $derived(
		atelier.linen.strokePoints.map((p) => `${p.x},${p.y}`).join(' ')
	);
</script>

<svelte:window
	onpointermove={(e) => gridEl && shuttlepoint.handleMove(e, gridEl)}
	onpointerup={() => shuttlepoint.handleEnd()}
/>

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
			bind:this={gridEl}
			class="stitch-grid-pattern artisan-checker-small relative h-full w-full shadow-[0_10px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
			style="
				display: grid;
				grid-template-columns: repeat({w}, 1fr); 
				grid-template-rows: repeat({h}, 1fr);
				--grid-cols: {w}; 
				--grid-rows: {h}; 
				background-color: {atelier.studio.canvasBgColor};
				touch-action: none;
			"
			role="grid"
			tabindex="0"
			oncontextmenu={(e) => e.preventDefault()}
			onpointerdown={(e) => gridEl && shuttlepoint.handleStart(e, gridEl)}
		>
			<LinenGuides />

			{#if atelier.studio.showGhostThreads}
				{#each ghosts as ghost, i (i)}
					<GhostFrame stitches={ghost.stitches} width={w} height={h} opacity={ghost.opacity} />
				{/each}
			{/if}

			{#each atelier.linen.compositeStitches as color, i (i)}
				{@const x = i % w}
				{@const y = Math.floor(i / w)}

				<Stitch {color} {x} {y} activeX={atelier.needle.pos.x} activeY={atelier.needle.pos.y} />
			{/each}

			<!-- Pointer Track (Visual Feedback during Dragging) -->
			<svg
				class="pointer-events-none absolute inset-0 z-[20] h-full w-full overflow-visible"
				viewBox="0 0 {w} {h}"
				preserveAspectRatio="none"
			>
				{#if atelier.linen.strokePoints.length > 1}
					<polyline
						points={polylinePoints}
						fill="none"
						stroke={atelier.paletteState.activeDye}
						stroke-width={isSnapped ? '0.08' : '0.03'}
						stroke-dasharray={isSnapped ? 'none' : '0.1 0.1'}
						stroke-linecap="round"
						stroke-linejoin="round"
						class="{isSnapped ? 'drop-shadow-md' : 'marching-ants'} transition-all duration-300"
						style="opacity: {isSnapped ? '1' : '0.4'}"
					/>
				{/if}
			</svg>

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

	.marching-ants {
		animation: ants 1s linear infinite;
	}

	@keyframes ants {
		from {
			stroke-dashoffset: 0.2;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
