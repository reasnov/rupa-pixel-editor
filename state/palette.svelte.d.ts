import { type ColorHex } from '../types/index.js';
import palettes from '../config/palettes.json';
/**
 * PaletteState: Manages the colors and ingredients selection.
 */
export declare class PaletteState {
    activeColor: string;
    swatches: string[];
    select(index: number): void;
    setColor(color: ColorHex): void;
    loadPalette(name: keyof typeof palettes): void;
}
