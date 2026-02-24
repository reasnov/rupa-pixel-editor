import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';
import { ColorLogic } from '../../logic/color.js';
import { PixelLogic } from '../../logic/pixel.js';

export class ClipboardService {
	copy() {
		const width = editor.canvas.width;
		const points = editor.selection.getPoints(width);
		const bounds = editor.selection.getEffectiveBounds(width);

		if (!bounds || points.length === 0) return;

		const source = editor.canvas.compositePixels; // Layer-Agnostic: Use merged image
		const swatchData = PixelLogic.extractSubGrid(source, width, points, bounds);

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
		let hasChanges = false;

		points.forEach((p) => {
			const index = p.y * width + p.x;
			const oldVal = currentPixels[index];
			if (oldVal !== 0) {
				history.pushPixel(index, oldVal, 0);
				currentPixels[index] = 0;
				hasChanges = true;
			}
		});

		history.endBatch();

		if (hasChanges) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.incrementVersion();
		}

		sfx.playErase();
		editor.selection.clear();
	}

	paste() {
		const cb = editor.project.clipboard;
		if (!cb) return;

		const { x: nx, y: ny } = editor.cursor.pos;
		const { width: lw, height: lh } = editor.canvas;

		history.beginBatch();
		const { data: newData, changes } = PixelLogic.mergeSubGrid(
			editor.canvas.pixels,
			lw,
			lh,
			cb.data,
			cb.width,
			cb.height,
			nx,
			ny
		);

		if (changes.length > 0) {
			changes.forEach((c) => {
				const oldVal = editor.canvas.pixels[c.index];
				history.pushPixel(c.index, oldVal, c.color);
			});

			editor.canvas.pixels = newData;
			editor.canvas.incrementVersion();
			sfx.playDraw();
		}
		history.endBatch();
	}
}
