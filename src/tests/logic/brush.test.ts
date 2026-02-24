import { describe, it, expect } from 'vitest';
import { BrushLogic } from '../../lib/logic/brush.js';

describe('BrushLogic', () => {
	describe('getKernel', () => {
		it('should return a single point for size 1', () => {
			const kernel = BrushLogic.getKernel(1, 'SQUARE');
			expect(kernel).toEqual([{ x: 0, y: 0, weight: 1.0 }]);
		});

		it('should return correct points for a 3x3 square brush', () => {
			const kernel = BrushLogic.getKernel(3, 'SQUARE');
			expect(kernel.length).toBe(9);
			// Center weight should be 1.0
			const center = kernel.find((p) => p.x === 0 && p.y === 0);
			expect(center?.weight).toBe(1.0);
			// Corners should have lower weight but still be present
			const corner = kernel.find((p) => p.x === 1 && p.y === 1);
			expect(corner).toBeDefined();
			expect(corner!.weight).toBeLessThan(1.0);
		});

		it('should return correct points for a 3x3 circle brush', () => {
			// Size 3 Circle radius is 1.0. Corners (1,1) dist is 1.41 > 1.1 => excluded.
			const kernel = BrushLogic.getKernel(3, 'CIRCLE');
			expect(kernel.length).toBe(5); // (0,0), (1,0), (-1,0), (0,1), (0,-1)
			expect(kernel).toContainEqual(expect.objectContaining({ x: 0, y: 0 }));
			expect(kernel).not.toContainEqual(expect.objectContaining({ x: 1, y: 1 }));
		});

		it('should handle large sizes (industrial scale)', () => {
			const kernel = BrushLogic.getKernel(100, 'SQUARE');
			// Size 100 is treated as 99 to maintain center symmetry
			expect(kernel.length).toBe(99 * 99);
		});
	});

	describe('getSpans', () => {
		it('should return a single span for size 1', () => {
			const spans = BrushLogic.getSpans(1, 'SQUARE');
			expect(spans).toEqual([{ y: 0, x1: 0, x2: 0 }]);
		});

		it('should return correct spans for a 3x3 square', () => {
			const spans = BrushLogic.getSpans(3, 'SQUARE');
			expect(spans).toEqual([
				{ y: -1, x1: -1, x2: 1 },
				{ y: 0, x1: -1, x2: 1 },
				{ y: 1, x1: -1, x2: 1 }
			]);
		});

		it('should return correct spans for a 3x3 circle', () => {
			const spans = BrushLogic.getSpans(3, 'CIRCLE');
			// radius 1.0
			// y = -1: sqrt(1 - 1) = 0 -> [-0, 0]
			// y = 0: sqrt(1 - 0) = 1 -> [-1, 1]
			// y = 1: sqrt(1 - 1) = 0 -> [-0, 0]
			// Note: using closeTo or manual check because of -0 vs 0
			const sYneg1 = spans.find((s) => s.y === -1);
			expect(Math.abs(sYneg1!.x1)).toBe(0);
			expect(Math.abs(sYneg1!.x2)).toBe(0);
			expect(spans).toContainEqual({ y: 0, x1: -1, x2: 1 });
		});

		it('should handle large sizes for spans', () => {
			const spans = BrushLogic.getSpans(100, 'CIRCLE');
			// Size 100 rounds to 99
			expect(spans.length).toBe(99);
		});
	});
});
