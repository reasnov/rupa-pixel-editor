<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { onMount } from 'svelte';
	import { untrack } from 'svelte';

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// Sync minimap canvas with project pixels
	$effect(() => {
		const pulse = editor.canvas.renderPulse;
		const ctx = canvasEl?.getContext('2d');
		if (!ctx || !canvasEl) return;

		const { width, height } = editor.canvas;
		const pixels = editor.canvas.compositePixels;

		const imageData = ctx.createImageData(width, height);
		const data32 = new Uint32Array(imageData.data.buffer);
		data32.set(pixels);

		ctx.putImageData(imageData, 0, 0);
	});
</script>

<div
	class="minimap-container pointer-events-none fixed right-72 bottom-12 z-[200] overflow-hidden rounded-lg border border-charcoal/10 bg-foam-white/80 p-1 shadow-2xl backdrop-blur-md transition-all duration-300"
>
	<div class="relative overflow-hidden rounded border border-charcoal/5 bg-stone-light/20">
		<canvas
			bind:this={canvasEl}
			width={editor.canvas.width}
			height={editor.canvas.height}
			class="max-h-40 max-w-40"
			style="image-rendering: pixelated;"
		></canvas>

		<!-- Viewport Indicator (Magenta Box) -->
		<!-- Note: In a real implementation with panning, we would calculate this based on zoom/pan -->
		<div
			class="pointer-events-none absolute inset-0 ring-1 ring-brand ring-inset"
			style="opacity: 0.4;"
		></div>
	</div>
</div>

<style>
	.minimap-container {
		display: block;
	}
</style>
