import { describe, it, expect } from 'vitest';
import { PixelLogic } from '../../lib/logic/pixel.js';

describe('PixelLogic', () => {
	describe('Symmetry', () => {
		const width = 10,
			height = 10;
		it('HORIZONTAL', () => {
			expect(PixelLogic.getSymmetryPoints(0, 0, width, height, 'HORIZONTAL')).toEqual([
				{ x: 9, y: 0 }
			]);
		});
		it('VERTICAL', () => {
			expect(PixelLogic.getSymmetryPoints(0, 0, width, height, 'VERTICAL')).toEqual([
				{ x: 0, y: 9 }
			]);
		});
		it('QUADRANT', () => {
			const points = PixelLogic.getSymmetryPoints(0, 0, width, height, 'QUADRANT');
			expect(points).toContainEqual({ x: 9, y: 0 });
			expect(points).toContainEqual({ x: 0, y: 9 });
			expect(points).toContainEqual({ x: 9, y: 9 });
		});
	});

	describe('Tiling & Wrapping', () => {
		it('should wrap coordinates correctly', () => {
			expect(PixelLogic.wrap(12, 5, 10, 10)).toEqual({ x: 2, y: 5 });
			expect(PixelLogic.wrap(-1, -1, 10, 10)).toEqual({ x: 9, y: 9 });
		});
	});

	describe('Flood Fill', () => {
		it('should fill contiguous same-colored area', () => {
			const data = [0, 0, 0, 0, 1, 0, 0, 0, 0]; // 3x3 with 1 at center
			const filled = PixelLogic.floodFill(data, 3, 3, 0, 0, 2);
			expect(filled[4]).toBe(1); // Center preserved
			expect(filled[0]).toBe(2); // Corner filled
		});
	});

	describe('Color Usage & Manipulation', () => {
		it('recolor should replace specific colors', () => {
			const data = ['#ff0000', '#00ff00', '#ff0000'] as any[];
			expect(PixelLogic.recolor(data, '#ff0000', '#0000ff')).toEqual([
				'#0000ff',
				'#00ff00',
				'#0000ff'
			]);
		});

		it('getColorUsage should return set of unique colors', () => {
			const data = ['#ff0000', '#ff0000', '#00ff00', null] as any[];
			const usage = PixelLogic.getColorUsage(data);
			expect(usage.size).toBe(2);
			expect(usage.has('#ff0000')).toBe(true);
		});
	});

	describe('Pixel-Perfect Filter', () => {
		it('should remove L-corners', () => {
			const path = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 }
			];
			expect(PixelLogic.pixelPerfectFilter(path)).toEqual([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 }
			]);
		});
	});

	describe('Geometric Shapes', () => {
		it('getRectanglePoints should return outline', () => {
			const points = PixelLogic.getRectanglePoints(0, 0, 2, 2);
			// (0,0),(1,0),(2,0), (0,2),(1,2),(2,2), (0,1),(2,1) = 8 points
			expect(points.length).toBe(8);
		});

		it('getEllipsePoints should return points', () => {
			const points = PixelLogic.getEllipsePoints(0, 0, 4, 4);
			expect(points.length).toBeGreaterThan(0);
		});

		it('getPolygonPoints should handle regular polygons and stars', () => {
			const poly = PixelLogic.getPolygonPoints(0, 0, 10, 10, 4); // Square
			expect(poly.length).toBeGreaterThan(0);
			const star = PixelLogic.getPolygonPoints(0, 0, 10, 10, 5, 50); // 5-point star
			expect(star.length).toBeGreaterThan(0);
		});
	});

	describe('Grid Merging (Layers & Subgrids)', () => {
		it('extractSubGrid should isolate points', () => {
			const source = new Uint32Array([1, 2, 3, 4]); // 2x2
			const bounds = { x1: 0, y1: 0, width: 2, height: 2 };
			const sub = PixelLogic.extractSubGrid(source, 2, [{ x: 0, y: 0 }], bounds);
			expect(sub[0]).toBe(1);
			expect(sub[3]).toBe(0);
		});

		it('mergeLayers should combine multiple arrays bottom-to-top', () => {
			const l1 = new Uint32Array([1, 0]);
			const l2 = new Uint32Array([0, 2]);
			const result = PixelLogic.mergeLayers([l1, l2], 2, 1);
			expect(result).toEqual(new Uint32Array([1, 2]));
		});
	});

	describe('Gradient Logic', () => {
		it('getLinearGradientMap should calculate ratios', () => {
			const map = PixelLogic.getLinearGradientMap(0, 0, 10, 0, [0, 5, 10], 11);
			expect(map[0].ratio).toBe(0);
			expect(map[1].ratio).toBe(0.5);
			expect(map[2].ratio).toBe(1);
		});
	});
});
