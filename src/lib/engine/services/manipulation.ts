import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { ColorLogic } from '../../logic/color.js';

export class ManipulationService {
	resize(newWidth: number, newHeight: number) {
		const newPixels = new Uint32Array(newWidth * newHeight);
		// Fill with default background color
		const bgVal = ColorLogic.hexToUint32(editor.backgroundColor);
		newPixels.fill(bgVal);

		for (let y = 0; y < Math.min(editor.canvas.height, newHeight); y++) {
			for (let x = 0; x < Math.min(editor.canvas.width, newWidth); x++) {
				const oldIdx = y * editor.canvas.width + x;
				const newIdx = y * newWidth + x;
				newPixels[newIdx] = editor.canvas.pixels[oldIdx];
			}
		}
		editor.canvas.reset(newWidth, newHeight, newPixels);
		editor.selection.initMask(newWidth, newHeight);
		history.clear();
		sfx.playDraw();
	}

	flip(axis: 'horizontal' | 'vertical') {
		const { width, height } = editor.canvas;
		const frame = editor.project.activeFrame;

		history.beginBatch();
		frame.layers.forEach((layer) => {
			if (layer.type !== 'LAYER') return;
			const pixels = layer.pixels;
			const newPixels = new Uint32Array(pixels.length);

			if (axis === 'horizontal') {
				for (let y = 0; y < height; y++) {
					const start = y * width;
					const row = pixels.subarray(start, start + width);
					const reversed = new Uint32Array(row).reverse();
					newPixels.set(reversed, start);
				}
			} else {
				for (let y = 0; y < height; y++) {
					const oldStart = y * width;
					const newStart = (height - 1 - y) * width;
					newPixels.set(pixels.subarray(oldStart, oldStart + width), newStart);
				}
			}
			layer.pixels = newPixels;
		});

		editor.canvas.triggerPulse();
		history.endBatch();
		editor.studio.show(axis === 'horizontal' ? 'Flipped Horizontally' : 'Flipped Vertically');
		sfx.playDraw();
	}

	rotate() {
		const { width, height } = editor.canvas;
		if (width !== height) {
			editor.studio.show('Only square cups can be rotated');
			return;
		}

		const frame = editor.project.activeFrame;

		history.beginBatch();
		frame.layers.forEach((layer) => {
			if (layer.type !== 'LAYER') return;
			const pixels = layer.pixels;
			const newPixels = new Uint32Array(width * height);

			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const oldIdx = y * width + x;
					const newIdx = x * width + (height - 1 - y);
					newPixels[newIdx] = pixels[oldIdx];
				}
			}
			layer.pixels = newPixels;
		});

		editor.canvas.triggerPulse();
		history.endBatch();
		editor.studio.show('Rotated 90°');
		sfx.playDraw();
	}

	clearAll() {
		if (confirm('Are you sure you want to clear the entire canvas?')) {
			editor.canvas.clear();
			history.clear();
			editor.studio.show('Foam Cleared');
			sfx.playErase();
		}
	}

	/**
	 * Recolor All: Replaces all occurrences of a color with the active one.
	 */
	bleach() {
		const { x, y } = editor.cursor.pos;
		const targetVal = editor.canvas.getColor(x, y);
		const replacementVal = ColorLogic.hexToUint32(editor.activeColor);

		if (targetVal === replacementVal) return;

		const { pixels } = editor.canvas;
		const changes: { index: number; oldColor: string | null; newColor: string | null }[] = [];

		const hasSelection = editor.selection.isActive;
		const selectionSet = editor.selection.activeIndicesSet;

		const currentPixels = new Uint32Array(pixels);

		pixels.forEach((val, index) => {
			const isCorrectColor = val === targetVal;
			const isInsideSelection = !hasSelection || selectionSet.has(index);

			if (isCorrectColor && isInsideSelection) {
				changes.push({
					index,
					oldColor: ColorLogic.uint32ToHex(targetVal),
					newColor: ColorLogic.uint32ToHex(replacementVal)
				});
				currentPixels[index] = replacementVal;
			}
		});

		if (changes.length > 0) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			history.beginBatch();
			changes.forEach((c) => history.push(c));
			history.endBatch();
			sfx.playDraw();
		}
	}
}
