import { atelier } from '../../state/atelier.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';

/**
 * SelectionService: Handles the logic for defining regions (Looming)
 * and performing mass manipulation on those regions (Batch Fill).
 */
export class SelectionService {
	begin(x: number, y: number) {
		atelier.selection.begin(x, y);
	}

	update(x: number, y: number) {
		if (atelier.selection.isActive) {
			atelier.selection.update(x, y);
		}
	}

	clear() {
		atelier.selection.clear();
	}

	/**
	 * Batch Fill: Fills the selected region with the active dye.
	 */
	commit() {
		const bounds = atelier.selection.bounds;
		if (!bounds) return;

		const { x1, x2, y1, y2 } = bounds;
		const activeDye = atelier.paletteState.activeDye;

		history.beginBatch();
		let changed = false;

		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				const index = atelier.linen.getIndex(x, y);
				const oldColor = atelier.linen.stitches[index];
				if (oldColor !== activeDye) {
					history.push({ index, oldColor, newColor: activeDye });
					atelier.linen.setColor(x, y, activeDye);
					changed = true;
				}
			}
		}

		history.endBatch();
		if (changed) sfx.playStitch();
	}

	/**
	 * Spirit Pick (Magic Wand): Selects all connected stitches of the same color.
	 */
	spiritPick() {
		const { x, y } = atelier.needle.pos;
		const targetColor = atelier.linen.getColor(x, y);
		const width = atelier.linen.width;
		const height = atelier.linen.height;

		const queue: [number, number][] = [[x, y]];
		const visited = new Set<string>();

		atelier.selection.clear();

		while (queue.length > 0) {
			const [cx, cy] = queue.shift()!;
			const key = `${cx},${cy}`;

			if (visited.has(key)) continue;
			visited.add(key);

			if (atelier.linen.getColor(cx, cy) === targetColor) {
				atelier.selection.indices.add(cy * width + cx);

				const neighbors: [number, number][] = [
					[cx + 1, cy],
					[cx - 1, cy],
					[cx, cy + 1],
					[cx, cy - 1]
				];

				for (const [nx, ny] of neighbors) {
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						queue.push([nx, ny]);
					}
				}
			}
		}

		if (atelier.selection.indices.size > 0) {
			sfx.playStitch();
		}
	}
}
