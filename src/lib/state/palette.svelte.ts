import { type ColorHex } from '../types/index.js';
import palettes from '../config/palettes.json' with { type: 'json' };

/**
 * PaletteState: Manages the dyes and color selection.
 */
export class PaletteState {
	activeDye = $state<ColorHex>(palettes.default[0] as ColorHex);

	swatches = $state<ColorHex[]>(palettes.default as ColorHex[]);

	select(index: number) {
		if (index >= 0 && index < this.swatches.length) {
			this.activeDye = this.swatches[index];
		}
	}

	setDye(color: ColorHex) {
		this.activeDye = color;
	}

	loadPalette(name: keyof typeof palettes) {
		this.swatches = palettes[name] as ColorHex[];
		this.activeDye = this.swatches[0];
	}
}
