import { type ColorHex } from '../types/index.js';
export interface ColorHSLA {
    h: number;
    s: number;
    l: number;
    a: number;
}
/**
 * ColorLogic: The specialized logic for processing colors.
 */
export declare class ColorLogic {
    /**
     * Converts HSLA color to a HEX string.
     */
    static toHex(hsla: ColorHSLA): ColorHex;
    /**
     * Converts a HEX string back to HSLA.
     */
    static toHSLA(hexStr: ColorHex): ColorHSLA;
    /**
     * Adjust brightness.
     * @param hex HEX color string.
     * @param amount -1.0 to 1.0 (negative for darker, positive for lighter)
     */
    static adjustBrightness(hex: ColorHex, amount: number): ColorHex;
    /**
     * Adjust saturation.
     * @param hex HEX color string.
     * @param amount -1.0 to 1.0
     */
    static adjustSaturation(hex: ColorHex, amount: number): ColorHex;
    /**
     * Adjust opacity.
     * @param hex HEX color string.
     * @param a 0.0 to 1.0
     */
    static adjustOpacity(hex: ColorHex, a: number): ColorHex;
    /**
     * Mix two colors together.
     */
    static mix(colorA: ColorHex, colorB: ColorHex, ratio?: number): ColorHex;
    /**
     * Fast conversion from HEX to RGBA array [r, g, b, a] (0-255).
     * Uses a micro-cache to prevent redundant parsing during render loops.
     */
    private static rgbaCache;
    static toRGBA(hexStr: ColorHex): Uint8ClampedArray;
    /**
     * Fast conversion from HEX to Uint32 (ABGR for little-endian).
     */
    static hexToUint32(hexStr: ColorHex | null): number;
    /**
     * Fast conversion from Uint32 (ABGR) to HEX.
     */
    static uint32ToHex(val: number): ColorHex | null;
    private static hexToRgb;
    private static rgbToHex;
}
