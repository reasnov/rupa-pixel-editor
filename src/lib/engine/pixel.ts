import { type ColorHex } from '../types/index.js';
import { Geometry } from '../logic/geometry.js';
import { Path } from '../logic/path.js';
import { PixelLogic } from '../logic/pixel.js';

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

	// --- Pixel Manipulation Delegation ---

	static floodFill(
		data: (ColorHex | null)[],
		width: number,
		height: number,
		startX: number,
		startY: number,
		fillColor: ColorHex
	): (ColorHex | null)[] {
		return PixelLogic.floodFill(data, width, height, startX, startY, fillColor);
	}

	static recolor(data: (ColorHex | null)[], oldColor: ColorHex | null, newColor: ColorHex) {
		return PixelLogic.recolor(data, oldColor, newColor);
	}

	static getPaletteUsage(data: (ColorHex | null)[]) {
		return PixelLogic.getPaletteUsage(data);
	}
}
