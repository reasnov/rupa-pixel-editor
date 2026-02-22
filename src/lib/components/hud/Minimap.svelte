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
	class="minimap-container border-b border-evergreen/10 bg-evergreen/5 p-3 transition-all duration-300"
>
	<div
		class="relative flex items-center justify-center overflow-hidden rounded border border-evergreen/5 bg-bamboo-shoot/20 p-2 shadow-inner"
	>
		<canvas
			bind:this={canvasEl}
			width={editor.canvas.width}
			height={editor.canvas.height}
			class="h-auto w-full max-w-[180px] shadow-sm"
			style="image-rendering: pixelated;"
		></canvas>

		<!-- Viewport Indicator (Gold Box) -->
		<div
			class="pointer-events-none absolute inset-0 ring-1 ring-lantern-gold ring-inset"
			style="opacity: 0.4;"
		></div>
	</div>
</div>

<style>
	.minimap-container {
		display: block;
	}
</style>
