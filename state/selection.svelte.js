import { editor } from './editor.svelte.js';
/**
 * SelectionState: Manages complex selections (Motifs).
 * Supports rectangular bounds, arbitrary pixel sets, and polygon vertices.
 */
export class SelectionState {
    // Traditional rectangular bounds
    start = $state(null);
    end = $state(null);
    // The actual set of selected indices
    indices = $state([]);
    // Polygon vertices for "Binding Thread" (Poly-Lasso)
    vertices = $state([]);
    /**
     * Returns the set of all currently selected pixel indices.
     * Optimized for O(1) lookup during drawing operations.
     */
    activeIndicesSet = $derived.by(() => {
        const set = new Set();
        const width = editor.canvas.width;
        // Add points from arbitrary selection (Spirit Pick)
        this.indices.forEach((idx) => set.add(idx));
        // Add points from rectangular selection (Looming)
        const b = this.rectangularBounds;
        if (b) {
            for (let y = b.y1; y <= b.y2; y++) {
                for (let x = b.x1; x <= b.x2; x++) {
                    set.add(y * width + x);
                }
            }
        }
        return set;
    });
    get isActive() {
        return this.indices.length > 0 || this.start !== null || this.vertices.length > 0;
    }
    begin(x, y) {
        this.clear();
        this.start = { x, y };
        this.end = { x, y };
    }
    update(x, y) {
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
    getPoints(width) {
        const pointsMap = new Map();
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
    getBoundaryEdges(width) {
        const edges = [];
        const points = this.getPoints(width);
        if (points.length === 0)
            return edges;
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
    get rectangularBounds() {
        if (!this.start || !this.end)
            return null;
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
    getEffectiveBounds(width) {
        const points = this.getPoints(width);
        if (points.length === 0)
            return null;
        let x1 = Infinity, x2 = -Infinity, y1 = Infinity, y2 = -Infinity;
        points.forEach((p) => {
            if (p.x < x1)
                x1 = p.x;
            if (p.x > x2)
                x2 = p.x;
            if (p.y < y1)
                y1 = p.y;
            if (p.y > y2)
                y2 = p.y;
        });
        return { x1, x2, y1, y2, width: x2 - x1 + 1, height: y2 - y1 + 1 };
    }
}
