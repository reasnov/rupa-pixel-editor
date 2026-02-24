import { describe, it, expect } from 'vitest';
import { ColorLogic } from '../../lib/logic/color.js';

describe('ColorLogic', () => {
	describe('HEX & HSLA Conversions', () => {
		it('should convert HSLA to HEX correctly', () => {
			expect(ColorLogic.toHex({ h: 0, s: 0, l: 100, a: 1 })).toBe('#ffffff');
			expect(ColorLogic.toHex({ h: 0, s: 0, l: 0, a: 1 })).toBe('#000000');
			expect(ColorLogic.toHex({ h: 0, s: 100, l: 50, a: 1 })).toBe('#ff0000');
			expect(ColorLogic.toHex({ h: 120, s: 100, l: 50, a: 1 })).toBe('#00ff00');
			expect(ColorLogic.toHex({ h: 240, s: 100, l: 50, a: 1 })).toBe('#0000ff');
		});

		it('should handle alpha channel in HEX', () => {
			expect(ColorLogic.toHex({ h: 0, s: 100, l: 50, a: 0.5 })).toBe('#ff000080');
			expect(ColorLogic.toHex({ h: 0, s: 100, l: 50, a: 0 })).toBe('#ff000000');
		});

		it('should convert HEX to HSLA correctly', () => {
			expect(ColorLogic.toHSLA('#ff0000')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHSLA('#00ff00')).toEqual({ h: 120, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHSLA('#0000ff')).toEqual({ h: 240, s: 100, l: 50, a: 1 });
		});

		it('should handle shorthand HEX', () => {
			expect(ColorLogic.toHSLA('#f00')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHSLA('#fff')).toEqual({ h: 0, s: 0, l: 100, a: 1 });
		});

		it('should handle HEX with alpha', () => {
			expect(ColorLogic.toHSLA('#ff000080').a).toBeCloseTo(0.5);
		});
	});

	describe('Adjustments', () => {
		it('adjustBrightness should work correctly', () => {
			const dark = ColorLogic.adjustBrightness('#808080', -0.1); // -10%
			expect(ColorLogic.toHSLA(dark).l).toBe(40);
			const light = ColorLogic.adjustBrightness('#808080', 0.1); // +10%
			expect(ColorLogic.toHSLA(light).l).toBe(60);
		});

		it('adjustSaturation should work correctly', () => {
			const vivid = ColorLogic.adjustSaturation('#804040', 0.2);
			expect(ColorLogic.toHSLA(vivid).s).toBe(53); // Original is 33.3...%
		});

		it('adjustOpacity should work correctly', () => {
			expect(ColorLogic.adjustOpacity('#ff0000', 0.5)).toBe('#ff000080');
		});
	});

	describe('Mixing', () => {
		it('should mix two colors with specified ratio', () => {
			expect(ColorLogic.mix('#ff0000', '#0000ff', 0.5)).toBe('#800080');
			expect(ColorLogic.mix('#ffffff', '#000000', 0)).toBe('#ffffff');
			expect(ColorLogic.mix('#ffffff', '#000000', 1)).toBe('#000000');
		});
	});

	describe('Fast Conversions & Caching', () => {
		it('toRGBA should return ClampedArray and use cache', () => {
			const rgba1 = ColorLogic.toRGBA('#ff0000');
			expect(rgba1).toEqual(new Uint8ClampedArray([255, 0, 0, 255]));

			const rgba2 = ColorLogic.toRGBA('#ff0000');
			expect(rgba1).toBe(rgba2); // Same reference implies cache hit
		});

		it('hexToUint32 should convert to ABGR correctly', () => {
			// #ff8800 -> R=ff, G=88, B=00, A=ff
			// ABGR: 0xff0088ff
			expect(ColorLogic.hexToUint32('#ff8800')).toBe(0xff0088ff);
			expect(ColorLogic.hexToUint32(null)).toBe(0);
		});

		it('uint32ToHex should convert from ABGR correctly', () => {
			expect(ColorLogic.uint32ToHex(0xff0088ff)).toBe('#ff8800');
			expect(ColorLogic.uint32ToHex(0)).toBeNull();
		});
	});

	describe('GPL & Palette Parsing', () => {
		it('toGPL should generate valid format', () => {
			const gpl = ColorLogic.toGPL('Test', ['#ff0000']);
			expect(gpl).toContain('GIMP Palette');
			expect(gpl).toContain('Name: Test');
			expect(gpl).toContain('255   0   0 Untitled');
		});

		it('parsePaletteText should extract from various formats', () => {
			const content = 'Some text #ff0000 and #00ff00ff more';
			expect(ColorLogic.parsePaletteText(content)).toEqual(['#ff0000', '#00ff00ff']);

			const gplContent = `GIMP Palette
Name: MyPalette
255 128 64
0 0 0`;
			expect(ColorLogic.parsePaletteText(gplContent)).toEqual(['#ff8040', '#000000']);
		});

		it('parsePaletteText should return empty array for invalid input', () => {
			expect(ColorLogic.parsePaletteText('no colors here')).toEqual([]);
		});
	});
});
