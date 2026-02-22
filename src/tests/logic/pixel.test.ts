import { describe, it, expect } from 'vitest';
import { PixelLogic } from '../../lib/logic/pixel.js';

describe('PixelLogic', () => {
	describe('Symmetry', () => {
		it('should return horizontal mirrored points', () => {
			const points = PixelLogic.getSymmetryPoints(0, 0, 10, 10, 'HORIZONTAL');
			expect(points).toEqual([{ x: 9, y: 0 }]);
		});

		it('should return vertical mirrored points', () => {
			const points = PixelLogic.getSymmetryPoints(0, 0, 10, 10, 'VERTICAL');
			expect(points).toEqual([{ x: 0, y: 9 }]);
		});

		it('should return quadrant mirrored points', () => {
			const points = PixelLogic.getSymmetryPoints(0, 0, 10, 10, 'QUADRANT');
			expect(points).toContainEqual({ x: 9, y: 0 });
			expect(points).toContainEqual({ x: 0, y: 9 });
			expect(points).toContainEqual({ x: 9, y: 9 });
		});
	});

	describe('Flood Fill', () => {
		it('should fill a solid area', () => {
			// 3x3 grid, all 0s
			const data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			const result = PixelLogic.floodFill(data, 3, 3, 1, 1, 1);
			expect(result).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
		});

		it('should not cross boundaries of different colors', () => {
			// 3x3 grid with a middle row of 1s
			const data = [0, 0, 0, 1, 1, 1, 0, 0, 0];
			const result = PixelLogic.floodFill(data, 3, 3, 0, 0, 2);
			// Only the first row should be filled with 2
			expect(result).toEqual([2, 2, 2, 1, 1, 1, 0, 0, 0]);
		});
	});

	describe('Sub-grid Manipulation (Clipboard)', () => {
		it('extractSubGrid should copy specific points into a new buffer', () => {
			const source = new Uint32Array([1, 2, 3, 4]); // 2x2
			const points = [
				{ x: 0, y: 0 },
				{ x: 1, y: 1 }
			];
			const bounds = { x1: 0, y1: 0, width: 2, height: 2 };

			const extracted = PixelLogic.extractSubGrid(source, 2, points, bounds);
			expect(extracted[0]).toBe(1);
			expect(extracted[3]).toBe(4);
			expect(extracted[1]).toBe(0); // Not in points
		});

		it('mergeSubGrid should place sub-grid into target at offset', () => {
			const target = new Uint32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]); // 3x3
			const subGrid = new Uint32Array([1, 2, 3, 4]); // 2x2

			const { data, changes } = PixelLogic.mergeSubGrid(target, 3, 3, subGrid, 2, 2, 1, 1);

			// Target[1,1] should be Sub[0,0] -> Index 4
			expect(data[4]).toBe(1);
			expect(data[5]).toBe(2);
			expect(data[7]).toBe(3);
			expect(data[8]).toBe(4);
			expect(changes.length).toBe(4);
		});
	});

	describe('Pixel-Perfect Filter', () => {
		it('should remove redundant L-shape corners', () => {
			// A 90-degree turn: (0,0) -> (1,0) -> (1,1)
			// In pixel art, (1,0) is often redundant if we want a diagonal (0,0) -> (1,1)
			const points = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 }
			];
			const filtered = PixelLogic.pixelPerfectFilter(points);
			expect(filtered).toEqual([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 }
			]);
		});
	});

	describe('Dithering', () => {
		it('orderedDither should be deterministic based on coordinates', () => {
			const t = 0.5;
			const p1 = PixelLogic.orderedDither(0, 0, t);
			const p2 = PixelLogic.orderedDither(1, 1, t);
			// Bayer matrix 4x4: [0,0] is 0/16, [1,1] is 4/16. Both < 0.5
			expect(p1).toBe(true);
			expect(p2).toBe(true);
		});
	});
});
