import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';
import { ColorLogic } from '../../logic/color.js';

export class ClipboardService {
	copy() {
		const width = editor.canvas.width;
		const points = editor.selection.getPoints(width);
		const bounds = editor.selection.getEffectiveBounds(width);

		if (!bounds || points.length === 0) return;

		const swatchData = new Uint32Array(bounds.width * bounds.height);
		const source = editor.canvas.compositePixels; // Layer-Agnostic: Use merged image

		points.forEach((p) => {
			const sourceIndex = p.y * width + p.x;
			const targetX = p.x - bounds.x1;
			const targetY = p.y - bounds.y1;
			const targetIndex = targetY * bounds.width + targetX;
			swatchData[targetIndex] = source[sourceIndex];
		});

		editor.project.clipboard = {
			width: bounds.width,
			height: bounds.height,
			data: swatchData
		};

		sfx.playDraw();
	}

	cut() {
		this.copy();
		const width = editor.canvas.width;
		const points = editor.selection.getPoints(width);

		if (points.length === 0) return;

		history.beginBatch();
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		points.forEach((p) => {
			const index = p.y * width + p.x;
			const oldVal = currentPixels[index];
			history.push({ index, oldColor: ColorLogic.uint32ToHex(oldVal), newColor: null });
			currentPixels[index] = 0;
		});

		editor.canvas.pixels = currentPixels;
		editor.canvas.triggerPulse();
		history.endBatch();

		sfx.playErase();
		editor.selection.clear();
	}

	paste() {
		const cb = editor.project.clipboard;
		if (!cb) return;

		const { x: nx, y: ny } = editor.cursor.pos;
		const { width: lw, height: lh } = editor.canvas;

		history.beginBatch();
		const currentPixels = new Uint32Array(editor.canvas.pixels);
		let changed = false;

		for (let y = 0; y < cb.height; y++) {
			for (let x = 0; x < cb.width; x++) {
				const tx = nx + x;
				const ty = ny + y;

				if (tx >= 0 && tx < lw && ty >= 0 && ty < lh) {
					const cbIdx = y * cb.width + x;
					const val = cb.data[cbIdx];

					if (val !== 0) {
						const lIdx = ty * lw + tx;
						const oldVal = currentPixels[lIdx];
						history.push({
							index: lIdx,
							oldColor: ColorLogic.uint32ToHex(oldVal),
							newColor: ColorLogic.uint32ToHex(val)
						});
						currentPixels[lIdx] = val;
						changed = true;
					}
				}
			}
		}

		if (changed) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			sfx.playDraw();
		}
		history.endBatch();
	}
}
