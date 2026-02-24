import { describe, it, expect } from 'vitest';
import { Path } from '../../lib/logic/path.js';

describe('Path', () => {
	describe('simplify (RDP)', () => {
		it('should simplify a collinear line', () => {
			const points = [
				{ x: 0, y: 0 },
				{ x: 5, y: 0 },
				{ x: 10, y: 0 }
			];
			expect(Path.simplify(points, 1)).toEqual([
				{ x: 0, y: 0 },
				{ x: 10, y: 0 }
			]);
		});

		it('should preserve points outside epsilon', () => {
			const points = [
				{ x: 0, y: 0 },
				{ x: 5, y: 10 },
				{ x: 10, y: 0 }
			];
			// Epsilon 1 < 10, so peak should be preserved
			expect(Path.simplify(points, 1).length).toBe(3);
		});
	});

	describe('smooth (Moving Average)', () => {
		it('should smooth jagged paths', () => {
			const points = [
				{ x: 0, y: 0 },
				{ x: 10, y: 10 },
				{ x: 20, y: 0 }
			];
			const smoothed = Path.smooth(points, 10);
			expect(smoothed[1].y).toBeLessThan(10);
			expect(smoothed[0]).toEqual(points[0]);
			expect(smoothed[2]).toEqual(points[2]);
		});

		it('should handle small paths', () => {
			const points = [
				{ x: 0, y: 0 },
				{ x: 1, y: 1 }
			];
			expect(Path.smooth(points, 10)).toEqual(points);
		});
	});

	describe('traceCluster (SVG)', () => {
		it('should generate a simple square path for a 1x1 cluster', () => {
			const indices = new Set([0]); // Top-left pixel
			const path = Path.traceCluster(indices, 10);
			expect(path).toContain('M 0 0');
			expect(path).toContain('L 1 0');
			expect(path).toContain('L 1 1');
			expect(path).toContain('L 0 1');
			expect(path).toContain('Z');
		});

		it('should handle L-shaped clusters', () => {
			// (0,0), (1,0), (0,1)
			const indices = new Set([0, 1, 10]);
			const path = Path.traceCluster(indices, 10);
			expect(path).toContain('Z');
			// The algorithm might produce redundant colinear vertices depending on chaining
			expect(path.split(' ').length).toBeGreaterThan(6);
		});

		it('should handle holes in clusters', () => {
			// 3x3 square with middle missing
			// 0 1 2
			// 10 _ 12
			// 20 21 22
			const indices = new Set([0, 1, 2, 10, 12, 20, 21, 22]);
			const path = Path.traceCluster(indices, 10);
			// Should contain two closed loops (outer and inner)
			expect(path.match(/Z/g)?.length).toBe(2);
		});
	});
});
