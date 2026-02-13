<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';

	let { format, scale, bgColor } = $props<{
		format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4';
		scale: number;
		bgColor: string | 'transparent';
	}>();

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	$effect(() => {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const width = atelier.linen.width;
		const height = atelier.linen.height;
		const data = atelier.linen.compositeStitches;

		// Preview scale: fit into a reasonable area (max 400px)
		const maxPreviewSize = 400;
		const previewScale = Math.min(maxPreviewSize / width, maxPreviewSize / height);

		canvasEl.width = width * previewScale;
		canvasEl.height = height * previewScale;
		ctx.imageSmoothingEnabled = false;

		// Draw background
		if (bgColor === 'transparent') {
			ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		} else {
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
		}

		// Draw stitches
		data.forEach((color, i) => {
			if (color === null) return;
			const x = i % width;
			const y = Math.floor(i / width);
			ctx.fillStyle = color;
			ctx.fillRect(
				Math.floor(x * previewScale),
				Math.floor(y * previewScale),
				Math.ceil(previewScale),
				Math.ceil(previewScale)
			);
		});
	});
</script>

<div class="flex flex-col items-center gap-3">
	<div
		class="artisan-checker-small flex items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-white/10 p-2 shadow-inner"
	>
		<canvas bind:this={canvasEl} class="rounded-sm shadow-sm"></canvas>
	</div>

	<div class="flex flex-col items-center gap-1 text-center">
		<span class="font-tiny5 text-[10px] tracking-widest text-brand uppercase"
			>{format} Artifact</span
		>
		<span class="font-mono text-[8px] font-bold tracking-tighter opacity-30">
			{Math.round(atelier.linen.width * scale)} × {Math.round(atelier.linen.height * scale)} pixels
		</span>
	</div>
</div>
