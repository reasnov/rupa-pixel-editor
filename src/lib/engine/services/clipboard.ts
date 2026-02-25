import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';
import { ColorLogic } from '../../logic/color.js';
import { PixelLogic } from '../../logic/pixel.js';
import { __ } from '../../state/i18n.svelte.js';

export class ClipboardService {
	copy() {
		const width = editor.canvas.width;
		const points = editor.selection.getPoints(width);
		const bounds = editor.selection.getEffectiveBounds(width);

		if (!bounds || points.length === 0) {
			editor.studio.show(__('ui:studio.no_selection'));
			return;
		}

		// Layer-Aware: Copy only from the active layer
		const source = editor.canvas.pixels;
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

		if (!points || points.length === 0) return;

		const currentPixels = new Uint32Array(editor.canvas.pixels);
		let hasChanges = false;

		history.beginBatch();

		points.forEach((p) => {
			const index = p.y * width + p.x;
			if (index >= 0 && index < currentPixels.length) {
				const oldVal = currentPixels[index];
				if (oldVal !== 0) {
					history.pushPixel(index, oldVal, 0);
					currentPixels[index] = 0;
					hasChanges = true;
				}
			}
		});

		if (hasChanges) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.incrementVersion();
			history.endBatch(); // Only end if we have changes
			sfx.playErase();
		} else {
			history.clearBatch(); // Utility method to reset current batch buffers
		}

		editor.selection.clear();
	}

	paste() {
		const cb = editor.project.clipboard;
		if (!cb) return;

		// Standard behavior: Top-left corner at cursor position
		const { x: nx, y: ny } = editor.cursor.pos;
		const { width: lw, height: lh } = editor.canvas;

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
			history.beginBatch();
			changes.forEach((c) => {
				const oldVal = editor.canvas.pixels[c.index];
				history.pushPixel(c.index, oldVal, c.color);
			});

			editor.canvas.pixels = newData;
			editor.canvas.incrementVersion();
			history.endBatch();
			sfx.playDraw();
		}
	}
}
