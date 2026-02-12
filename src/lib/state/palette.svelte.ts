import { type ColorHex } from '../types/index.js';

/**
 * PaletteState: Manages the dyes and color selection.
 */
export class PaletteState {
	activeDye = $state<ColorHex>('#073642');

	swatches = $state<ColorHex[]>([
		'#073642',
		'#586e75',
		'#859900',
		'#2aa198',
		'#268bd2',
		'#6c71c4',
		'#d33682',
		'#dc322f',
		'#cb4b16',
		'#b58900'
	]);

	select(index: number) {
		if (index >= 0 && index < this.swatches.length) {
			this.activeDye = this.swatches[index];
		}
	}

	setDye(color: ColorHex) {
		this.activeDye = color;
	}
}
