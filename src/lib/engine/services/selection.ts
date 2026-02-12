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
}
