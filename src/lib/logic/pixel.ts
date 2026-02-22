import { type ColorHex, type Point } from '../types/index.js';
import { Geometry } from './geometry.js';

/**
 * Pixel Logic: Pure data transformations for pixel grids.
 * Part of the stateless Logic Layer.
 */
export class PixelLogic {
	/**
	 * Returns mirrored coordinates based on the active symmetry mode.
	 */
	static getSymmetryPoints(
		x: number,
		y: number,
		width: number,
		height: number,
		mode: 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'
	): Point[] {
		const points: Point[] = [];
		const mx = width - 1 - x;
		const my = height - 1 - y;

		if (mode === 'HORIZONTAL') {
			points.push({ x: mx, y });
		} else if (mode === 'VERTICAL') {
			points.push({ x, y: my });
		} else if (mode === 'QUADRANT') {
			points.push({ x: mx, y });
			points.push({ x, y: my });
			points.push({ x: mx, y: my });
		}

		return points;
	}

	/**
	 * Wraps a point to the canvas boundaries for seamless tiling.
	 */
	static wrap(x: number, y: number, width: number, height: number): Point {
		return {
			x: ((x % width) + width) % width,
			y: ((y % height) + height) % height
		};
	}

	/**
	 * Scanline Flood Fill: Highly efficient area filling algorithm.
	 * Processes horizontal spans of pixels to minimize queue operations.
	 */
	static floodFill<T>(
		data: T[],
		width: number,
		height: number,
		startX: number,
		startY: number,
		fillColor: T
	): T[] {
		const targetColor = data[startY * width + startX];
		if (targetColor === fillColor) return data;

		const newData = [...data];
		const stack: [number, number][] = [[startX, startY]];

		while (stack.length > 0) {
			let [x, y] = stack.pop()!;
			let lx = x;

			// Find leftmost point of the span
			while (lx > 0 && newData[y * width + (lx - 1)] === targetColor) {
				newData[y * width + (lx - 1)] = fillColor;
				lx--;
			}

			// Find rightmost point of the span and fill
			while (x < width && newData[y * width + x] === targetColor) {
				newData[y * width + x] = fillColor;
				x++;
			}

			// Check adjacent scanlines
			this.scan(lx, x - 1, y - 1, width, height, newData, targetColor, stack);
			this.scan(lx, x - 1, y + 1, width, height, newData, targetColor, stack);
		}

		return newData;
	}

	private static scan<T>(
		lx: number,
		rx: number,
		y: number,
		width: number,
		height: number,
		data: T[],
		targetColor: T,
		stack: [number, number][]
	) {
		if (y < 0 || y >= height) return;

		let added = false;
		for (let x = lx; x <= rx; x++) {
			if (data[y * width + x] === targetColor) {
				if (!added) {
					stack.push([x, y]);
					added = true;
				}
			} else {
				added = false;
			}
		}
	}

	/**
	 * Global color replacement.
	 */
	static recolor(
		data: (ColorHex | null)[],
		oldColor: ColorHex | null,
		newColor: ColorHex
	): (ColorHex | null)[] {
		return data.map((c) => (c === oldColor ? newColor : c));
	}

	/**
	 * Analyzes unique color usage in a pixel array.
	 */
	static getPaletteUsage(data: (ColorHex | null)[]): Set<ColorHex> {
		const usage = new Set<ColorHex>();
		data.forEach((c) => {
			if (c) usage.add(c);
		});
		return usage;
	}

	/**
	 * Pixel-Perfect Filter: Removes redundant pixels from a path to maintain
	 * a strict 1-pixel width (prevents double-corners).
	 */
	static pixelPerfectFilter(points: Point[]): Point[] {
		if (points.length < 3) return points;

		const result: Point[] = [points[0]];

		for (let i = 1; i < points.length; i++) {
			const p = points[i];
			const last = result[result.length - 1];

			// If it's the same pixel, skip
			if (p.x === last.x && p.y === last.y) continue;

			// Check for redundant corner
			if (result.length >= 2) {
				const prev = result[result.length - 2];
				// If current pixel is adjacent to the one before last,
				// then the last pixel is a redundant corner.
				const dx = Math.abs(p.x - prev.x);
				const dy = Math.abs(p.y - prev.y);

				if (dx <= 1 && dy <= 1) {
					result.pop(); // Remove the "elbow"
				}
			}

			result.push(p);
		}

		return result;
	}

