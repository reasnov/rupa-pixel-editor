import { describe, it, expect } from 'vitest';
import { Geometry } from '../../lib/logic/geometry.js';

describe('Geometry', () => {
	describe('getLinePoints (Bresenham)', () => {
		it('should return points for a horizontal line', () => {
			expect(Geometry.getLinePoints(0, 0, 2, 0)).toEqual([
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 }
			]);
		});

		it('should return points for a vertical line', () => {
			expect(Geometry.getLinePoints(0, 0, 0, 2)).toEqual([
				{ x: 0, y: 0 },
				{ x: 0, y: 1 },
				{ x: 0, y: 2 }
			]);
		});

		it('should return points for a diagonal line', () => {
			expect(Geometry.getLinePoints(0, 0, 2, 2)).toEqual([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 },
				{ x: 2, y: 2 }
			]);
		});

		it('should handle broadness for non-perfect lines', () => {
			// A line that is not perfect diagonal or axis-aligned
			const points = Geometry.getLinePoints(0, 0, 5, 2, 1.0); // broadness > 0.9
			// Regular Bresenham for (0,0)->(5,2) usually has 6 points.
			// With broadness, it should have more.
			expect(points.length).toBeGreaterThan(6);
		});
	});

	describe('getCirclePoints', () => {
		it('should return symmetric points for a circle', () => {
			const points = Geometry.getCirclePoints(0, 0, 2);
			expect(points).toContainEqual({ x: 2, y: 0 });
			expect(points).toContainEqual({ x: 0, y: 2 });
			expect(points).toContainEqual({ x: -2, y: 0 });
			expect(points).toContainEqual({ x: 0, y: -2 });
		});
	});

	describe('fitArc', () => {
		it('should detect a full circle from noisy points', () => {
			const points = [];
			for (let a = 0; a < Math.PI * 2; a += 0.1) {
				points.push({
					x: 10 + Math.cos(a) * 5 + (Math.random() - 0.5) * 0.1,
					y: 10 + Math.sin(a) * 5 + (Math.random() - 0.5) * 0.1
				});
			}
			const result = Geometry.fitArc(points, 0.1);
			expect(result).not.toBeNull();
			expect(result?.isFull).toBe(true);
			expect(result?.r).toBeCloseTo(5, 0);
		});

		it('should return null for non-circular points', () => {
			const squarePoints = [
				{ x: 0, y: 0 },
				{ x: 10, y: 0 },
				{ x: 10, y: 10 },
				{ x: 0, y: 10 }
			];
			expect(Geometry.fitArc(squarePoints, 0.1)).toBeNull();
		});
	});

	describe('Coordinate Label Conversions', () => {
		it('toCartesianLabel should work for odd and even sizes', () => {
			// Odd: 0 1 2 3 4 -> -2 -1 0 1 2
			expect(Geometry.toCartesianLabel(2, 5)).toBe(0);
			// Even: 0 1 2 3 -> -2 -1 1 2 (no 0)
			expect(Geometry.toCartesianLabel(1, 4)).toBe(-1);
			expect(Geometry.toCartesianLabel(2, 4)).toBe(1);
		});

		it('round-trip conversion should be consistent', () => {
			const width = 32,
				height = 32;
			const internal = { x: 10, y: 20 };
			const cartesian = Geometry.internalToCartesian(internal.x, internal.y, width, height);
			const back = Geometry.cartesianToInternal(cartesian.x, cartesian.y, width, height);
			expect(back).toEqual(internal);
		});
	});

	describe('UI Helpers', () => {
		it('getGuidePosition should return center-relative percentage', () => {
			expect(Geometry.getGuidePosition(0, 100)).toBe(50);
			expect(Geometry.getGuidePosition(50, 100)).toBe(100);
			expect(Geometry.getGuidePosition(-50, 100)).toBe(0);
		});

		it('calculatePanDelta should return correct difference', () => {
			expect(Geometry.calculatePanDelta(10, 10, 5, 5)).toEqual({ dx: 5, dy: 5 });
		});

		it('calculateCameraTransform should generate valid CSS', () => {
			const transform = Geometry.calculateCameraTransform(
				2.0,
				{ x: 10, y: 10 },
				{ x: 5, y: 5 },
				10,
				10
			);
			expect(transform).toContain('scale(2)');
			expect(transform).toContain('10px');
		});
	});
});
