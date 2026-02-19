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
	 * Flood Fill: Returns a new array with the connected area filled.
	 */
	static floodFill(
		data: (ColorHex | null)[],
		width: number,
		height: number,
		startX: number,
		startY: number,
		fillColor: ColorHex
	): (ColorHex | null)[] {
		const targetColor = data[startY * width + startX];
		if (targetColor === fillColor) return data;

		const newData = [...data];
		const queue: [number, number][] = [[startX, startY]];
		const visited = new Set<number>();

		while (queue.length > 0) {
			const [x, y] = queue.pop()!;
			const idx = y * width + x;

			if (!visited.has(idx)) {
				visited.add(idx);
				newData[idx] = fillColor;

				const neighbors = [
					[x + 1, y],
					[x - 1, y],
					[x, y + 1],
					[x, y - 1]
				];
				for (const [nx, ny] of neighbors) {
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						if (newData[ny * width + nx] === targetColor) {
							queue.push([nx, ny]);
						}
					}
				}
			}
		}
		return newData;
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
