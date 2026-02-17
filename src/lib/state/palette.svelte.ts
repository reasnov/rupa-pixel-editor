import { type ColorHex } from '../types/index.js';
import palettes from '../config/palettes.json' with { type: 'json' };

/**
 * PaletteState: Manages the colors and ingredients selection.
 */
export class PaletteState {
	activeColor = $state<ColorHex>(palettes.default[0] as ColorHex);

	swatches = $state<ColorHex[]>(palettes.default as ColorHex[]);

	select(index: number) {
		if (index >= 0 && index < this.swatches.length) {
			this.activeColor = this.swatches[index];
		}
	}

	setColor(color: ColorHex) {
		this.activeColor = color;
	}

	loadPalette(name: keyof typeof palettes) {
		this.swatches = palettes[name] as ColorHex[];
		this.activeColor = this.swatches[0];
	}
}
