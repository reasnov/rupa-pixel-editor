<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { pointer } from '../../engine/pointer.svelte.js';
	import CanvasGuides from './CanvasGuides.svelte';
	import SelectionLasso from './SelectionLasso.svelte';
	import GhostFrame from './GhostFrame.svelte';
	import CanvasRuler from './CanvasRuler.svelte';
	import Cursor from './Cursor.svelte';

	let gridEl = $state<HTMLElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// Dimensions
	let w = $derived(editor.canvas.width);
	let h = $derived(editor.canvas.height);

	// Onion Skinning
	let ghosts = $derived.by(() => {
		if (!editor.showGhostLayers) return [];
		const activeIdx = editor.project.activeFrameIndex;
		const results = [];

		if (activeIdx > 0) {
			results.push({
				pixels: editor.project.frames[activeIdx - 1].compositePixels,
				opacity: 0.3
			});
		}
		if (activeIdx > 1) {
			results.push({
				pixels: editor.project.frames[activeIdx - 2].compositePixels,
				opacity: 0.1
			});
		}
		return results;
	});

	let isSnapped = $derived(pointer.isSnappedState);
	let polylinePoints = $derived(editor.canvas.strokePoints.map((p) => `${p.x},${p.y}`).join(' '));

	function handleWheel(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			editor.studio.setZoom(delta);
		}
	}

	/**
	 * High-Performance Render Loop for the Main Canvas.
	 */
	$effect(() => {
		const ctx = canvasEl?.getContext('2d', { alpha: true });
		const pixels = editor.canvas.compositePixels;
		if (!ctx || !canvasEl) return;

		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, w, h);

		for (let i = 0; i < pixels.length; i++) {
			const color = pixels[i];
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
	onpointermove={(e) => gridEl && pointer.handleMove(e, gridEl)}
	onpointerup={() => pointer.handleEnd()}
/>

<div
	class="canvas-viewport relative grid h-full w-full grid-cols-[20px_1fr] grid-rows-[20px_1fr] overflow-hidden"
	onwheel={handleWheel}
>
	<!-- Corner Piece -->
	<div
		class="z-[110] border-r border-b border-charcoal/10 bg-foam-white/90 backdrop-blur-md"
		aria-hidden="true"
	></div>

	<!-- Top Ruler -->
	<div class="relative z-[100] border-b border-charcoal/10">
		<CanvasRuler orientation="horizontal" />
	</div>

	<!-- Left Ruler -->
	<div class="relative z-[100] border-r border-charcoal/10">
		<CanvasRuler orientation="vertical" />
	</div>

	<!-- The Main Working Area -->
	<div class="relative flex flex-1 items-center justify-center overflow-hidden bg-charcoal/[0.02]">
		<div
			class="canvas-container absolute top-1/2 left-1/2 origin-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
			style="
				transform: {editor.cameraTransform};
				aspect-ratio: {w} / {h};
				width: {editor.canvas.getFitDimension('horizontal')};
			"
		>
			<div
				bind:this={gridEl}
				class="relative h-full w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-charcoal/5"
				style="
					background-color: {editor.backgroundColor};
					touch-action: none;
				"
				role="grid"
				tabindex="0"
				oncontextmenu={(e) => e.preventDefault()}
				onpointerdown={(e) => gridEl && pointer.handleStart(e, gridEl)}
			>
				<CanvasGuides />

				{#if editor.showGhostLayers}
					{#each ghosts as ghost, i (i)}
						<GhostFrame pixels={ghost.pixels} width={w} height={h} opacity={ghost.opacity} />
					{/each}
				{/if}

				<!-- The High-Performance Surface (Pixels) -->
				<canvas
					bind:this={canvasEl}
					width={w}
					height={h}
					class="pointer-events-none absolute inset-0 h-full w-full"
					style="image-rendering: pixelated;"
				></canvas>

				<!-- Grid Overlay (Now on top of pixels) -->
				<div 
					class="pixel-grid-surface pointer-events-none absolute inset-0 z-10 h-full w-full"
					style="--grid-cols: {w}; --grid-rows: {h};"
				></div>

				<!-- The Cursor -->
				<div class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
					<div
						class="absolute transition-all duration-75 ease-out"
						style="
							left: {(editor.cursor.pos.x / w) * 100}%; 
							top: {(editor.cursor.pos.y / h) * 100}%; 
							width: {100 / w}%; 
							height: {100 / h}%;
						"
					>
						<Cursor />
					</div>
				</div>

				<!-- Visual Pointer Track -->
				<svg
					class="pointer-events-none absolute inset-0 z-[20] h-full w-full overflow-visible"
					viewBox="0 0 {w} {h}"
					preserveAspectRatio="none"
				>
					{#if editor.canvas.strokePoints.length > 1}
						<polyline
							points={polylinePoints}
							fill="none"
							stroke={editor.paletteState.activeColor}
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
	.canvas-viewport {
		background-color: var(--color-stone-light);
		container-type: size;
	}

	.canvas-container {
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
