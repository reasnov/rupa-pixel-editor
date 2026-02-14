<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttlepoint } from '../../engine/shuttlepoint.svelte.js';
	import LinenGuides from './LinenGuides.svelte';
	import SelectionLasso from './SelectionLasso.svelte';
	import GhostFrame from './GhostFrame.svelte';
	import LinenRuler from './LinenRuler.svelte';
	import Needle from './Needle.svelte';
	import { onMount } from 'svelte';

	let gridEl = $state<HTMLElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// The dimensions of the weave
	let w = $derived(atelier.linen.width);
	let h = $derived(atelier.linen.height);

	// Ghost (Onion Skinning) Logic
	let ghosts = $derived.by(() => {
		if (!atelier.studio.showGhostThreads) return [];
		const activeIdx = atelier.project.activeFrameIndex;
		const results = [];

		if (activeIdx > 0) {
			results.push({
				stitches: atelier.project.frames[activeIdx - 1].compositeStitches,
				opacity: 0.3
			});
		}
		if (activeIdx > 1) {
			results.push({
				stitches: atelier.project.frames[activeIdx - 2].compositeStitches,
				opacity: 0.1
			});
		}
		return results;
	});

	// Check if the current stroke is snapped for visual feedback
	let isSnapped = $derived(shuttlepoint.isSnappedState);

	// High-performance track string
	let polylinePoints = $derived(atelier.linen.strokePoints.map((p) => `${p.x},${p.y}`).join(' '));

	function handleWheel(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			atelier.studio.setZoom(delta);
		}
	}

	/**
	 * High-Performance Render Loop for the Linen Canvas.
	 * Redraws only when the composite stitches change.
	 */
	$effect(() => {
		const ctx = canvasEl?.getContext('2d', { alpha: true });
		const stitches = atelier.linen.compositeStitches;
		if (!ctx || !canvasEl) return;

		// Use crisp pixel rendering
		ctx.imageSmoothingEnabled = false;

		// Clear and draw
		ctx.clearRect(0, 0, w, h);

		for (let i = 0; i < stitches.length; i++) {
			const color = stitches[i];
			if (color) {
				const x = i % w;
				const y = Math.floor(i / w);
				ctx.fillStyle = color;
				ctx.fillRect(x, y, 1, 1);
			}
		}
	});
</script>

<svelte:window
	onpointermove={(e) => gridEl && shuttlepoint.handleMove(e, gridEl)}
	onpointerup={() => shuttlepoint.handleEnd()}
/>

<!-- The Loom Viewport (Grid Layout to prevent overlaps) -->
<div
	class="loom-viewport relative grid h-full w-full grid-cols-[20px_1fr] grid-rows-[20px_1fr] overflow-hidden"
	onwheel={handleWheel}
>
	<!-- Corner Piece -->
	<div
		class="z-[110] border-r border-b border-black/10 bg-[#fdf6e3]/90 backdrop-blur-md"
		aria-hidden="true"
	></div>

	<!-- Top Ruler -->
	<div class="relative z-[100] border-b border-black/10">
		<LinenRuler orientation="horizontal" />
	</div>

	<!-- Left Ruler -->
	<div class="relative z-[100] border-r border-black/10">
		<LinenRuler orientation="vertical" />
	</div>

	<!-- 
		The Loom Working Area:
		Centered in the remaining space.
	-->
	<div class="relative flex flex-1 items-center justify-center overflow-hidden bg-grid-border/5">
		<div
			class="loom-container absolute top-1/2 left-1/2 origin-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
			style="
				transform: {atelier.cameraTransform};
				aspect-ratio: {w} / {h};
				width: {atelier.linen.getFitDimension('horizontal')};
			"
		>
			<!-- The Actual Linen (The Canvas-based Grid) -->
			<div
				bind:this={gridEl}
				class="stitch-grid-pattern artisan-checker-small relative h-full w-full shadow-[0_10px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
				style="
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

				<!-- The High-Performance Pixel Surface -->
				<canvas
					bind:this={canvasEl}
					width={w}
					height={h}
					class="pointer-events-none absolute inset-0 h-full w-full"
					style="image-rendering: pixelated;"
				></canvas>

				<!-- Needle is now an overlay instead of being inside each stitch -->
				<div class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
					<div
						class="absolute transition-all duration-75 ease-out"
						style="
							left: {(atelier.needle.pos.x / w) * 100}%; 
							top: {(atelier.needle.pos.y / h) * 100}%; 
							width: {100 / w}%; 
							height: {100 / h}%;
						"
					>
						<Needle />
					</div>
				</div>

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
</div>

<style>
	.loom-viewport {
		/* Subdued background for the area inside the Artisan Frame but outside the Linen */
		background-color: rgba(88, 110, 117, 0.03);
		container-type: size;
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
