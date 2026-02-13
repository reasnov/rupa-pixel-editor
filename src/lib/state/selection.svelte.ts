/**
 * SelectionState: Manages complex selections (Motifs).
 * Supports rectangular bounds, arbitrary pixel sets, and polygon vertices.
 */
export class SelectionState {
	// Traditional rectangular bounds
	start = $state<{ x: number; y: number } | null>(null);
	end = $state<{ x: number; y: number } | null>(null);

	// The actual set of selected indices
	indices = $state<number[]>([]);

	// Polygon vertices for "Binding Thread" (Poly-Lasso)
	vertices = $state<{ x: number; y: number }[]>([]);

	get isActive(): boolean {
		return this.indices.length > 0 || this.start !== null || this.vertices.length > 0;
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
		this.indices = [];
		this.vertices = [];
	}

	/**
	 * Returns all currently selected points as {x, y} coordinates.
	 */
	getPoints(width: number) {
		const pointsMap = new Map<number, { x: number; y: number }>();

		// Add points from arbitrary selection (Spirit Pick)
		this.indices.forEach((idx) => {
			pointsMap.set(idx, {
				x: idx % width,
				y: Math.floor(idx / width)
			});
		});

		// Add points from rectangular selection (Looming)
		const b = this.rectangularBounds;
		if (b) {
			for (let y = b.y1; y <= b.y2; y++) {
				for (let x = b.x1; x <= b.x2; x++) {
					const idx = y * width + x;
					pointsMap.set(idx, { x, y });
				}
			}
		}

		return Array.from(pointsMap.values());
	}

	/**
	 * Identifies all outer and inner edges of the selected motif.
	 */
	getBoundaryEdges(width: number) {
		const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
		const points = this.getPoints(width);
		if (points.length === 0) return edges;

		const pointSet = new Set(points.map((p) => `${p.x},${p.y}`));

		points.forEach((p) => {
			if (!pointSet.has(`${p.x},${p.y - 1}`))
				edges.push({ x1: p.x, y1: p.y, x2: p.x + 1, y2: p.y });
			if (!pointSet.has(`${p.x},${p.y + 1}`))
				edges.push({ x1: p.x, y1: p.y + 1, x2: p.x + 1, y2: p.y + 1 });
			if (!pointSet.has(`${p.x - 1},${p.y}`))
				edges.push({ x1: p.x, y1: p.y, x2: p.x, y2: p.y + 1 });
			if (!pointSet.has(`${p.x + 1},${p.y}`))
				edges.push({ x1: p.x + 1, y1: p.y, x2: p.x + 1, y2: p.y + 1 });
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
