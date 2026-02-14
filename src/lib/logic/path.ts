import { Geometry } from './geometry.js';

/**
 * Path Logic: Algorithms for path simplification and smoothing.
 */
export class Path {
	/**
	 * Ramer-Douglas-Peucker Algorithm
	 */
	static simplify(
		points: Array<{ x: number; y: number }>,
		epsilon: number
	): Array<{ x: number; y: number }> {
		if (points.length <= 2 || epsilon <= 0) return points;

		let maxDistance = 0;
		let index = 0;
		const start = points[0];
		const end = points[points.length - 1];

		for (let i = 1; i < points.length - 1; i++) {
			const d = Geometry.perpendicularDistance(points[i], start, end);
			if (d > maxDistance) {
				index = i;
				maxDistance = d;
			}
		}

		if (maxDistance > epsilon) {
			const left = this.simplify(points.slice(0, index + 1), epsilon);
			const right = this.simplify(points.slice(index), epsilon);
			return [...left.slice(0, -1), ...right];
		} else {
			return [start, end];
		}
	}

	/**
	 * Path Smoothing (Moving Average)
	 */
	static smooth(
		points: Array<{ x: number; y: number }>,
		strength: number
	): Array<{ x: number; y: number }> {
		if (points.length <= 2 || strength <= 0) return points;

		const result = [...points];
		const window = Math.floor(strength / 10) + 1;

		for (let i = 1; i < points.length - 1; i++) {
			let sx = 0,
				sy = 0,
				count = 0;
			for (let j = i - window; j <= i + window; j++) {
				if (j >= 0 && j < points.length) {
					sx += points[j].x;
					sy += points[j].y;
					count++;
				}
			}
			result[i] = { x: sx / count, y: sy / count };
		}
		return result;
	}
}
