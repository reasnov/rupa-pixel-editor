<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { pointer } from '../../engine/pointer.svelte.js';
	import { mode } from '../../engine/mode.svelte.js';
	import CanvasGuides from './CanvasGuides.svelte';
	import SelectionLasso from './SelectionLasso.svelte';
	import CanvasRuler from './CanvasRuler.svelte';
	import Cursor from './Cursor.svelte';
	import ShapePreview from './ShapePreview.svelte';
	import UnderlayLayer from './UnderlayLayer.svelte';
	import GhostLayers from './GhostLayers.svelte';
	import PointerTrack from './PointerTrack.svelte';

	import { fade } from 'svelte/transition';

	let gridEl = $state<HTMLElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// Dimensions
	let w = $derived(editor.canvas.width);
	let h = $derived(editor.canvas.height);

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
	 */
	$effect(() => {
		if (editor.canvas.version === -1) return;

		const ctx = canvasEl?.getContext('2d', { alpha: true });
		const pixels = editor.canvas.compositePixels;
		if (!ctx || !canvasEl) return;

		ctx.imageSmoothingEnabled = false;

		const imageData = ctx.createImageData(w, h);
		const data32 = new Uint32Array(imageData.data.buffer);
		data32.set(pixels);

		ctx.putImageData(imageData, 0, 0);

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
	<div
		class="z-[30] border-r border-b border-text-main/10 bg-canvas-bg/90 backdrop-blur-md"
		aria-hidden="true"
	></div>

	<div class="relative z-[20] border-b border-text-main/10">
		<CanvasRuler orientation="horizontal" />
	</div>

	<div class="relative z-[20] border-r border-text-main/10">
		<CanvasRuler orientation="vertical" />
	</div>

	<div
		class="bg-hud-shadow/[0.02] relative flex flex-1 items-center justify-center overflow-hidden"
	>
		{#if showTiling}
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
				class="relative h-full w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-text-main/5 outline-none focus:ring-2 focus:ring-fern-green"
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

				<UnderlayLayer />

				<GhostLayers {w} {h} />

				<!-- The High-Performance Surface (Pixels) -->
				<canvas
					bind:this={canvasEl}
					width={w}
					height={h}
					class="pointer-events-none absolute inset-0 h-full w-full"
					style="image-rendering: pixelated;"
				></canvas>

				<ShapePreview {w} {h} />

				<!-- Grid Overlay -->
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

				<PointerTrack {w} {h} />

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
</style>
