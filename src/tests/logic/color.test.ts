import { describe, it, expect } from 'vitest';
import { ColorLogic } from '../../lib/logic/color.js';

describe('ColorLogic', () => {
	describe('toHex & toHSLA', () => {
		it('should convert HSLA to HEX (white)', () => {
			const hsla = { h: 0, s: 0, l: 100, a: 1 };
			expect(ColorLogic.toHex(hsla)).toBe('#ffffff');
		});

		it('should convert HSLA to HEX (black)', () => {
			const hsla = { h: 0, s: 0, l: 0, a: 1 };
			expect(ColorLogic.toHex(hsla)).toBe('#000000');
		});

		it('should convert HSLA to HEX (red)', () => {
			const hsla = { h: 0, s: 100, l: 50, a: 1 };
			expect(ColorLogic.toHex(hsla)).toBe('#ff0000');
		});

		it('should convert HSLA to HEX with alpha', () => {
			const hsla = { h: 0, s: 100, l: 50, a: 0.5 };
			expect(ColorLogic.toHex(hsla)).toBe('#ff000080');
		});

		it('should perform a correct round-trip for basic colors', () => {
			const hex = '#ff0000';
			const hsla = ColorLogic.toHSLA(hex);
			expect(hsla).toEqual({ h: 0, s: 100, l: 50, a: 1 });
			expect(ColorLogic.toHex(hsla)).toBe(hex);
		});

		it('should handle shorthand hex #f00', () => {
			const hsla = ColorLogic.toHSLA('#f00');
			expect(hsla).toEqual({ h: 0, s: 100, l: 50, a: 1 });
		});
	});

	describe('Adjustments', () => {
		it('adjustBrightness should make color lighter', () => {
			const hex = '#808080'; // 50% gray
			const lighter = ColorLogic.adjustBrightness(hex, 0.1); // +10%
			const hsla = ColorLogic.toHSLA(lighter);
			expect(hsla.l).toBe(60);
		});

		it('adjustSaturation should make color more vivid', () => {
			const hex = '#804040';
			const vivid = ColorLogic.adjustSaturation(hex, 0.2);
			const hsla = ColorLogic.toHSLA(vivid);
			expect(hsla.s).toBeGreaterThan(ColorLogic.toHSLA(hex).s);
		});

		it('adjustOpacity should change alpha channel', () => {
			const hex = '#ff0000';
			const transparent = ColorLogic.adjustOpacity(hex, 0.5);
			expect(transparent).toBe('#ff000080');
		});
	});

	describe('Mixing', () => {
		it('mix should interpolate between two colors', () => {
			const colorA = '#ff0000'; // Red
			const colorB = '#0000ff'; // Blue
			const mixed = ColorLogic.mix(colorA, colorB, 0.5);
			// 50/50 mix should be purple #800080
			expect(mixed).toBe('#800080');
		});
	});

	describe('Binary Conversions (Uint32 ABGR)', () => {
		it('hexToUint32 should convert to ABGR format', () => {
			const hex = '#ff8800'; // R=ff, G=88, B=00, A=ff
			const uint = ColorLogic.hexToUint32(hex);
			// ABGR (Little Endian): alpha << 24 | blue << 16 | green << 8 | red
			// 0xff | 0x00 | 0x88 | 0xff -> 0xff0088ff
			expect(uint).toBe(0xff0088ff);
		});

		it('uint32ToHex should convert back from ABGR', () => {
			const uint = 0xff0088ff;
			expect(ColorLogic.uint32ToHex(uint)).toBe('#ff8800');
		});

		it('uint32ToHex should return null for 0', () => {
			expect(ColorLogic.uint32ToHex(0)).toBeNull();
		});
	});

	describe('Palette Parsing', () => {
		it('parsePaletteText should extract HEX codes', () => {
			const content = 'My Colors: #ff0000, #00ff00, #0000ff';
			const colors = ColorLogic.parsePaletteText(content);
			expect(colors).toEqual(['#ff0000', '#00ff00', '#0000ff']);
		});

		it('parsePaletteText should extract colors from GPL format', () => {
			const gpl = `GIMP Palette
Name: Test
#
255   0   0 Red
  0 255   0 Green
  0   0 255 Blue`;
			const colors = ColorLogic.parsePaletteText(gpl);
			expect(colors).toEqual(['#ff0000', '#00ff00', '#0000ff']);
		});

		it('toGPL should generate a valid GPL string', () => {
			const colors = ['#ff0000', '#00ff00'];
			const gpl = ColorLogic.toGPL('MyPalette', colors);
			expect(gpl).toContain('GIMP Palette');
			expect(gpl).toContain('Name: MyPalette');
			expect(gpl).toContain('255   0   0 Untitled');
			expect(gpl).toContain('  0 255   0 Untitled');
		});
	});
});
