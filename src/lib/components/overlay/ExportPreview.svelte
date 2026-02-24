<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { ColorLogic } from '../../logic/color.js';

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

		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const data = editor.canvas.compositePixels;
		// Make it fully reactive to the Studio State
		const includeBorders = editor.studio.includePixelBorders;

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

		// Draw pixels
		data.forEach((val, i) => {
			if (val === 0) return;
			const color = ColorLogic.uint32ToHex(val)!;
			const x = i % width;
			const y = Math.floor(i / width);
			const px = Math.floor(x * previewScale);
			const py = Math.floor(y * previewScale);
			const pw = Math.ceil(previewScale);
			const ph = Math.ceil(previewScale);

			ctx.fillStyle = color;
			ctx.fillRect(px, py, pw, ph);

			// Draw border if enabled
			if (includeBorders) {
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
				ctx.lineWidth = 1;
				ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
			}
		});
	});
</script>

<div class="flex flex-col items-center gap-3">
	<div
		class="editor-checker-small flex items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-white/10 p-2 shadow-inner"
	>
		<canvas bind:this={canvasEl} class="rounded-sm shadow-sm"></canvas>
	</div>

	<div class="flex flex-col items-center gap-1 text-center">
		<span class="font-tiny5 text-[10px] tracking-widest text-lantern-gold uppercase">
			{__('export:file_label', { replace: { format } })}
		</span>
		<span class="font-mono text-[8px] font-bold tracking-tighter opacity-30">
			{__('export:dimensions_label', {
				replace: {
					width: Math.round(editor.canvas.width * scale),
					height: Math.round(editor.canvas.height * scale)
				}
			})}
		</span>
	</div>
</div>
