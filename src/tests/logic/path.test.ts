import { describe, it, expect } from 'vitest';
import { Path } from '../../lib/logic/path.js';

describe('Path', () => {
	it('simplify should reduce number of points', () => {
		const points = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0.1 },
			{ x: 2, y: 0 }
		];
		// Epsilon 0.2 should remove the middle point
		const simplified = Path.simplify(points, 0.2);
		expect(simplified).toEqual([
			{ x: 0, y: 0 },
			{ x: 2, y: 0 }
		]);
	});

	it('smooth should average points', () => {
		const points = [
			{ x: 0, y: 0 },
			{ x: 10, y: 10 },
			{ x: 20, y: 0 }
		];
		const smoothed = Path.smooth(points, 10);
		expect(smoothed[0]).toEqual(points[0]);
		expect(smoothed[2]).toEqual(points[2]);
		expect(smoothed[1].x).toBeCloseTo(10);
		expect(smoothed[1].y).toBeLessThan(10); // Smoothed y should be lower than 10
	});

	it('traceCluster should generate SVG path for a 1x1 pixel', () => {
		const indices = new Set([0]);
		const width = 10;
		const path = Path.traceCluster(indices, width);
		// A 1x1 pixel at (0,0) should be a square from (0,0) to (1,1)
		expect(path).toContain('M 0 0');
		expect(path).toContain('L 1 0');
		expect(path).toContain('L 1 1');
		expect(path).toContain('L 0 1');
		expect(path).toContain('Z');
	});

	it('traceCluster should generate SVG path for a 2x1 rectangle', () => {
		const indices = new Set([0, 1]);
		const width = 10;
		const path = Path.traceCluster(indices, width);
		expect(path).toContain('M 0 0');
		expect(path).toContain('L 1 0');
		expect(path).toContain('L 2 0');
		expect(path).toContain('L 2 1');
		expect(path).toContain('L 1 1');
		expect(path).toContain('L 0 1');
		expect(path).toContain('Z');
	});
});
