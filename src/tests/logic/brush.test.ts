import { describe, it, expect } from 'vitest';
import { BrushLogic } from '../../lib/logic/brush.js';

describe('BrushLogic', () => {
	describe('getKernel', () => {
		it('should return a single point for size 1', () => {
			const kernel = BrushLogic.getKernel(1, 'SQUARE');
			expect(kernel).toEqual([{ x: 0, y: 0, weight: 1.0 }]);
		});

		it('should return 9 points for a 3x3 square brush', () => {
			const kernel = BrushLogic.getKernel(3, 'SQUARE');
			expect(kernel.length).toBe(9);
			// Center weight should be 1.0
			const center = kernel.find((p) => p.x === 0 && p.y === 0);
			expect(center?.weight).toBe(1.0);
		});

		it('should return correct points for a small circle brush', () => {
			// Size 3 Circle should have points at (0,0), (1,0), (-1,0), (0,1), (0,-1)
			// Corners (1,1) would be dist sqrt(2) = 1.41. Radius is 1.0. 1.41 > 1.1 -> filtered.
			const kernel = BrushLogic.getKernel(3, 'CIRCLE');
			expect(kernel.length).toBe(5);
			expect(kernel).toContainEqual(expect.objectContaining({ x: 0, y: 0 }));
			expect(kernel).not.toContainEqual(expect.objectContaining({ x: 1, y: 1 }));
		});
	});

	describe('getSpans', () => {
		it('should return correct spans for a 3x3 square', () => {
			const spans = BrushLogic.getSpans(3, 'SQUARE');
			expect(spans).toEqual([
				{ y: -1, x1: -1, x2: 1 },
				{ y: 0, x1: -1, x2: 1 },
				{ y: 1, x1: -1, x2: 1 }
			]);
		});

		it('should return correct spans for a circle', () => {
			const spans = BrushLogic.getSpans(3, 'CIRCLE');
			// At radius 1: y=0 -> x is sqrt(1-0)=1 -> spans [-1, 1]
			// y=1 -> x is sqrt(1-1)=0 -> spans [0, 0]
			const spanY0 = spans.find((s) => s.y === 0);
			const spanY1 = spans.find((s) => s.y === 1);

			expect(spanY0?.x1).toBe(-1);
			expect(spanY0?.x2).toBe(1);
			expect(Math.abs(spanY1?.x1 || 0)).toBe(0);
			expect(Math.abs(spanY1?.x2 || 0)).toBe(0);
		});
	});
});