	/**
	 * Ordered Dithering (Bayer 4x4 Matrix)
	 * Returns true if the pixel at (x, y) should be painted for a given threshold (0.0 to 1.0).
	 */
	private static BAYER_4X4 = [
		[0, 8, 2, 10],
		[12, 4, 14, 6],
		[3, 11, 1, 9],
		[15, 7, 13, 5]
	];

	static orderedDither(x: number, y: number, threshold: number): boolean {
		if (threshold >= 1.0) return true;
		if (threshold <= 0.0) return false;

		const mx = ((x % 4) + 4) % 4;
		const my = ((y % 4) + 4) % 4;
		const matrixValue = this.BAYER_4X4[my][mx] / 16;

		return threshold > matrixValue;
	}

	/**
	 * Returns points for a rectangle outline.
	 */
	static getRectanglePoints(x1: number, y1: number, x2: number, y2: number): Point[] {
		const points: Point[] = [];
		const minX = Math.min(x1, x2);
		const maxX = Math.max(x1, x2);
		const minY = Math.min(y1, y2);
		const maxY = Math.max(y1, y2);

		for (let x = minX; x <= maxX; x++) {
			points.push({ x, y: minY });
			points.push({ x, y: maxY });
		}
		for (let y = minY + 1; y < maxY; y++) {
			points.push({ x: minX, y });
			points.push({ x: maxX, y });
		}
		return points;
	}

	/**
	 * Midpoint Ellipse Algorithm.
	 */
	static getEllipsePoints(x1: number, y1: number, x2: number, y2: number): Point[] {
		const xc = (x1 + x2) / 2;
		const yc = (y1 + y2) / 2;
		const rx = Math.abs(x2 - x1) / 2;
		const ry = Math.abs(y2 - y1) / 2;

		if (rx === 0 || ry === 0) return [];

		const points: Point[] = [];
		let x = 0;
		let y = ry;

		// Initial decision parameter of region 1
		let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
		let dx = 2 * ry * ry * x;
		let dy = 2 * rx * rx * y;

		while (dx < dy) {
			this.addEllipsePoints(points, xc, yc, x, y);
			if (d1 < 0) {
				x++;
				dx = dx + 2 * ry * ry;
				d1 = d1 + dx + ry * ry;
			} else {
				x++;
				y--;
				dx = dx + 2 * ry * ry;
				dy = dy - 2 * rx * rx;
				d1 = d1 + dx - dy + ry * ry;
			}
		}

		// Decision parameter of region 2
		let d2 = ry * ry * ((x + 0.5) * (x + 0.5)) + rx * rx * ((y - 1) * (y - 1)) - rx * rx * ry * ry;

		while (y >= 0) {
			this.addEllipsePoints(points, xc, yc, x, y);
			if (d2 > 0) {
				y--;
				dy = dy - 2 * rx * rx;
				d2 = d2 + rx * rx - dy;
			} else {
				y--;
				x++;
				dx = dx + 2 * ry * ry;
				dy = dy - 2 * rx * rx;
				d2 = d2 + dx - dy + rx * rx;
			}
		}

		return points;
	}

	private static addEllipsePoints(points: Point[], xc: number, yc: number, x: number, y: number) {
		points.push({ x: Math.round(xc + x), y: Math.round(yc + y) });
		points.push({ x: Math.round(xc - x), y: Math.round(yc + y) });
		points.push({ x: Math.round(xc + x), y: Math.round(yc - y) });
		points.push({ x: Math.round(xc - x), y: Math.round(yc - y) });
	}

