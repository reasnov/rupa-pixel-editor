/**
 * SelectionState: Manages complex selections (Motifs).
 * Supports rectangular bounds, arbitrary pixel sets, and polygon vertices.
 */
export declare class SelectionState {
    start: {
        x: number;
        y: number;
    } | null;
    end: {
        x: number;
        y: number;
    } | null;
    indices: number[];
    vertices: {
        x: number;
        y: number;
    }[];
    /**
     * Returns the set of all currently selected pixel indices.
     * Optimized for O(1) lookup during drawing operations.
     */
    activeIndicesSet: Set<number>;
    get isActive(): boolean;
    begin(x: number, y: number): void;
    update(x: number, y: number): void;
    clear(): void;
    /**
     * Returns all currently selected points as {x, y} coordinates.
     */
    getPoints(width: number): {
        x: number;
        y: number;
    }[];
    /**
     * Identifies all outer and inner edges of the selected motif.
     */
    getBoundaryEdges(width: number): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }[];
    private get rectangularBounds();
    /**
     * Unified bounds for operations like Copy/Paste.
     */
    getEffectiveBounds(width: number): {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        width: number;
        height: number;
    } | null;
}
