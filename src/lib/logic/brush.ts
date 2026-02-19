import { type Point } from '../types/index.js';

/**
 * BrushLogic: Pure mathematical calculations for multi-pixel kernels.
 * Part of the stateless Logic Layer.
 */
export class BrushLogic {
	/**
	 * Returns a list of relative offsets for a given brush size and shape.
	 * Size is the diameter (1, 2, 3, 4, 5).
	 */
	static getKernel(size: number, shape: 'SQUARE' | 'CIRCLE'): Point[] {
		if (size <= 1) return [{ x: 0, y: 0 }];

		const points: Point[] = [];
		const radius = (size - 1) / 2;

		// Use a local grid from -radius to +radius
		const start = -Math.floor(radius);
		const end = Math.ceil(radius);

		for (let dy = start; dy <= end; dy++) {
			for (let dx = start; dx <= end; dx++) {
				if (shape === 'SQUARE') {
					points.push({ x: dx, y: dy });
				} else {
					// CIRCLE: Using Euclidean distance
					// For small pixel art brushes, we use a simple radius check
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist <= radius + 0.1) {
						points.push({ x: dx, y: dy });
					}
				}
			}
		}

		return points;
	}

	/**
	 * Returns horizontal spans for high-performance large-scale construction.
	 * Size is the diameter (1 to 100).
	 */
	static getSpans(
		size: number,
		shape: 'SQUARE' | 'CIRCLE'
	): Array<{ y: number; x1: number; x2: number }> {
		if (size <= 1) return [{ y: 0, x1: 0, x2: 0 }];

		const spans: Array<{ y: number; x1: number; x2: number }> = [];
		const radius = (size - 1) / 2;
		const start = -Math.floor(radius);
		const end = Math.ceil(radius);

		for (let dy = start; dy <= end; dy++) {
			if (shape === 'SQUARE') {
				spans.push({ y: dy, x1: start, x2: end });
			} else {
				// Midpoint calculation for circles
				const h = Math.sqrt(radius * radius - dy * dy);
				const halfSpan = Math.floor(h);
				if (!isNaN(halfSpan)) {
					spans.push({ y: dy, x1: -halfSpan, x2: halfSpan });
				}
			}
		}
		return spans;
	}
}
