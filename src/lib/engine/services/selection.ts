import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';
import { ColorLogic } from '../../logic/color.js';
import { PixelLogic } from '../../logic/pixel.js';

/**
 * SelectionService: Handles the logic for defining selection regions
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
	 * Batch Fill: Fills the entire active selection with the active color.
	 */
	fillSelection() {
		const points = editor.selection.getPoints(editor.canvas.width);
		if (points.length === 0) return;

		const activeColor = editor.paletteState.activeColor;
		const activeVal = ColorLogic.hexToUint32(activeColor);
		const width = editor.canvas.width;

		history.beginBatch();
		let changed = false;
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		points.forEach((p) => {
			const index = p.y * width + p.x;
			const oldVal = currentPixels[index];
			if (oldVal !== activeVal) {
				history.push({
					index,
					oldColor: ColorLogic.uint32ToHex(oldVal),
					newColor: activeColor
				});
				currentPixels[index] = activeVal;
				changed = true;
			}
		});

		if (changed) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			sfx.playDraw();
		}
		history.endBatch();
	}

	commit() {
		// Just a visual sync for mouse drag-to-select
		editor.canvas.triggerPulse();
	}

	/**
	 * Magic Wand: Selects all connected pixels of the same color.
	 * Uses scanline fill for performance.
	 */
	spiritPick() {
		const { x, y } = editor.cursor.pos;
		const targetVal = editor.canvas.getColor(x, y);
		const { width, height, pixels } = editor.canvas;

		// Use floodFill to find connected region
		const markerVal = 0xffffffff; // temporary marker
		const filled = PixelLogic.floodFill<number>(Array.from(pixels), width, height, x, y, markerVal);

		const indices: number[] = [];
		for (let i = 0; i < filled.length; i++) {
			if (filled[i] === markerVal) indices.push(i);
		}

		editor.selection.clear();
		if (indices.length > 0) {
			editor.selection.indices = indices;
			editor.canvas.triggerPulse();
			sfx.playScale(4); // Play a specific harmonic note
		}
	}

	/**
	 * Polygon Selection: Add a vertex to the current polygon selection.
	 */
	addVertex(x: number, y: number) {
		editor.selection.vertices.push({ x, y });
		sfx.playDraw();
	}

	/**
	 * Seal the Polygon: Convert the polygon vertices into a pixel selection.
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

	/**
	 * Nudge Selection: Moves the selected pixels by a delta.
	 */
	nudge(dx: number, dy: number) {
		if (editor.selection.indices.length === 0) return;

		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		// 1. Capture current values and clear them from canvas
		const movedData: Map<number, number> = new Map();
		editor.selection.indices.forEach((idx) => {
			movedData.set(idx, currentPixels[idx]);
			currentPixels[idx] = 0;
		});

		// 2. Calculate new positions
		const newIndices: number[] = [];
		movedData.forEach((val, idx) => {
			const x = idx % width;
			const y = Math.floor(idx / width);
			const nx = x + dx;
			const ny = y + dy;

			if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
				const nIdx = ny * width + nx;
				currentPixels[nIdx] = val;
				newIndices.push(nIdx);
			}
		});

		// 3. Update state
		editor.canvas.pixels = currentPixels;
		editor.canvas.triggerPulse();
		editor.selection.indices = newIndices;
		sfx.playMove();
	}
}
