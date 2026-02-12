import { type ColorHex } from '../../types/index.js';
import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../../engine/audio.js';
import { history } from '../../engine/history.js';

export class ClipboardService {
	copy() {
		const bounds = atelier.selection.bounds;
		if (!bounds) return;

		const { x1, x2, y1, y2 } = bounds;
		const w = x2 - x1 + 1;
		const h = y2 - y1 + 1;
		const data: (ColorHex | null)[] = [];

		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				data.push(atelier.linen.getColor(x, y));
			}
		}
		atelier.project.clipboard = { width: w, height: h, data };
		sfx.playStitch();
	}

	cut() {
		this.copy();
		const bounds = atelier.selection.bounds;
		if (!bounds) return;

		const { x1, x2, y1, y2 } = bounds;

		history.beginBatch();
		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				const index = atelier.linen.getIndex(x, y);
				const oldColor = atelier.linen.stitches[index];
				if (oldColor !== null) {
					history.push({ index, oldColor, newColor: null });
					atelier.linen.setColor(x, y, null);
				}
			}
		}
		history.endBatch();
		sfx.playUnstitch();
	}

	paste() {
		const clip = atelier.project.clipboard;
		if (!clip) return;

		const { x: nx, y: ny } = atelier.needle.pos;

		history.beginBatch();
		for (let y = 0; y < clip.height; y++) {
			for (let x = 0; x < clip.width; x++) {
				const tx = nx + x;
				const ty = ny + y;
				if (atelier.linen.isValidCoord(tx, ty)) {
					const index = atelier.linen.getIndex(tx, ty);
					const oldColor = atelier.linen.stitches[index];
					const newColor = clip.data[y * clip.width + x];
					if (oldColor !== newColor) {
						history.push({ index, oldColor, newColor });
						atelier.linen.setColor(tx, ty, newColor);
					}
				}
			}
		}
		history.endBatch();
		sfx.playStitch();
	}
}
