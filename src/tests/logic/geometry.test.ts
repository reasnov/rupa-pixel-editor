import { describe, it, expect } from 'vitest';
import { Geometry } from '../../lib/logic/geometry.js';

describe('Geometry', () => {
	it('getLinePoints should return correct points for a horizontal line', () => {
		const points = Geometry.getLinePoints(0, 0, 2, 0);
		expect(points).toEqual([
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 }
		]);
	});

	it('getLinePoints should return correct points for a vertical line', () => {
		const points = Geometry.getLinePoints(0, 0, 0, 2);
		expect(points).toEqual([
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: 2 }
		]);
	});

	it('getLinePoints should return correct points for a diagonal line', () => {
		const points = Geometry.getLinePoints(0, 0, 2, 2);
		expect(points).toEqual([
			{ x: 0, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 2 }
		]);
	});

	it('getCirclePoints should return points for a circle', () => {
		const points = Geometry.getCirclePoints(0, 0, 1);
		// Radius 1 should have points at (1,0), (0,1), (-1,0), (0,-1) and diagonals
		expect(points).toContainEqual({ x: 1, y: 0 });
		expect(points).toContainEqual({ x: 0, y: 1 });
		expect(points).toContainEqual({ x: -1, y: 0 });
		expect(points).toContainEqual({ x: 0, y: -1 });
	});

	it('fitArc should detect a full circle', () => {
		// Create points for a perfect circle
		const points = [];
		for (let a = 0; a < Math.PI * 2; a += 0.1) {
			points.push({ x: Math.cos(a) * 10, y: Math.sin(a) * 10 });
		}
		const result = Geometry.fitArc(points, 0.1);
		expect(result).not.toBeNull();
		expect(result?.isFull).toBe(true);
		expect(result?.r).toBeCloseTo(10);
	});

	it('toCartesianLabel should calculate correctly', () => {
		// Odd size (5) -> mid is 2. 0->-2, 1->-1, 2->0, 3->1, 4->2
		expect(Geometry.toCartesianLabel(0, 5)).toBe(-2);
		expect(Geometry.toCartesianLabel(2, 5)).toBe(0);
		expect(Geometry.toCartesianLabel(4, 5)).toBe(2);

		// Even size (4) -> mid is 2. 0->-2, 1->-1, 2->1, 3->2 (no 0)
		expect(Geometry.toCartesianLabel(0, 4)).toBe(-2);
		expect(Geometry.toCartesianLabel(1, 4)).toBe(-1);
		expect(Geometry.toCartesianLabel(2, 4)).toBe(1);
		expect(Geometry.toCartesianLabel(3, 4)).toBe(2);
	});

	it('perpendicularDistance should calculate distance from point to line', () => {
		const p = { x: 0, y: 1 };
		const a = { x: -1, y: 0 };
		const b = { x: 1, y: 0 };
		// Distance from (0,1) to horizontal line y=0 is 1
		expect(Geometry.perpendicularDistance(p, a, b)).toBe(1);
	});
});
