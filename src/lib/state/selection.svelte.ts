import { editor } from './editor.svelte.js';

/**
 * SelectionState: Manages complex selections (Motifs).
 * Supports rectangular bounds, arbitrary pixel sets, and polygon vertices.
 */
export class SelectionState {
	// Traditional rectangular bounds for "Construction Mode"
	start = $state<{ x: number; y: number } | null>(null);
	end = $state<{ x: number; y: number } | null>(null);

	// The actual Bitmask Selection Buffer (Uint8Array)
	// 0 = Not Selected, 1 = Selected
	private _mask = $state.raw<Uint8Array>(new Uint8Array(0));
	maskCount = $state(0);

	get mask() {
		return this._mask;
	}
	set mask(v: Uint8Array) {
		this._mask = v;
		let count = 0;
		for (let i = 0; i < v.length; i++) {
			if (v[i] === 1) count++;
		}
		this.maskCount = count;
	}

	// Selection Modes for Boolean Operations
	selectionMode = $state<'NEW' | 'ADD' | 'SUBTRACT'>('NEW');

	// Polygon vertices for "Binding Thread" (Poly-Lasso)
	vertices = $state<{ x: number; y: number }[]>([]);

	/**
	 * Ensures the mask buffer matches the canvas dimensions.
	 */
	initMask(width: number, height: number) {
		if (this._mask.length !== width * height) {
			this._mask = new Uint8Array(width * height);
			this.maskCount = 0;
		}
	}

	/**
	 * Optimized check to see if an index is selected.
	 * $O(1)$ lookup directly from the bitmask.
	 */
	isSelected(index: number): boolean {
		return this._mask[index] === 1;
	}

	get isActive(): boolean {
		return this.start !== null || this.vertices.length > 0 || this.maskCount > 0;
	}

	activeIndicesSet = $derived.by(() => {
		const set = new Set<number>();
		for (let i = 0; i < this._mask.length; i++) {
			if (this._mask[i] === 1) set.add(i);
		}
		return set;
	});

	begin(x: number, y: number) {
		if (this.selectionMode === 'NEW') {
			this.clear();
		}
		this.start = { x, y };
		this.end = { x, y };
	}

	update(x: number, y: number) {
		if (this.start) {
			this.end = { x, y };
		}
	}

	clear() {
		this.start = null;
		this.end = null;
		this.vertices = [];
		const newMask = new Uint8Array(this._mask.length);
		newMask.fill(0);
		this._mask = newMask;
		this.maskCount = 0;
	}

	/**
	 * Returns all currently selected points as {x, y} coordinates.
	 */
	getPoints(width: number) {
		const points: { x: number; y: number }[] = [];

		// 1. Collect points from Bitmask
		for (let i = 0; i < this._mask.length; i++) {
			if (this._mask[i] === 1) {
				points.push({
					x: i % width,
					y: Math.floor(i / width)
				});
			}
		}

		// 2. Add points from construction bounds (if NEW mode)
		// Otherwise, they'll be added to the mask on commit.
		const b = this.rectangularBounds;
		if (b) {
			const set = new Set(points.map((p) => p.y * width + p.x));
			for (let y = b.y1; y <= b.y2; y++) {
				for (let x = b.x1; x <= b.x2; x++) {
					const idx = y * width + x;
					if (!set.has(idx)) {
						points.push({ x, y });
					}
				}
			}
		}

		return points;
	}

	/**
	 * Identifies all outer and inner edges of the selected motif.
	 * Optimized to use the Bitmask Buffer.
	 */
	getBoundaryEdges(width: number) {
		const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
		const height = Math.floor(this._mask.length / width);

		// Scan all pixels in the mask
		for (let i = 0; i < this._mask.length; i++) {
			if (this._mask[i] === 1) {
				const x = i % width;
				const y = Math.floor(i / width);

				// Top neighbor
				if (y === 0 || this._mask[(y - 1) * width + x] === 0)
					edges.push({ x1: x, y1: y, x2: x + 1, y2: y });
				// Bottom neighbor
				if (y === height - 1 || this._mask[(y + 1) * width + x] === 0)
					edges.push({ x1: x, y1: y + 1, x2: x + 1, y2: y + 1 });
				// Left neighbor
				if (x === 0 || this._mask[y * width + (x - 1)] === 0)
					edges.push({ x1: x, y1: y, x2: x, y2: y + 1 });
				// Right neighbor
				if (x === width - 1 || this._mask[y * width + (x + 1)] === 0)
					edges.push({ x1: x + 1, y1: y, x2: x + 1, y2: y + 1 });
			}
		}

		// Also scan construction bounds for visual feedback
		const b = this.rectangularBounds;
		if (b) {
			const rectEdges = [
				{ x1: b.x1, y1: b.y1, x2: b.x2 + 1, y2: b.y1 }, // Top
				{ x1: b.x1, y1: b.y2 + 1, x2: b.x2 + 1, y2: b.y2 + 1 }, // Bottom
				{ x1: b.x1, y1: b.y1, x2: b.x1, y2: b.y2 + 1 }, // Left
				{ x1: b.x2 + 1, y1: b.y1, x2: b.x2 + 1, y2: b.y2 + 1 } // Right
			];
			edges.push(...rectEdges);
		}

		return edges;
	}

	// Internal helper for the box logic
	private get rectangularBounds() {
		if (!this.start || !this.end) return null;
		return {
			x1: Math.min(this.start.x, this.end.x),
			x2: Math.max(this.start.x, this.end.x),
			y1: Math.min(this.start.y, this.end.y),
			y2: Math.max(this.start.y, this.end.y)
		};
	}

	/**
	 * Unified bounds for operations like Copy/Paste.
	 * Includes both the committed bitmask and active construction bounds.
	 */
	getEffectiveBounds(width: number) {
		let x1 = Infinity,
			x2 = -Infinity,
			y1 = Infinity,
			y2 = -Infinity;
		let found = false;

		// 1. Check Bitmask
		for (let i = 0; i < this._mask.length; i++) {
			if (this._mask[i] === 1) {
				const x = i % width;
				const y = Math.floor(i / width);
				if (x < x1) x1 = x;
				if (x > x2) x2 = x;
				if (y < y1) y1 = y;
				if (y > y2) y2 = y;
				found = true;
			}
		}

		// 2. Check Construction Bounds
		const b = this.rectangularBounds;
		if (b) {
			if (b.x1 < x1) x1 = b.x1;
			if (b.x2 > x2) x2 = b.x2;
			if (b.y1 < y1) y1 = b.y1;
			if (b.y2 > y2) y2 = b.y2;
			found = true;
		}

		if (!found) return null;
		return { x1, x2, y1, y2, width: x2 - x1 + 1, height: y2 - y1 + 1 };
	}
}
