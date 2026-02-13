import { atelier } from '../../state/atelier.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';

/**
 * SelectionService: Handles the logic for defining regions (Looming)
 * and performing mass manipulation on those regions (Batch Fill).
 */
export class SelectionService {
	begin(x: number, y: number) {
		atelier.selection.begin(x, y);
	}

	update(x: number, y: number) {
		if (atelier.selection.isActive) {
			atelier.selection.update(x, y);
		}
	}

	clear() {
		atelier.selection.clear();
	}

	/**
	 * Batch Fill: Fills the entire active selection (Loom or Motif) with the active dye.
	 */
	commit() {
		const points = atelier.selection.getPoints(atelier.linen.width);
		if (points.length === 0) return;

		const activeDye = atelier.paletteState.activeDye;
		const width = atelier.linen.width;

		history.beginBatch();
		let changed = false;

		points.forEach((p) => {
			const index = p.y * width + p.x;
			const oldColor = atelier.linen.stitches[index];
			if (oldColor !== activeDye) {
				history.push({ index, oldColor, newColor: activeDye });
				atelier.linen.stitches[index] = activeDye;
				changed = true;
			}
		});

		history.endBatch();
		if (changed) sfx.playStitch();
	}

	/**
	 * Spirit Pick (Magic Wand): Selects all connected stitches of the same color.
	 */
	spiritPick() {
		const { x, y } = atelier.needle.pos;
		const targetColor = atelier.linen.getColor(x, y);
		const width = atelier.linen.width;
		const height = atelier.linen.height;

		const queue: [number, number][] = [[x, y]];
		const visited = new Set<string>();

		atelier.selection.clear();

		while (queue.length > 0) {
			const [cx, cy] = queue.shift()!;
			const index = cy * width + cx;
			const key = `${cx},${cy}`;

			if (visited.has(key)) continue;
			visited.add(key);

			if (atelier.linen.getColor(cx, cy) === targetColor) {
				atelier.selection.indices.push(index);

				const neighbors: [number, number][] = [
					[cx + 1, cy],
					[cx - 1, cy],
					[cx, cy + 1],
					[cx, cy - 1]
				];

				for (const [nx, ny] of neighbors) {
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						queue.push([nx, ny]);
					}
				}
			}
		}

		if (atelier.selection.indices.length > 0) {
			sfx.playScale(4); // Play a specific harmonic note
		}
	}

	/**
	 * Binding Thread: Add a vertex to the current polygon selection.
	 */
	addVertex(x: number, y: number) {
		atelier.selection.vertices.push({ x, y });
		sfx.playStitch();
	}

	/**
	 * Seal the Binding: Convert the polygon vertices into a pixel selection.
	 */
	sealBinding() {
		const vertices = atelier.selection.vertices;
		if (vertices.length < 3) return;

		const width = atelier.linen.width;
		const height = atelier.linen.height;
		const indices: number[] = [];

		// Ray casting algorithm for point-in-polygon
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (this.isPointInPoly(x, y, vertices)) {
					indices.push(y * width + x);
				}
			}
		}

		if (indices.length > 0) {
			atelier.selection.indices = indices;
			atelier.selection.vertices = [];
			sfx.playScale(6);
		}
	}

	private isPointInPoly(px: number, py: number, poly: { x: number; y: number }[]) {
		let isInside = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			const xi = poly[i].x,
				yi = poly[i].y;
			const xj = poly[j].x,
				yj = poly[j].y;

			const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
			if (intersect) isInside = !isInside;
		}
		return isInside;
	}
}
