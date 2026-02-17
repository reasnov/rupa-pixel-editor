import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';

export class ManipulationService {
	resize(newWidth: number, newHeight: number) {
		const newPixels = Array(newWidth * newHeight).fill('#eee8d5');
		for (let y = 0; y < Math.min(editor.canvas.height, newHeight); y++) {
			for (let x = 0; x < Math.min(editor.canvas.width, newWidth); x++) {
				const oldIdx = y * editor.canvas.width + x;
				const newIdx = y * newWidth + x;
				newPixels[newIdx] = editor.canvas.pixels[oldIdx];
			}
		}
		editor.canvas.reset(newWidth, newHeight, newPixels);
		history.clear();
		sfx.playDraw();
	}

	flip(axis: 'horizontal' | 'vertical') {
		const { width, height, pixels } = editor.canvas;
		const newPixels = [...pixels];

		if (axis === 'horizontal') {
			for (let y = 0; y < height; y++) {
				const row = pixels.slice(y * width, (y + 1) * width);
				row.reverse();
				for (let x = 0; x < width; x++) newPixels[y * width + x] = row[x];
			}
		} else {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const oldIdx = y * width + x;
					const newIdx = (height - 1 - y) * width + x;
					newPixels[newIdx] = pixels[oldIdx];
				}
			}
		}
		editor.canvas.pixels = newPixels;
		history.clear();
		sfx.playDraw();
	}

	rotate() {
		const { width, height, pixels } = editor.canvas;
		if (width !== height) return;

		const newPixels = Array(width * height).fill('#eee8d5');
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const oldIdx = y * width + x;
				const newIdx = x * width + (height - 1 - y);
				newPixels[newIdx] = pixels[oldIdx];
			}
		}
		editor.canvas.pixels = newPixels;
		history.clear();
		sfx.playDraw();
	}

	clearAll() {
		if (confirm('Are you sure you want to clear the entire canvas?')) {
			editor.canvas.clear();
			history.clear();
			sfx.playErase();
		}
	}

	/**
	 * Recolor All: Replaces all occurrences of a color with the active one.
	 */
	bleach() {
		const { x, y } = editor.cursor.pos;
		const targetColor = editor.canvas.getColor(x, y);
		const replacementColor = editor.activeColor;

		if (targetColor === replacementColor) return;

		const { pixels } = editor.canvas;
		const changes: { index: number; oldColor: string | null; newColor: string | null }[] = [];

		const hasSelection = editor.selection.isActive;
		const selectionIndices = editor.selection.indices;

		pixels.forEach((color, index) => {
			const isCorrectColor = color === targetColor;
			const isInsideSelection = !hasSelection || selectionIndices.includes(index);

			if (isCorrectColor && isInsideSelection) {
				changes.push({
					index,
					oldColor: targetColor,
					newColor: replacementColor
				});
				editor.canvas.pixels[index] = replacementColor;
			}
		});

		if (changes.length > 0) {
			history.beginBatch();
			changes.forEach((c) => history.push(c));
			history.endBatch();
			sfx.playDraw();
		}
	}
}
