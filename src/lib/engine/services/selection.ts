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
		editor.selection.initMask(editor.canvas.width, editor.canvas.height);
		editor.selection.begin(x, y);
	}

	lassoBegin(x: number, y: number) {
		const selection = editor.selection;
		selection.initMask(editor.canvas.width, editor.canvas.height);
		if (selection.selectionMode === 'NEW') {
			selection.clear();
		}
		selection.vertices = [{ x, y }];
	}

	lassoUpdate(x: number, y: number) {
		const selection = editor.selection;
		const last = selection.vertices[selection.vertices.length - 1];
		if (!last || last.x !== x || last.y !== y) {
			selection.vertices.push({ x, y });
		}
	}

	lassoEnd() {
		this.sealBinding(); // Reuse polygon filling logic to close and fill the lasso path
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
		const selection = editor.selection;

		// Auto-commit any pending constructions to the Bitmask Buffer first
		if (selection.start && selection.end) {
			this.commit();
		}
		if (selection.vertices.length > 0) {
			this.sealBinding();
		}

		const width = editor.canvas.width;
		const mask = selection.mask;
		const activeColor = editor.paletteState.activeColor;
		const activeVal = ColorLogic.hexToUint32(activeColor);

		history.beginBatch();
		let changed = false;
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		for (let i = 0; i < mask.length; i++) {
			if (mask[i] === 1) {
				const oldVal = currentPixels[i];
				if (oldVal !== activeVal) {
					history.push({
						index: i,
						oldColor: ColorLogic.uint32ToHex(oldVal),
						newColor: activeColor
					});
					currentPixels[i] = activeVal;
					changed = true;
				}
			}
		}

		if (changed) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			sfx.playDraw();
		}
		history.endBatch();
	}

	/**
	 * Commits the current construction (rectangular bounds) to the Bitmask Buffer.
	 */
	commit() {
		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const selection = editor.selection;

		// 1. If we have rectangular bounds, bake them into the mask
		const b = (selection as any).rectangularBounds;
		if (b) {
			const newMask = new Uint8Array(selection.mask);
			const val = selection.selectionMode === 'SUBTRACT' ? 0 : 1;

			for (let y = b.y1; y <= b.y2; y++) {
				for (let x = b.x1; x <= b.x2; x++) {
					if (x >= 0 && x < width && y >= 0 && y < height) {
						newMask[y * width + x] = val;
					}
				}
			}
			selection.mask = newMask;
			selection.start = null;
			selection.end = null;
		}

		editor.canvas.triggerPulse();
	}

	/**
	 * Magic Wand: Selects all connected pixels of the same color.
	 * Smart Wand: If clicked on an already selected pixel, it fills all internal holes.
	 */
	spiritPick() {
		const { x, y } = editor.cursor.pos;
		const { width, height, pixels } = editor.canvas;
		const selection = editor.selection;
		const idx = y * width + x;

		// --- Smart Wand: Detect Hole Filling Intent ---
		if (selection.mask[idx] === 1) {
			this.fillSolidHull();
			return;
		}

		selection.initMask(width, height);
		const targetVal = pixels[idx];
		const newMask =
			selection.selectionMode === 'NEW'
				? new Uint8Array(width * height)
				: new Uint8Array(selection.mask);
		const val = selection.selectionMode === 'SUBTRACT' ? 0 : 1;

		// Standard Scanline Flood Fill to Mask
		const stack: [number, number][] = [[x, y]];
		const visited = new Uint8Array(width * height);

		while (stack.length > 0) {
			let [cx, cy] = stack.pop()!;
			let lx = cx;

			while (
				lx > 0 &&
				pixels[cy * width + (lx - 1)] === targetVal &&
				visited[cy * width + (lx - 1)] === 0
			) {
				lx--;
			}

			while (
				cx < width &&
				pixels[cy * width + cx] === targetVal &&
				visited[cy * width + cx] === 0
			) {
				const cIdx = cy * width + cx;
				newMask[cIdx] = val;
				visited[cIdx] = 1;

				if (
					cy > 0 &&
					pixels[(cy - 1) * width + cx] === targetVal &&
					visited[(cy - 1) * width + cx] === 0
				) {
					stack.push([cx, cy - 1]);
				}
				if (
					cy < height - 1 &&
					pixels[(cy + 1) * width + cx] === targetVal &&
					visited[(cy + 1) * width + cx] === 0
				) {
					stack.push([cx, cy + 1]);
				}
				cx++;
			}
		}

		selection.mask = newMask;
		editor.canvas.triggerPulse();
		sfx.playScale(4);
	}

	/**
	 * fillSolidHull: An Inverse External Flood Fill algorithm.
	 * Identifies all pixels NOT reachable from the canvas boundaries,
	 * effectively selecting the entire shape and filling its holes.
	 */
	private fillSolidHull() {
		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const selection = editor.selection;
		const currentMask = selection.mask;

		// 1. Create a mask of "External" space
		const externalMask = new Uint8Array(width * height);
		const stack: [number, number][] = [];

		// 2. Seed the flood from all four edges
		for (let x = 0; x < width; x++) {
			if (currentMask[x] === 0) stack.push([x, 0]);
			if (currentMask[(height - 1) * width + x] === 0) stack.push([x, height - 1]);
		}
		for (let y = 0; y < height; y++) {
			if (currentMask[y * width] === 0) stack.push([0, y]);
			if (currentMask[y * width + (width - 1)] === 0) stack.push([width - 1, y]);
		}

		// 3. Flood fill the external space (everything reachable from edges)
		while (stack.length > 0) {
			const [cx, cy] = stack.pop()!;
			const idx = cy * width + cx;

			if (externalMask[idx] === 1) continue;
			externalMask[idx] = 1;

			// Neighbors (Check 4-connectivity)
			const neighbors = [
				[cx + 1, cy],
				[cx - 1, cy],
				[cx, cy + 1],
				[cx, cy - 1]
			];

			for (const [nx, ny] of neighbors) {
				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					const nIdx = ny * width + nx;
					if (externalMask[nIdx] === 0 && currentMask[nIdx] === 0) {
						stack.push([nx, ny]);
					}
				}
			}
		}

		// 4. The new selection is everything NOT external
		const solidMask = new Uint8Array(width * height);
		for (let i = 0; i < solidMask.length; i++) {
			if (externalMask[i] === 0) {
				solidMask[i] = 1;
			}
		}

		selection.mask = solidMask;
		editor.canvas.triggerPulse();
		sfx.playScale(8); // Higher pitch for "solidify"
		editor.studio.show('Solidified Selection');
	}

	/**
	 * Polygon Selection: Add a vertex to the current polygon selection.
	 */
	addVertex(x: number, y: number) {
		editor.selection.vertices.push({ x, y });
		sfx.playDraw();
	}

	/**
	 * Seal the Polygon: Convert the polygon vertices into the Bitmask Buffer.
	 * Uses an efficient Scanline Fill on the mask.
	 */
	sealBinding() {
		const vertices = editor.selection.vertices;
		if (vertices.length < 3) return;

		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const selection = editor.selection;
		selection.initMask(width, height);

		const newMask =
			selection.selectionMode === 'NEW'
				? new Uint8Array(width * height)
				: new Uint8Array(selection.mask);
		const val = selection.selectionMode === 'SUBTRACT' ? 0 : 1;

		// Scanline implementation for Mask
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (this.isPointInPoly(x, y, vertices)) {
					newMask[y * width + x] = val;
				}
			}
		}

		selection.mask = newMask;
		selection.vertices = [];
		editor.canvas.triggerPulse();
		sfx.playScale(6);
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
	 * Select All: Two-step behavior.
	 * 1st call: Selects all non-transparent pixels in the active layer.
	 * 2nd call: Selects all non-transparent pixels in the entire frame.
	 */
	selectAll() {
		const { width, height } = editor.canvas;
		const selection = editor.selection;
		const activeLayerPixels = editor.project.activeFrame.activeLayer.pixels;
		const compositePixels = editor.project.activeFrame.compositePixels;

		selection.initMask(width, height);
		const currentMask = selection.mask;

		// Step 1 check: Is the active layer already fully selected?
		let isLayerSelected = true;
		let layerColoredCount = 0;
		for (let i = 0; i < activeLayerPixels.length; i++) {
			if (activeLayerPixels[i] !== 0) {
				layerColoredCount++;
				if (currentMask[i] === 0) {
					isLayerSelected = false;
				}
			}
		}

		// If no pixels are colored in the layer, we skip to frame selection or do nothing
		if (layerColoredCount === 0) isLayerSelected = true;

		const newMask = new Uint8Array(width * height);

		if (!isLayerSelected || selection.maskCount < layerColoredCount) {
			// Phase 1: Select Active Layer
			for (let i = 0; i < activeLayerPixels.length; i++) {
				if (activeLayerPixels[i] !== 0) newMask[i] = 1;
			}
			editor.studio.show('Selected Active Layer');
		} else {
			// Phase 2: Select Entire Frame
			for (let i = 0; i < compositePixels.length; i++) {
				if (compositePixels[i] !== 0) newMask[i] = 1;
			}
			editor.studio.show('Selected Entire Frame');
		}

		selection.mask = newMask;
		editor.canvas.triggerPulse();
		sfx.playScale(5);
	}

	/**
	 * Erase Selection: Clears color from all pixels within the selection mask.
	 */
	eraseSelection() {
		const selection = editor.selection;

		// Auto-commit pending constructions
		if (selection.start && selection.end) this.commit();
		if (selection.vertices.length > 0) this.sealBinding();

		const width = editor.canvas.width;
		const mask = selection.mask;

		history.beginBatch();
		let changed = false;
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		for (let i = 0; i < mask.length; i++) {
			if (mask[i] === 1) {
				const oldVal = currentPixels[i];
				if (oldVal !== 0) {
					history.push({
						index: i,
						oldColor: ColorLogic.uint32ToHex(oldVal),
						newColor: null
					});
					currentPixels[i] = 0;
					changed = true;
				}
			}
		}

		if (changed) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			sfx.playErase();
		}
		history.endBatch();
	}

	/**
	 * Nudge Selection: Moves the selected pixels and the mask by a delta.
	 */
	nudge(dx: number, dy: number) {
		const selection = editor.selection;
		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const currentPixels = new Uint32Array(editor.canvas.pixels);
		const oldMask = selection.mask;
		const newMask = new Uint8Array(width * height);

		// 1. Capture current values and clear them from canvas
		const movedData: Map<number, number> = new Map();
		for (let i = 0; i < oldMask.length; i++) {
			if (oldMask[i] === 1) {
				movedData.set(i, currentPixels[i]);
				currentPixels[i] = 0;
			}
		}

		if (movedData.size === 0) return;

		// 2. Calculate new positions for both pixels and mask
		movedData.forEach((val, idx) => {
			const x = idx % width;
			const y = Math.floor(idx / width);
			const nx = x + dx;
			const ny = y + dy;

			if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
				const nIdx = ny * width + nx;
				currentPixels[nIdx] = val;
				newMask[nIdx] = 1;
			}
		});

		// 3. Update state
		editor.canvas.pixels = currentPixels;
		editor.canvas.triggerPulse();
		selection.mask = newMask;
		sfx.playMove();
	}

	/**
	 * Syrup Flow (Selection Propagation):
	 * Projects the current selection across next N frames with a linear offset.
	 */
	propagate(frameCount: number, deltaX: number, deltaY: number) {
		if (editor.selection.maskCount === 0) return;

		const project = editor.project;
		const startFrameIdx = project.activeFrameIndex;
		const activeLayerIdx = project.activeFrame.activeLayerIndex;
		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const mask = editor.selection.mask;

		// 1. Capture selection data and affected layers
		const sourceLayer = project.activeFrame.activeLayer;
		const selectionData: Array<{ x: number; y: number; val: number }> = [];

		for (let i = 0; i < mask.length; i++) {
			if (mask[i] === 1) {
				selectionData.push({
					x: i % width,
					y: Math.floor(i / width),
					val: sourceLayer.pixels[i]
				});
			}
		}

		const oldPixelStates = new Map<number, Uint32Array>();
		const newPixelStates = new Map<number, Uint32Array>();

		for (let i = 1; i <= frameCount; i++) {
			const targetFrameIdx = startFrameIdx + i;
			if (targetFrameIdx >= project.frames.length) break;

			const targetLayer = project.frames[targetFrameIdx].layers[activeLayerIdx];
			if (!targetLayer || targetLayer.isLocked) continue;

			// Store old state
			oldPixelStates.set(targetFrameIdx, new Uint32Array(targetLayer.pixels));

			// Calculate new state
			const nextPixels = new Uint32Array(targetLayer.pixels);
			const offsetX = deltaX * i;
			const offsetY = deltaY * i;

			selectionData.forEach((item) => {
				const nx = item.x + offsetX;
				const ny = item.y + offsetY;
				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					nextPixels[ny * width + nx] = item.val;
				}
			});
			newPixelStates.set(targetFrameIdx, nextPixels);
		}

		const applyStates = (states: Map<number, Uint32Array>) => {
			states.forEach((pixels, frameIdx) => {
				const layer = project.frames[frameIdx].layers[activeLayerIdx];
				if (layer) layer.pixels = pixels;
			});
			editor.canvas.triggerPulse();
		};

		// Apply forward
		applyStates(newPixelStates);

		history.push({
			isStructural: true,
			label: 'Syrup Flow',
			undo: () => applyStates(oldPixelStates),
			redo: () => applyStates(newPixelStates)
		});

		sfx.playDraw();
		editor.studio.show(`Poured across ${newPixelStates.size} cups`);
	}
}
