/**
 * SelectionState: Manages complex selections (Motifs).
 * Supports both rectangular bounds and arbitrary pixel sets.
 */
export class SelectionState {
	// Traditional rectangular bounds
	start = $state<{ x: number; y: number } | null>(null);
	end = $state<{ x: number; y: number } | null>(null);

	// The actual set of selected indices
	indices = $state(new Set<number>());

	get isActive(): boolean {
		return this.indices.size > 0 || this.start !== null;
	}

	begin(x: number, y: number) {
		this.clear();
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
		this.indices.clear();
	}

	/**
	 * Returns all currently selected points as {x, y} coordinates.
	 */
	getPoints(width: number) {
		const points: { x: number; y: number }[] = [];

		// Add points from arbitrary selection (Spirit Pick)
		this.indices.forEach((idx) => {
			points.push({
				x: idx % width,
				y: Math.floor(idx / width)
			});
		});

		// Add points from rectangular selection (Looming)
		const b = this.rectangularBounds;
		if (b) {
			for (let y = b.y1; y <= b.y2; y++) {
				for (let x = b.x1; x <= b.x2; x++) {
					points.push({ x, y });
				}
			}
		}

		return points;
	}

	/**
	 * Identifies all outer and inner edges of the selected motif.
	 * Returns a list of edges as {x1, y1, x2, y2} for SVG rendering.
	 */
	getBoundaryEdges(width: number) {
		const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
		const points = this.getPoints(width);
		if (points.length === 0) return edges;

		const pointSet = new Set(points.map((p) => `${p.x},${p.y}`));

		points.forEach((p) => {
			// Top Edge
			if (!pointSet.has(`${p.x},${p.y - 1}`)) {
				edges.push({ x1: p.x, y1: p.y, x2: p.x + 1, y2: p.y });
			}
			// Bottom Edge
			if (!pointSet.has(`${p.x},${p.y + 1}`)) {
				edges.push({ x1: p.x, y1: p.y + 1, x2: p.x + 1, y2: p.y + 1 });
			}
			// Left Edge
			if (!pointSet.has(`${p.x - 1},${p.y}`)) {
				edges.push({ x1: p.x, y1: p.y, x2: p.x, y2: p.y + 1 });
			}
			// Right Edge
			if (!pointSet.has(`${p.x + 1},${p.y}`)) {
				edges.push({ x1: p.x + 1, y1: p.y, x2: p.x + 1, y2: p.y + 1 });
			}
		});

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
	 * Calculates the smallest rectangle that contains all selected pixels.
	 */
	getEffectiveBounds(width: number) {
		const points = this.getPoints(width);
		if (points.length === 0) return null;

		let x1 = Infinity,
			x2 = -Infinity,
			y1 = Infinity,
			y2 = -Infinity;
		points.forEach((p) => {
			if (p.x < x1) x1 = p.x;
			if (p.x > x2) x2 = p.x;
			if (p.y < y1) y1 = p.y;
			if (p.y > y2) y2 = p.y;
		});

		return { x1, x2, y1, y2, width: x2 - x1 + 1, height: y2 - y1 + 1 };
	}
}
