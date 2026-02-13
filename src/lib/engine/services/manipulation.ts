import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';

export class ManipulationService {
	resize(newWidth: number, newHeight: number) {
		const newStitches = Array(newWidth * newHeight).fill('#eee8d5');
		for (let y = 0; y < Math.min(atelier.linen.height, newHeight); y++) {
			for (let x = 0; x < Math.min(atelier.linen.width, newWidth); x++) {
				const oldIdx = y * atelier.linen.width + x;
				const newIdx = y * newWidth + x;
				newStitches[newIdx] = atelier.linen.stitches[oldIdx];
			}
		}
		atelier.linen.reset(newWidth, newHeight, newStitches);
		history.clear();
		sfx.playStitch();
	}

	flip(axis: 'horizontal' | 'vertical') {
		const { width, height, stitches } = atelier.linen;
		const newStitches = [...stitches];

		if (axis === 'horizontal') {
			for (let y = 0; y < height; y++) {
				const row = stitches.slice(y * width, (y + 1) * width);
				row.reverse();
				for (let x = 0; x < width; x++) newStitches[y * width + x] = row[x];
			}
		} else {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const oldIdx = y * width + x;
					const newIdx = (height - 1 - y) * width + x;
					newStitches[newIdx] = stitches[oldIdx];
				}
			}
		}
		atelier.linen.stitches = newStitches;
		history.clear();
		sfx.playStitch();
	}

	rotate() {
		const { width, height, stitches } = atelier.linen;
		if (width !== height) return;

		const newStitches = Array(width * height).fill('#eee8d5');
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const oldIdx = y * width + x;
				const newIdx = x * width + (height - 1 - y);
				newStitches[newIdx] = stitches[oldIdx];
			}
		}
		atelier.linen.stitches = newStitches;
		history.clear();
		sfx.playStitch();
	}

	clearAll() {
		if (confirm('Are you sure you want to unravel the entire project?')) {
			atelier.linen.clear();
			history.clear();
			sfx.playUnstitch();
		}
	}

	/**
	 * Fiber Bleach (Recoloring): Replaces all occurrences of a color with the active dye.
	 */
	bleach() {
		const { x, y } = atelier.needle.pos;
		const targetColor = atelier.linen.getColor(x, y);
		const replacementColor = atelier.activeDye;

		if (targetColor === replacementColor) return;

		const { stitches } = atelier.linen;
		const changes: { index: number; oldColor: string | null; newColor: string | null }[] = [];

		// Selection check
		const hasSelection = atelier.selection.isActive;
		const selectionIndices = atelier.selection.indices;

		stitches.forEach((color, index) => {
			const isCorrectColor = color === targetColor;
			const isInsideSelection = !hasSelection || selectionIndices.has(index);

			if (isCorrectColor && isInsideSelection) {
				changes.push({
					index,
					oldColor: targetColor,
					newColor: replacementColor
				});
				atelier.linen.stitches[index] = replacementColor;
			}
		});

		if (changes.length > 0) {
			history.beginBatch();
			changes.forEach((c) => history.push(c));
			history.endBatch();
			sfx.playStitch();
		}
	}
}
