import { type Point } from '../types/index.js';

/**
 * BrushLogic: Pure mathematical calculations for multi-pixel kernels.
 * Part of the stateless Logic Layer.
 */
export class BrushLogic {
	/**
	 * Returns a list of relative offsets for a given brush size and shape.
	 * Weight is 1.0 at the center and falls off to 0.0 at the edges.
	 */
	static getKernel(
		size: number,
		shape: 'SQUARE' | 'CIRCLE'
	): Array<{ x: number; y: number; weight: number }> {
		if (size <= 1) return [{ x: 0, y: 0, weight: 1.0 }];

		const points: Array<{ x: number; y: number; weight: number }> = [];
		const radius = (size - 1) / 2;

		const start = -Math.floor(radius);
		const end = Math.ceil(radius);

		for (let dy = start; dy <= end; dy++) {
			for (let dx = start; dx <= end; dx++) {
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (shape === 'CIRCLE' && dist > radius + 0.1) continue;
				if (shape === 'SQUARE' && (Math.abs(dx) > radius || Math.abs(dy) > radius)) continue;

				// Linear falloff: weight is 1.0 at center, 0.0 at edge
				// For square, we use Chebyshev distance for consistent falloff
				const maxDist = shape === 'CIRCLE' ? radius : Math.max(Math.abs(dx), Math.abs(dy));
				const weight = maxDist === 0 ? 1.0 : Math.max(0, 1 - dist / (radius + 0.5));

				points.push({ x: dx, y: dy, weight });
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
