import { type ColorHex } from '../types/index.js';

export interface ColorHSLA {
	h: number; // 0-360
	s: number; // 0-100
	l: number; // 0-100
	a: number; // 0-1
}

/**
 * ColorEngine: The specialized engine for processing colors.
 */
export class ColorEngine {
	/**
	 * Converts HSLA color to a HEX string.
	 */
	static toHex(hsla: ColorHSLA): ColorHex {
		const { h, s, l, a } = hsla;
		const h_norm = h / 360;
		const s_norm = s / 100;
		const l_norm = l / 100;

		let r, g, b;

		if (s_norm === 0) {
			r = g = b = l_norm;
		} else {
			const q = l_norm < 0.5 ? l_norm * (1 + s_norm) : l_norm + s_norm - l_norm * s_norm;
			const p = 2 * l_norm - q;
			const hue2rgb = (t: number) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};
			r = hue2rgb(h_norm + 1 / 3);
			g = hue2rgb(h_norm);
			b = hue2rgb(h_norm - 1 / 3);
		}

		const hexComponent = (x: number) =>
			Math.round(x * 255)
				.toString(16)
				.padStart(2, '0');

		const alphaHex = Math.round(a * 255)
			.toString(16)
			.padStart(2, '0');

		const hex = `#${hexComponent(r)}${hexComponent(g)}${hexComponent(b)}`;
		return alphaHex === 'ff' ? hex : hex + alphaHex;
	}

	/**
	 * Converts a HEX string back to HSLA.
	 */
	static toHSLA(hexStr: ColorHex): ColorHSLA {
		let r = 0,
			g = 0,
			b = 0,
			a = 1;

		const hex = hexStr.replace('#', '');

		if (hex.length === 3 || hex.length === 4) {
			r = parseInt(hex[0] + hex[0], 16);
			g = parseInt(hex[1] + hex[1], 16);
			b = parseInt(hex[2] + hex[2], 16);
			if (hex.length === 4) a = parseInt(hex[3] + hex[3], 16) / 255;
		} else if (hex.length === 6 || hex.length === 8) {
			r = parseInt(hex.substring(0, 2), 16);
			g = parseInt(hex.substring(2, 4), 16);
			b = parseInt(hex.substring(4, 6), 16);
			if (hex.length === 8) a = parseInt(hex.substring(6, 8), 16) / 255;
		}

		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0,
			l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			l: Math.round(l * 100),
			a: parseFloat(a.toFixed(2))
		};
	}

	/**
	 * Adjust brightness.
	 * @param hex HEX color string.
	 * @param amount -1.0 to 1.0 (negative for darker, positive for lighter)
	 */
	static adjustBrightness(hex: ColorHex, amount: number): ColorHex {
		const hsla = this.toHSLA(hex);
		hsla.l = Math.max(0, Math.min(100, hsla.l + amount * 100));
		return this.toHex(hsla);
	}

	/**
	 * Adjust saturation.
	 * @param hex HEX color string.
	 * @param amount -1.0 to 1.0
	 */
	static adjustSaturation(hex: ColorHex, amount: number): ColorHex {
		const hsla = this.toHSLA(hex);
		hsla.s = Math.max(0, Math.min(100, hsla.s + amount * 100));
		return this.toHex(hsla);
	}

	/**
	 * Adjust opacity.
	 * @param hex HEX color string.
	 * @param a 0.0 to 1.0
	 */
	static adjustOpacity(hex: ColorHex, a: number): ColorHex {
		const hsla = this.toHSLA(hex);
		hsla.a = Math.max(0, Math.min(1, a));
		return this.toHex(hsla);
	}

	/**
	 * Mix two colors together.
	 */
	static mix(colorA: ColorHex, colorB: ColorHex, ratio = 0.5): ColorHex {
		const rA = this.hexToRgb(colorA);
		const rB = this.hexToRgb(colorB);

		const mixed = {
			r: Math.round(rA.r * (1 - ratio) + rB.r * ratio),
			g: Math.round(rA.g * (1 - ratio) + rB.g * ratio),
			b: Math.round(rA.b * (1 - ratio) + rB.b * ratio),
			a: rA.a * (1 - ratio) + rB.a * ratio
		};

		return this.rgbToHex(mixed.r, mixed.g, mixed.b, mixed.a);
	}

	/**
	 * Fast conversion from HEX to RGBA array [r, g, b, a] (0-255).
	 * Uses a micro-cache to prevent redundant parsing during render loops.
	 */
	private static rgbaCache = new Map<string, Uint8ClampedArray>();

	static toRGBA(hexStr: ColorHex): Uint8ClampedArray {
		if (this.rgbaCache.has(hexStr)) return this.rgbaCache.get(hexStr)!;

		const { r, g, b, a } = this.hexToRgb(hexStr);
		const rgba = new Uint8ClampedArray([r, g, b, Math.round(a * 255)]);
		this.rgbaCache.set(hexStr, rgba);
		return rgba;
	}

	private static hexToRgb(hexStr: string) {
		const hex = hexStr.replace('#', '');
		let r = 0,
			g = 0,
			b = 0,
			a = 1;
		if (hex.length === 6 || hex.length === 8) {
			r = parseInt(hex.substring(0, 2), 16);
			g = parseInt(hex.substring(2, 4), 16);
			b = parseInt(hex.substring(4, 6), 16);
			if (hex.length === 8) a = parseInt(hex.substring(6, 8), 16) / 255;
		}
		return { r, g, b, a };
	}

	private static rgbToHex(r: number, g: number, b: number, a: number) {
		const toHex = (x: number) => Math.round(x).toString(16).padStart(2, '0');
		const alphaHex = Math.round(a * 255)
			.toString(16)
			.padStart(2, '0');
		const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
		return alphaHex === 'ff' ? hex : hex + alphaHex;
	}
}
