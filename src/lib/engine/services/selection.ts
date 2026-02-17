import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';

/**
 * SelectionService: Handles the logic for defining regions (Looming)
 * and performing mass manipulation on those regions (Batch Fill).
 */
export class SelectionService {
	begin(x: number, y: number) {
		editor.selection.begin(x, y);
	}

	update(x: number, y: number) {
		if (editor.selection.isActive) {
			editor.selection.update(x, y);
		}
	}

	clear() {
		editor.selection.clear();
	}

	/**
	 * Batch Fill: Fills the entire active selection (Loom or Motif) with the active dye.
	 */
	commit() {
		const points = editor.selection.getPoints(editor.canvas.width);
		if (points.length === 0) return;

		const activeColor = editor.paletteState.activeColor;
		const width = editor.canvas.width;

		history.beginBatch();
		let changed = false;

		points.forEach((p) => {
			const index = p.y * width + p.x;
			const oldColor = editor.canvas.pixels[index];
			if (oldColor !== activeColor) {
				history.push({ index, oldColor, newColor: activeColor });
				editor.canvas.pixels[index] = activeColor;
				changed = true;
			}
		});

		history.endBatch();
		if (changed) sfx.playDraw();
	}

	/**
	 * Spirit Pick (Magic Wand): Selects all connected stitches of the same color.
	 */
	spiritPick() {
		const { x, y } = editor.cursor.pos;
		const targetColor = editor.canvas.getColor(x, y);
		const width = editor.canvas.width;
		const height = editor.canvas.height;

		const queue: [number, number][] = [[x, y]];
		const visited = new Set<string>();

		editor.selection.clear();

		while (queue.length > 0) {
			const [cx, cy] = queue.shift()!;
			const index = cy * width + cx;
			const key = `${cx},${cy}`;

			if (visited.has(key)) continue;
			visited.add(key);

			if (editor.canvas.getColor(cx, cy) === targetColor) {
				editor.selection.indices.push(index);

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

		if (editor.selection.indices.length > 0) {
			sfx.playScale(4); // Play a specific harmonic note
		}
	}

	/**
	 * Binding Thread: Add a vertex to the current polygon selection.
	 */
	addVertex(x: number, y: number) {
		editor.selection.vertices.push({ x, y });
		sfx.playDraw();
	}

	/**
	 * Seal the Binding: Convert the polygon vertices into a pixel selection.
	 */
	sealBinding() {
		const vertices = editor.selection.vertices;
		if (vertices.length < 3) return;

		const width = editor.canvas.width;
		const height = editor.canvas.height;
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
			editor.selection.indices = indices;
			editor.selection.vertices = [];
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
