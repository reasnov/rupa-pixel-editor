import { atelier } from '../../state/atelier.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';

export class ClipboardService {
	copy() {
		const width = atelier.linen.width;
		const points = atelier.selection.getPoints(width);
		const bounds = atelier.selection.getEffectiveBounds(width);

		if (!bounds || points.length === 0) return;

		const swatchData = new Array(bounds.width * bounds.height).fill(null);
		const source = atelier.linen.compositeStitches; // Layer-Agnostic: Use merged image

		points.forEach((p) => {
			const sourceIndex = p.y * width + p.x;
			const targetX = p.x - bounds.x1;
			const targetY = p.y - bounds.y1;
			const targetIndex = targetY * bounds.width + targetX;
			swatchData[targetIndex] = source[sourceIndex];
		});

		atelier.project.clipboard = {
			width: bounds.width,
			height: bounds.height,
			data: swatchData
		};

		sfx.playStitch();
	}

	cut() {
		this.copy();
		const width = atelier.linen.width;
		const points = atelier.selection.getPoints(width);

		if (points.length === 0) return;

		history.beginBatch();
		points.forEach((p) => {
			const index = p.y * width + p.x;
			const oldColor = atelier.linen.stitches[index];
			history.push({ index, oldColor, newColor: null });
			atelier.linen.stitches[index] = null;
		});
		history.endBatch();

		sfx.playUnstitch();
		atelier.selection.clear();
	}

	paste() {
		const cb = atelier.project.clipboard;
		if (!cb) return;

		const { x: nx, y: ny } = atelier.needle.pos;
		const { width: lw, height: lh } = atelier.linen;

		history.beginBatch();
		for (let y = 0; y < cb.height; y++) {
			for (let x = 0; x < cb.width; x++) {
				const tx = nx + x;
				const ty = ny + y;

				if (tx >= 0 && tx < lw && ty >= 0 && ty < lh) {
					const cbIdx = y * cb.width + x;
					const color = cb.data[cbIdx];

					if (color !== null) {
						const lIdx = ty * lw + tx;
						const oldColor = atelier.linen.stitches[lIdx];
						history.push({ index: lIdx, oldColor, newColor: color });
						atelier.linen.stitches[lIdx] = color;
					}
				}
			}
		}
		history.endBatch();
		sfx.playStitch();
	}
}
