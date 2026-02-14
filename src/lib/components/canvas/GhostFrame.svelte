<script lang="ts">
	import { type ColorHex } from '../../types/index.js';

	let {
		stitches,
		width,
		height,
		opacity = 0.2
	} = $props<{
		stitches: (ColorHex | null)[];
		width: number;
		height: number;
		opacity?: number;
	}>();

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	$effect(() => {
		const ctx = canvasEl?.getContext('2d');
		if (!ctx || !canvasEl) return;

		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, width, height);

		for (let i = 0; i < stitches.length; i++) {
			const color = stitches[i];
			if (color) {
				ctx.fillStyle = color;
				const x = i % width;
				const y = Math.floor(i / width);
				ctx.fillRect(x, y, 1, 1);
			}
		}
	});
</script>

<canvas
	bind:this={canvasEl}
	{width}
	{height}
	class="pointer-events-none absolute inset-0 z-0 h-full w-full"
	style="opacity: {opacity}; image-rendering: pixelated;"
></canvas>
