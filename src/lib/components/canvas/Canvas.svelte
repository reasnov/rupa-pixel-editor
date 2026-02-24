<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { pointer } from '../../engine/pointer.svelte.js';
	import { mode } from '../../engine/mode.svelte.js';
	import CanvasGuides from './CanvasGuides.svelte';
	import SelectionLasso from './SelectionLasso.svelte';
	import GhostFrame from './GhostFrame.svelte';
	import CanvasRuler from './CanvasRuler.svelte';
	import Cursor from './Cursor.svelte';

	import { ColorLogic } from '../../logic/color.js';
	import { fade } from 'svelte/transition';
	import { untrack } from 'svelte';

	let gridEl = $state<HTMLElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// Dimensions
	let w = $derived(editor.canvas.width);
	let h = $derived(editor.canvas.height);

	// Onion Skinning
	let ghosts = $derived.by(() => {
		if (!editor.showGhostLayers) return [];
		const activeIdx = editor.project.activeFrameIndex;
		const frames = editor.project.frames;
		const results = [];

		// Past Echoes (1 to 3 cups back) - Tinted Cool Mist
		for (let i = 1; i <= 3; i++) {
			const idx = activeIdx - i;
			if (idx >= 0) {
				results.push({
					id: `past-${idx}`,
					pixels: frames[idx].compositePixels,
					opacity: 0.4 / i,
					tint: '#8d99ae'
				});
			}
		}

		// Future Echoes (1 to 3 cups forward) - Tinted Sage Leaf
		for (let i = 1; i <= 3; i++) {
			const idx = activeIdx + i;
			if (idx < frames.length) {
				results.push({
					id: `future-${idx}`,
					pixels: frames[idx].compositePixels,
					opacity: 0.4 / i,
					tint: '#a3b18a'
				});
			}
		}
		return results;
	});

	let isSnapped = $derived(pointer.isSnappedState);
	let polylinePoints = $derived(editor.canvas.strokePoints.map((p) => `${p.x},${p.y}`).join(' '));

	// Tiling Preview
	let showTiling = $derived(editor.studio.isTilingEnabled);
	let canvasDataUrl = $state('');

	function handleWheel(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			editor.studio.setZoom(delta);
		}
	}

	/**
	 * High-Performance Render Loop for the Main Canvas.
	 * Using ImageData + putImageData to bypass thousand of fillRect calls.
	 */
	$effect(() => {
		// Listen to the pulse (v0.8.0 Steam Pump)
		if (editor.canvas.renderPulse === -1) return;

		const ctx = canvasEl?.getContext('2d', { alpha: true });
		const pixels = editor.canvas.compositePixels;
		if (!ctx || !canvasEl) return;

		ctx.imageSmoothingEnabled = false;

		const imageData = ctx.createImageData(w, h);
		// Direct memory copy using Uint32Array view
		const data32 = new Uint32Array(imageData.data.buffer);
		data32.set(pixels);

		ctx.putImageData(imageData, 0, 0);

		// Capture for Tiling Preview
		if (showTiling) {
			canvasDataUrl = canvasEl.toDataURL();
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
		class="z-[30] border-r border-b border-evergreen/10 bg-washi-white/90 backdrop-blur-md"
		aria-hidden="true"
	></div>

	<!-- Top Ruler -->
	<div class="relative z-[20] border-b border-evergreen/10">
		<CanvasRuler orientation="horizontal" />
	</div>

	<!-- Left Ruler -->
	<div class="relative z-[20] border-r border-evergreen/10">
		<CanvasRuler orientation="vertical" />
	</div>

	<!-- The Main Working Area -->
	<div
		class="relative flex flex-1 items-center justify-center overflow-hidden bg-deep-forest/[0.02]"
	>
		{#if showTiling}
			<!-- Tiled Preview (3x3 grid) - Using CSS repeat for performance -->
			<div
				transition:fade
				class="pointer-events-none absolute inset-0 z-0 opacity-20 blur-[1px] grayscale"
				style="
					background-image: url({canvasDataUrl});
					background-repeat: repeat;
					background-size: {editor.canvas.getFitDimension('horizontal')} {editor.canvas.getFitDimension(
					'vertical'
				)};
					background-position: center;
					transform: {editor.cameraTransform};
				"
			></div>
		{/if}

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
				class="relative h-full w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-evergreen/5 outline-none focus:ring-2 focus:ring-fern-green"
				style="
										background-color: {editor.backgroundColor};
										touch-action: none;
										cursor: {mode.current.type === 'PAN'
					? pointer.isPointerDownActive
						? 'grabbing'
						: 'grab'
					: 'crosshair'};
									"
				role="grid"
				tabindex="0"
				oncontextmenu={(e) => e.preventDefault()}
				onpointerdown={(e) => gridEl && pointer.handleStart(e, gridEl)}
			>
				<CanvasGuides />

				{#if editor.studio.underlayImage && editor.studio.isUnderlayVisible}
					<div
						transition:fade
						class="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
						style="opacity: {editor.studio.underlayOpacity}"
					>
						<img
							src={editor.studio.underlayImage}
							alt="Underlay"
							class="absolute origin-top-left"
							style="
								transform: translate({editor.studio.underlayOffset.x}px, {editor.studio.underlayOffset
								.y}px) scale({editor.studio.underlayScale});
								image-rendering: auto;
							"
						/>
					</div>
				{/if}

				{#if editor.showGhostLayers}
					{#each ghosts as ghost (ghost.id)}
						<GhostFrame
							pixels={ghost.pixels}
							width={w}
							height={h}
							opacity={ghost.opacity}
							tint={ghost.tint}
						/>
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

				<!-- Shape Preview Layer (Geometric Stance) -->
				{#if editor.studio.activeTool !== 'BRUSH' && editor.studio.shapeAnchor}
					{@const anchor = editor.studio.shapeAnchor}
					{@const cursor = editor.cursor.pos}
					{@const x1 = Math.min(anchor.x, cursor.x)}
					{@const y1 = Math.min(anchor.y, cursor.y)}
					{@const x2 = Math.max(anchor.x, cursor.x)}
					{@const y2 = Math.max(anchor.y, cursor.y)}
					{@const rw = x2 - x1 + 1}
					{@const rh = y2 - y1 + 1}
					<svg
						class="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible"
						viewBox="0 0 {w} {h}"
						preserveAspectRatio="none"
					>
						{#if editor.studio.activeTool === 'RECTANGLE'}
							<rect
								x={x1}
								y={y1}
								width={rw}
								height={rh}
								fill="none"
								stroke="var(--color-fern-green)"
								stroke-width="0.1"
								stroke-dasharray="0.2, 0.2"
								class="marching-ants"
							/>
						{:else if editor.studio.activeTool === 'ELLIPSE'}
							<ellipse
								cx={x1 + rw / 2}
								cy={y1 + rh / 2}
								rx={rw / 2}
								ry={rh / 2}
								fill="none"
								stroke="var(--color-fern-green)"
								stroke-width="0.1"
								stroke-dasharray="0.2, 0.2"
								class="marching-ants"
							/>
						{:else if editor.studio.activeTool === 'POLYGON'}
							{@const xc = (anchor.x + cursor.x) / 2}
							{@const yc = (anchor.y + cursor.y) / 2}
							{@const r =
								Math.max(Math.abs(cursor.x - anchor.x), Math.abs(cursor.y - anchor.y)) / 2}
							{@const sides = editor.studio.polygonSides}
							{@const indent = editor.studio.polygonIndentation}
							{@const polyPoints = Array.from({ length: indent > 0 ? sides * 2 : sides }).map(
								(_, i) => {
									const angle = -Math.PI / 2 + (i * 2 * Math.PI) / (indent > 0 ? sides * 2 : sides);
									const currentR = indent > 0 ? (i % 2 === 0 ? r : r * (1 - indent / 100)) : r;
									return `${xc + 0.5 + Math.cos(angle) * currentR},${yc + 0.5 + Math.sin(angle) * currentR}`;
								}
							)}
							<polyline
								points={polyPoints.join(' ')}
								fill="none"
								stroke="var(--color-fern-green)"
								stroke-width="0.1"
								stroke-dasharray="0.2, 0.2"
								class="marching-ants"
							/>
							<!-- Connect last to first -->
							<line
								x1={xc +
									0.5 +
									Math.cos(
										-Math.PI / 2 +
											(((indent > 0 ? sides * 2 : sides) - 1) * 2 * Math.PI) /
												(indent > 0 ? sides * 2 : sides)
									) *
										(indent > 0
											? ((indent > 0 ? sides * 2 : sides) - 1) % 2 === 0
												? r
												: r * (1 - indent / 100)
											: r)}
								y1={yc +
									0.5 +
									Math.sin(
										-Math.PI / 2 +
											(((indent > 0 ? sides * 2 : sides) - 1) * 2 * Math.PI) /
												(indent > 0 ? sides * 2 : sides)
									) *
										(indent > 0
											? ((indent > 0 ? sides * 2 : sides) - 1) % 2 === 0
												? r
												: r * (1 - indent / 100)
											: r)}
								x2={xc + 0.5 + Math.cos(-Math.PI / 2) * r}
								y2={yc + 0.5 + Math.sin(-Math.PI / 2) * r}
								stroke="var(--color-fern-green)"
								stroke-width="0.1"
								stroke-dasharray="0.2, 0.2"
								class="marching-ants"
							/>
						{/if}
					</svg>
				{/if}

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
