/**
 * SelectionService: Handles the logic for defining selection regions
 * and performing mass manipulation on those regions (Batch Fill).
 */
export declare class SelectionService {
    begin(x: number, y: number): void;
    update(x: number, y: number): void;
    clear(): void;
    /**
     * Batch Fill: Fills the entire active selection with the active color.
     */
    fillSelection(): void;
    commit(): void;
    /**
     * Magic Wand: Selects all connected pixels of the same color.
     * Uses scanline fill for performance.
     */
    spiritPick(): void;
    /**
     * Polygon Selection: Add a vertex to the current polygon selection.
     */
    addVertex(x: number, y: number): void;
    /**
     * Seal the Polygon: Convert the polygon vertices into a pixel selection.
     */
    sealBinding(): void;
    private isPointInPoly;
    /**
     * Nudge Selection: Moves the selected pixels by a delta.
     */
    nudge(dx: number, dy: number): void;
    /**
     * Syrup Flow (Selection Propagation):
     * Projects the current selection across next N frames with a linear offset.
     */
    propagate(frameCount: number, deltaX: number, deltaY: number): void;
}
