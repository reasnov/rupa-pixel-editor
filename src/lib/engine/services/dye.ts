import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { SpinnerEngine } from '../spinner.js';

/**
 * DyeService: Manages the artisan's dyes, palette manipulation,
 * and advanced color processing.
 */
export class DyeService {
	/**
	 * Select a dye from the palette by index.
	 */
	select(index: number) {
		atelier.paletteState.select(index);
		sfx.playStitch();
	}

	/**
	 * Set the active dye to a specific hex code.
	 */
	setDye(hex: string) {
		atelier.paletteState.setDye(hex);
		sfx.playStitch();
	}

	/**
	 * Pick a dye from the linen at the current needle position.
	 */
	pickFromLinen() {
		const { x, y } = atelier.needle.pos;
		const color = atelier.linen.getColor(x, y);

		if (color !== null) {
			this.setDye(color);
			atelier.studio.isPicking = true;
			setTimeout(() => {
				atelier.studio.isPicking = false;
			}, 1500);
		}
	}

	/**
	 * Weather the entire palette (Lighten/Darken).
	 */
	weatherPalette(amount: number) {
		atelier.paletteState.swatches = atelier.paletteState.swatches.map((dye) =>
			SpinnerEngine.weather(dye, amount)
		);
		sfx.playStitch();
	}

	/**
	 * Mix the current active dye with another color.
	 */
	mixActiveDye(otherHex: string, ratio = 0.5) {
		const newDye = SpinnerEngine.entwine(atelier.activeDye, otherHex, ratio);
		this.setDye(newDye);
	}
}
