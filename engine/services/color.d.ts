/**
 * ColorService: Manages colors, palette manipulation,
 * and advanced color processing.
 */
export declare class ColorService {
    /**
     * Select a color from the palette by index.
     */
    select(index: number): void;
    /**
     * Set the active color to a specific hex code.
     */
    setColor(hex: string): void;
    /**
     * Pick a color from the canvas at the current cursor position.
     */
    pickFromCanvas(): void;
    /**
     * Adjust the entire palette (Lighten/Darken).
     */
    weatherPalette(amount: number): void;
    /**
     * Mix the current active color with another color.
     */
    mixActiveColor(otherHex: string, ratio?: number): void;
    /**
     * Flood Fill: Automatically fills connected pixels of the same color.
     */
    floodFill(): void;
}
