import { describe, it, expect } from 'vitest';
import { ColorLogic } from '../../lib/logic/color.js';

describe('ColorLogic', () => {
	describe('HEX & HSLA Conversions', () => {
		it('should convert HSLA to HEX correctly', () => {
			expect(ColorLogic.toHex({ h: 0, s: 0, l: 100, a: 1 })).toBe('#FFFFFFFF');
			expect(ColorLogic.toHex({ h: 0, s: 0, l: 0, a: 1 })).toBe('#000000FF');
			expect(ColorLogic.toHex({ h: 0, s: 100, l: 50, a: 1 })).toBe('#FF0000FF');
			expect(ColorLogic.toHex({ h: 120, s: 100, l: 50, a: 1 })).toBe('#00FF00FF');
			expect(ColorLogic.toHex({ h: 240, s: 100, l: 50, a: 1 })).toBe('#0000FFFF');
		});

		it('should handle alpha channel in HEX', () => {
			expect(ColorLogic.toHex({ h: 0, s: 100, l: 50, a: 0.5 })).toBe('#FF000080');
			expect(ColorLogic.toHex({ h: 0, s: 100, l: 50, a: 0 })).toBe('#FF000000');
		});

		it('should convert HEX to HSLA correctly', () => {
			expect(ColorLogic.toHSLA('#FF0000')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHSLA('#00FF00')).toEqual({ h: 120, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHSLA('#0000FF')).toEqual({ h: 240, s: 100, l: 50, a: 1 });
		});

		it('should handle shorthand HEX', () => {
			expect(ColorLogic.toHSLA('#F00')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHSLA('#FFF')).toEqual({ h: 0, s: 0, l: 100, a: 1 });
		});

		it('should handle HEX with alpha', () => {
			expect(ColorLogic.toHSLA('#FF000080').a).toBeCloseTo(0.5);
		});
	});

	describe('Adjustments', () => {
		it('adjustBrightness should work correctly', () => {
			const dark = ColorLogic.adjustBrightness('#808080FF', -0.1); // -10%
			expect(ColorLogic.toHSLA(dark).l).toBeCloseTo(40, 0);
			const light = ColorLogic.adjustBrightness('#808080FF', 0.1); // +10%
			expect(ColorLogic.toHSLA(light).l).toBeCloseTo(60, 0);
		});

		it('adjustSaturation should work correctly', () => {
			const vivid = ColorLogic.adjustSaturation('#804040FF', 0.2);
			expect(ColorLogic.toHSLA(vivid).s).toBeCloseTo(53, 0);
		});

		it('adjustOpacity should work correctly', () => {
			expect(ColorLogic.adjustOpacity('#FF0000FF', 0.5)).toBe('#FF000080');
		});

		it('applyTemperature should shift color correctly', () => {
			const neutral = '#808080FF';
			const warm = ColorLogic.applyTemperature(neutral, 0.5); // More Red/Green, Less Blue
			const cool = ColorLogic.applyTemperature(neutral, -0.5); // Less Red/Green, More Blue

			const hslaWarm = ColorLogic.toHSLA(warm);
			const hslaCool = ColorLogic.toHSLA(cool);

			// Warm should shift towards yellow/red (Hue ~30-60)
			// Cool should shift towards blue (Hue ~200-240)
			expect(hslaWarm.h).toBeGreaterThan(0);
			expect(hslaCool.h).toBeGreaterThan(hslaWarm.h);
		});
	});

	describe('Mixing', () => {
		it('should mix two colors with specified ratio', () => {
			expect(ColorLogic.mix('#FF0000', '#0000FF', 0.5)).toBe('#800080FF');
			expect(ColorLogic.mix('#FFFFFF', '#000000', 0)).toBe('#FFFFFFFF');
			expect(ColorLogic.mix('#FFFFFF', '#000000', 1)).toBe('#000000FF');
		});
	});

	describe('Fast Conversions & Caching', () => {
		it('toRGBA should return ClampedArray and use cache', () => {
			const rgba1 = ColorLogic.toRGBA('#FF0000');
			expect(rgba1).toEqual(new Uint8ClampedArray([255, 0, 0, 255]));

			const rgba2 = ColorLogic.toRGBA('#FF0000');
			expect(rgba1).toBe(rgba2); // Same reference implies cache hit
		});

		it('hexToUint32 should convert to ABGR correctly', () => {
			// #FF8800 -> R=FF, G=88, B=00, A=FF
			// ABGR: 0xFF0088FF
			expect(ColorLogic.hexToUint32('#FF8800')).toBe(0xff0088ff);
			expect(ColorLogic.hexToUint32(null)).toBe(0);
		});

		it('uint32ToHex should convert from ABGR correctly', () => {
			expect(ColorLogic.uint32ToHex(0xff0088ff)).toBe('#FF8800FF');
			expect(ColorLogic.uint32ToHex(0)).toBeNull();
		});
	});

	describe('GPL & Palette Parsing', () => {
		it('toGPL should generate valid format', () => {
			const gpl = ColorLogic.toGPL('Test', ['#FF0000FF']);
			expect(gpl).toContain('GIMP Palette');
			expect(gpl).toContain('Name: Test');
			expect(gpl).toContain('255   0   0 Untitled');
		});

		it('parsePaletteText should extract from various formats', () => {
			const content = 'Some text #FF0000FF and #00FF00FF more';
			expect(ColorLogic.parsePaletteText(content)).toEqual(['#FF0000FF', '#00FF00FF']);

			const gplContent = `GIMP Palette
Name: MyPalette
255 128 64
0 0 0`;
			expect(ColorLogic.parsePaletteText(gplContent)).toEqual(['#FF8040FF', '#000000FF']);
		});

		it('parsePaletteText should return empty array for invalid input', () => {
			expect(ColorLogic.parsePaletteText('no colors here')).toEqual([]);
		});
	});
});
