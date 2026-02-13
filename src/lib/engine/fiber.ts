import { type ColorHex } from '../types/index.js';

/**
 * FiberEngine: Heavy Task Processor.
 * Handles computationally expensive pixel operations (Flood Fill, Recolor, Analysis).
 * Designed to potentially run in a Web Worker in the future.
 */
export class FiberEngine {
	/**
	 * Flood Fill (Dye Soak): Fills a connected area of the same color.
	 */
	static floodFill(
		data: (ColorHex | null)[],
		width: number,
		height: number,
		startX: number,
		startY: number,
		fillColor: ColorHex
	): (ColorHex | null)[] {
		const targetColor = data[startY * width + startX];
		if (targetColor === fillColor) return data; // No change needed

		const newData = [...data]; // Copy for immutability
		const queue = [[startX, startY]];
		const visited = new Set<number>();

		while (queue.length > 0) {
			const [x, y] = queue.pop()!;
			const idx = y * width + x;

			if (!visited.has(idx)) {
				visited.add(idx);
				newData[idx] = fillColor;

				const neighbors = [
					[x + 1, y],
					[x - 1, y],
					[x, y + 1],
					[x, y - 1]
				];

				for (const [nx, ny] of neighbors) {
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						const nIdx = ny * width + nx;
						if (newData[nIdx] === targetColor) {
							queue.push([nx, ny]);
						}
					}
				}
			}
		}
		return newData;
	}

	/**
	 * Global Recolor (Fiber Bleach): Replaces all instances of a color.
	 */
	static recolor(
		data: (ColorHex | null)[],
		oldColor: ColorHex | null,
		newColor: ColorHex
	): (ColorHex | null)[] {
		return data.map((c) => (c === oldColor ? newColor : c));
	}

	/**
	 * Analyzes the linen to find all used colors.
	 */
	static getPaletteUsage(data: (ColorHex | null)[]): Set<ColorHex> {
		const usage = new Set<ColorHex>();
		data.forEach((c) => {
			if (c) usage.add(c);
		});
		return usage;
	}
}
