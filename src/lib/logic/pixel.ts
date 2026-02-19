import { type ColorHex, type Point } from '../types/index.js';

/**
 * Pixel Logic: Pure data transformations for pixel grids.
 * Part of the stateless Logic Layer.
 */
export class PixelLogic {
	/**
	 * Returns mirrored coordinates based on the active symmetry mode.
	 */
	static getSymmetryPoints(
		x: number,
		y: number,
		width: number,
		height: number,
		mode: 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'
	): Point[] {
		const points: Point[] = [];
		const mx = width - 1 - x;
		const my = height - 1 - y;

		if (mode === 'HORIZONTAL') {
			points.push({ x: mx, y });
		} else if (mode === 'VERTICAL') {
			points.push({ x, y: my });
		} else if (mode === 'QUADRANT') {
			points.push({ x: mx, y });
			points.push({ x, y: my });
			points.push({ x: mx, y: my });
		}

		return points;
	}

	/**
	 * Wraps a point to the canvas boundaries for seamless tiling.
	 */
	static wrap(x: number, y: number, width: number, height: number): Point {
		return {
			x: ((x % width) + width) % width,
			y: ((y % height) + height) % height
		};
	}

	/**
	 * Flood Fill: Returns a new array with the connected area filled.
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
		if (targetColor === fillColor) return data;

		const newData = [...data];
		const queue: [number, number][] = [[startX, startY]];
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
						if (newData[ny * width + nx] === targetColor) {
							queue.push([nx, ny]);
						}
					}
				}
			}
		}
		return newData;
	}

	/**
	 * Global color replacement.
	 */
	static recolor(
		data: (ColorHex | null)[],
		oldColor: ColorHex | null,
		newColor: ColorHex
	): (ColorHex | null)[] {
		return data.map((c) => (c === oldColor ? newColor : c));
	}

	/**
	 * Analyzes unique color usage in a pixel array.
	 */
	static getPaletteUsage(data: (ColorHex | null)[]): Set<ColorHex> {
		const usage = new Set<ColorHex>();
		data.forEach((c) => {
			if (c) usage.add(c);
		});
		return usage;
	}
}
