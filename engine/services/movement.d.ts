/**
 * MovementService: Handles cursor navigation and coordinate translations.
 */
export declare class MovementService {
    /**
     * Move the cursor by a delta.
     */
    move(dx: number, dy: number): boolean;
    /**
     * Translates internal array coordinates to Artisan Cartesian coordinates.
     */
    internalToCartesian(x: number, y: number, width: number, height: number): {
        x: number;
        y: number;
    };
    /**
     * Translates Artisan Cartesian coordinates back to internal array indices.
     */
    cartesianToInternal(tx: number, ty: number, width: number, height: number): {
        x: number;
        y: number;
    };
    /**
     * Jump the needle to a specific Cartesian coordinate.
     */
    jumpTo(tx: number, ty: number): void;
    /**
     * Reset the cursor to the center (1,1).
     */
    jumpHome(): void;
}
