/**
 * SelectionState: Manages complex selections (Motifs).
 * Supports both rectangular bounds and arbitrary pixel sets.
 */
export class SelectionState {
	// Traditional rectangular bounds (for backward compatibility and UI rendering)
	start = $state<{ x: number; y: number } | null>(null);
	end = $state<{ x: number; y: number } | null>(null);

	// The actual set of selected indices
	indices = $state(new Set<number>());

	get isActive(): boolean {
		return this.indices.size > 0 || this.start !== null;
	}

	begin(x: number, y: number) {
		this.start = { x, y };
		this.end = { x, y };
		this.indices.clear();
	}

	update(x: number, y: number) {
		if (this.start) {
			this.end = { x, y };
		}
	}

	/**
	 * Finalizes a rectangular selection into the indices set.
	 */
	bake(width: number) {
		const b = this.bounds;
		if (!b) return;
		for (let y = b.y1; y <= b.y2; y++) {
			for (let x = b.x1; x <= b.x2; x++) {
				this.indices.add(y * width + x);
			}
		}
		this.start = null;
		this.end = null;
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

		// Add points from arbitrary selection
		this.indices.forEach((idx) => {
			points.push({
				x: idx % width,
				y: Math.floor(idx / width)
			});
		});

		// Add points from rectangular selection
		const b = this.bounds;
		if (b) {
			for (let y = b.y1; y <= b.y2; y++) {
				for (let x = b.x1; x <= b.x2; x++) {
					points.push({ x, y });
				}
			}
		}

		return points;
	}

	get bounds() {
		if (this.indices.size > 0) {
			// Calculate bounds from the indices set
			// This is needed for copy/paste operations
			let x1 = Infinity,
				x2 = -Infinity,
				y1 = Infinity,
				y2 = -Infinity;
			// Note: We need the linen width to decode indices.
			// For simplicity, we might need to store width or pass it.
			// However, rectangular bounds are easier to manage if we keep them separate.
		}

		if (!this.start || !this.end) return null;
		return {
			x1: Math.min(this.start.x, this.end.x),
			x2: Math.max(this.start.x, this.end.x),
			y1: Math.min(this.start.y, this.end.y),
			y2: Math.max(this.start.y, this.end.y)
		};
	}
}
