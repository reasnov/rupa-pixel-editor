import { type ColorHex } from '../types/index.js';
import palettes from '../data/palettes.json' with { type: 'json' };
import { ColorLogic } from '../logic/color.js';

export interface PalettePreset {
	id: string;
	name: string;
	colors: ColorHex[];
	isDefault?: boolean;
}

/**
 * PaletteState: Manages the colors and palette presets.
 */
export class PaletteState {
	activeColor = $state<ColorHex>(palettes.sanctuary_nature[0] as ColorHex);
	swatches = $state<ColorHex[]>(palettes.sanctuary_nature as ColorHex[]);
	presets = $state<PalettePreset[]>([]);

	constructor() {
		this.restoreDefaultPresets();

		// Initial Sync
		const sorted = this.sortPaletteForAccessibility([...this.swatches]);
		this.swatches = sorted;
		this.activeColor = sorted[0];
	}

	restoreDefaultPresets() {
		const defaults: PalettePreset[] = Object.entries(palettes).map(([name, colors]) => ({
			id: `default-${name}`,
			name: name.charAt(0).toUpperCase() + name.slice(1),
			colors: this.sortPaletteForAccessibility(colors as ColorHex[]),
			isDefault: true
		}));
		this.presets = defaults;
	}

	/**
	 * Ensures the first color in the palette is always the darkest one
	 * by moving it to the start of the array.
	 */
	private sortPaletteForAccessibility(colors: ColorHex[]): ColorHex[] {
		if (colors.length <= 1) return colors;
		const result = [...colors];
		const darkestIdx = this.findDarkestIndex(result);

		if (darkestIdx !== 0) {
			const [darkest] = result.splice(darkestIdx, 1);
			result.unshift(darkest);
		}

		return result;
	}

	private findDarkestIndex(colors: ColorHex[]): number {
		let minL = 101;
		let darkestIdx = 0;

		colors.forEach((color, idx) => {
			const hsla = ColorLogic.toHSLA(color);
			if (hsla.l < minL) {
				minL = hsla.l;
				darkestIdx = idx;
			}
		});

		return darkestIdx;
	}

	select(index: number) {
		if (index >= 0 && index < this.swatches.length) {
			this.activeColor = this.swatches[index];
		}
	}

	setColor(color: ColorHex) {
		this.activeColor = color;
	}

	addSwatch(color: ColorHex) {
		if (!this.swatches.includes(color)) {
			this.swatches.push(color);
		}
		this.activeColor = color;
	}

	removeSwatch(index: number) {
		if (this.swatches.length <= 1) return;
		this.swatches.splice(index, 1);
		if (!this.swatches.includes(this.activeColor)) {
			this.activeColor = this.swatches[0];
		}
	}

	newPalette() {
		this.swatches = [this.activeColor];
	}

	importPalette(content: string) {
		const colors = ColorLogic.parsePaletteText(content);
		if (colors.length > 0) {
			this.swatches = this.sortPaletteForAccessibility(colors);
			this.activeColor = this.swatches[0];
			return true;
		}
		return false;
	}

	savePreset(name: string) {
		const preset: PalettePreset = {
			id: crypto.randomUUID(),
			name,
			colors: [...this.swatches],
			isDefault: false
		};
		this.presets.push(preset);

		return preset;
	}

	applyPreset(id: string) {
		const preset = this.presets.find((p) => p.id === id);
		if (preset) {
			this.swatches = this.sortPaletteForAccessibility([...preset.colors]);
			this.activeColor = this.swatches[0];
		}
	}

	deletePreset(id: string) {
		const preset = this.presets.find((p) => p.id === id);
		if (preset && !preset.isDefault) {
			this.presets = this.presets.filter((p) => p.id !== id);
		}
	}

	loadPalette(name: keyof typeof palettes) {
		this.swatches = this.sortPaletteForAccessibility(palettes[name] as ColorHex[]);
		this.activeColor = this.swatches[0];
	}
}