	/**
	 * Returns points for a regular polygon or star outline.
	 * If indentation > 0, it creates a star by adding inner vertices.
	 */
	static getPolygonPoints(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		sides: number,
		indentation: number = 0
	): Point[] {
		const xc = (x1 + x2) / 2;
		const yc = (y1 + y2) / 2;
		const rx = Math.abs(x2 - x1) / 2;
		const ry = Math.abs(y2 - y1) / 2;
		const r = Math.max(rx, ry);

		if (r === 0) return [];

		const vertices: Point[] = [];
		const startAngle = -Math.PI / 2;

		if (indentation > 0) {
			// Star Shape: 2x vertices (outer and inner)
			const innerR = r * (1 - indentation / 100);
			for (let i = 0; i < sides * 2; i++) {
				const angle = startAngle + (i * Math.PI) / sides;
				const currentR = i % 2 === 0 ? r : innerR;
				vertices.push({
					x: Math.round(xc + Math.cos(angle) * currentR),
					y: Math.round(yc + Math.sin(angle) * currentR)
				});
			}
		} else {
			// Regular Polygon
			for (let i = 0; i < sides; i++) {
				const angle = startAngle + (i * 2 * Math.PI) / sides;
				vertices.push({
					x: Math.round(xc + Math.cos(angle) * r),
					y: Math.round(yc + Math.sin(angle) * r)
				});
			}
		}

		const points: Point[] = [];
		for (let i = 0; i < vertices.length; i++) {
			const v1 = vertices[i];
			const v2 = vertices[(i + 1) % vertices.length];
			points.push(...Geometry.getLinePoints(v1.x, v1.y, v2.x, v2.y));
		}

		return points;
	}

	/**
	 * Extracts a sub-grid of pixels from a larger source array.
	 * Used for copying selections to the clipboard.
	 */
	static extractSubGrid(
		source: Uint32Array,
		sourceWidth: number,
		points: Point[],
		bounds: { x1: number; y1: number; width: number; height: number }
	): Uint32Array {
		const target = new Uint32Array(bounds.width * bounds.height);

		points.forEach((p) => {
			const sourceIndex = p.y * sourceWidth + p.x;
			const targetX = p.x - bounds.x1;
			const targetY = p.y - bounds.y1;
			const targetIndex = targetY * bounds.width + targetX;

			if (targetIndex >= 0 && targetIndex < target.length) {
				target[targetIndex] = source[sourceIndex];
			}
		});

		return target;
	}

	/**
	 * Merges a sub-grid back into a larger target array at a specific offset.
	 * Returns the modified target array and a list of changed indices.
	 */
	static mergeSubGrid(
		target: Uint32Array,
		targetWidth: number,
		targetHeight: number,
		subGrid: Uint32Array,
		subWidth: number,
		subHeight: number,
		offsetX: number,
		offsetY: number
	): { data: Uint32Array; changes: Array<{ index: number; color: number }> } {
		const newData = new Uint32Array(target);
		const changes: Array<{ index: number; color: number }> = [];

		for (let y = 0; y < subHeight; y++) {
			for (let x = 0; x < subWidth; x++) {
				const tx = offsetX + x;
				const ty = offsetY + y;

				if (tx >= 0 && tx < targetWidth && ty >= 0 && ty < targetHeight) {
					const subIdx = y * subWidth + x;
					const val = subGrid[subIdx];

					// Skip transparent pixels in the sub-grid (assumed 0)
					if (val !== 0) {
						const tIdx = ty * targetWidth + tx;
						if (newData[tIdx] !== val) {
							newData[tIdx] = val;
							changes.push({ index: tIdx, color: val });
						}
					}
				}
			}
		}

		return { data: newData, changes };
	}

	/**
	 * Merges a list of pixel arrays into a single target array.
	 * Lower indices in the array represent lower layers (Bottom-to-Top).
	 */
	static mergeLayers(layers: Uint32Array[], width: number, height: number): Uint32Array {
		const result = new Uint32Array(width * height);

		// Render from bottom to top
		for (const pixels of layers) {
			for (let i = 0; i < result.length; i++) {
				const pixel = pixels[i];
				if (pixel !== 0) {
					// Simple overwrite for now (since our system uses binary transparency)
					// In a full blending system, we would use AlphaCompositing here.
					result[i] = pixel;
				}
			}
		}

		return result;
	}

	/**
	 * Returns points and their interpolation ratios (0-1) for a linear gradient.
	 * It fills the entire bounding box or selection based on the axis p1-p2.
	 */
	static getLinearGradientMap(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		targetIndices: number[],
		width: number
	): Array<{ index: number; ratio: number }> {
		const results: Array<{ index: number; ratio: number }> = [];

		const dx = x2 - x1;
		const dy = y2 - y1;
		const lengthSq = dx * dx + dy * dy;

		if (lengthSq === 0) {
			return targetIndices.map((index) => ({ index, ratio: 0 }));
		}

		targetIndices.forEach((index) => {
			const px = index % width;
			const py = Math.floor(index / width);

			// Project point onto axis
			const t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
			const ratio = Math.max(0, Math.min(1, t));

			results.push({ index, ratio });
		});

		return results;
	}
}
