import { type ColorHex } from '../types/index.js';
import { Geometry } from '../logic/geometry.js';
import { Path } from '../logic/path.js';

/**
 * PixelEngine: Orchestrator for computationally expensive pixel operations.
 * It delegates mathematical logic to the Logic Layer.
 */
export class PixelEngine {
	// --- Delegation to Logic Layer ---

	static getLinePoints(x0: number, y0: number, x1: number, y1: number, broadness = 0) {
		return Geometry.getLinePoints(x0, y0, x1, y1, broadness);
	}

	static simplifyPath(points: Array<{ x: number; y: number }>, epsilon: number) {
		return Path.simplify(points, epsilon);
	}

	static smoothPath(points: Array<{ x: number; y: number }>, strength: number) {
		return Path.smooth(points, strength);
	}

	static fitArc(points: Array<{ x: number; y: number }>, stabilization: number) {
		if (stabilization < 10) return null;
		const circularityLimit = 0.05 + (stabilization / 100) * 0.35;
		return Geometry.fitArc(points, circularityLimit);
	}

	static getCirclePoints(cx: number, cy: number, r: number) {
		return Geometry.getCirclePoints(cx, cy, r);
	}

	// --- Pixel Manipulation Logic ---

	/**
	 * Flood Fill: Fills a connected area of the same color.
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
						if (newData[ny * width + nx] === targetColor) {
							queue.push([nx, ny]);
						}
					}
				}
			}
		}
		return newData;
	}

	static recolor(data: (ColorHex | null)[], oldColor: ColorHex | null, newColor: ColorHex) {
		return data.map((c) => (c === oldColor ? newColor : c));
	}

	static getPaletteUsage(data: (ColorHex | null)[]) {
		const usage = new Set<ColorHex>();
		data.forEach((c) => {
			if (c) usage.add(c);
		});
		return usage;
	}
}
