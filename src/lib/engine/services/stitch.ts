import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';

export class StitchService {
	stitch() {
		const { x, y } = atelier.needle.pos;
		const index = atelier.linen.getIndex(x, y);
		const oldColor = atelier.linen.stitches[index];
		const activeDye = atelier.paletteState.activeDye;

		if (oldColor !== activeDye) {
			history.push({ index, oldColor, newColor: activeDye });
			atelier.linen.setColor(x, y, activeDye);
			sfx.playStitch();
		}
	}

	unstitch() {
		const { x, y } = atelier.needle.pos;
		const index = atelier.linen.getIndex(x, y);
		const oldColor = atelier.linen.stitches[index];

		if (oldColor !== null) {
			history.push({ index, oldColor, newColor: null as any });
			atelier.linen.setColor(x, y, null);
			sfx.playUnstitch();
		}
	}

	pickDye() {
		const { x, y } = atelier.needle.pos;
		const color = atelier.linen.getColor(x, y);

		if (color !== null) {
			atelier.paletteState.setDye(color);
			sfx.playStitch();
			atelier.studio.isPicking = true;
			setTimeout(() => {
				atelier.studio.isPicking = false;
			}, 1500);
		}
	}
}
