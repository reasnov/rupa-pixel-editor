import {} from '../types/index.js';
import palettes from '../config/palettes.json' with { type: 'json' };
/**
 * PaletteState: Manages the colors and ingredients selection.
 */
export class PaletteState {
    activeColor = $state(palettes.default[0]);
    swatches = $state(palettes.default);
    select(index) {
        if (index >= 0 && index < this.swatches.length) {
            this.activeColor = this.swatches[index];
        }
    }
    setColor(color) {
        this.activeColor = color;
    }
    loadPalette(name) {
        this.swatches = palettes[name];
        this.activeColor = this.swatches[0];
    }
}
