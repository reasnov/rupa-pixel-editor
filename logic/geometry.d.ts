/**
 * Geometry Logic: Pure mathematical functions for shapes and lines.
 */
export declare class Geometry {
    /**
     * Clean Bresenham's Line Algorithm (8-connectivity).
     * Produces standard 1-pixel width lines without the "staircase" zigzag.
     */
    static getLinePoints(x0: number, y0: number, x1: number, y1: number, broadness?: number): Array<{
        x: number;
        y: number;
    }>;
    /**
     * Midpoint Circle Algorithm: Returns pixel-perfect circle coordinates.
     */
    static getCirclePoints(cx: number, cy: number, radius: number): Array<{
        x: number;
        y: number;
    }>;
    /**
     * Fits an arc or circle to a set of points.
     */
    static fitArc(points: Array<{
        x: number;
        y: number;
    }>, circularityThreshold: number): {
        cx: number;
        cy: number;
        r: number;
        isFull: boolean;
        points: Array<{
            x: number;
            y: number;
        }>;
    } | null;
    static perpendicularDistance(p: {
        x: number;
        y: number;
    }, a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }): number;
    /**
     * Converts internal grid coordinates to artisan Cartesian labels (Center-relative).
     */
    static toCartesianLabel(pos: number, size: number, invert?: boolean): number;
    /**
     * Calculates the percentage position for canvas grid guides.
     */
    static getGuidePosition(offset: number, size: number): number;
    /**
     * Maps screen coordinates to canvas grid coordinates.
     */
    static mapScreenToGrid(clientX: number, clientY: number, rect: DOMRect, canvasWidth: number, canvasHeight: number): {
        x: number;
        y: number;
    };
    /**
     * Calculates the CSS transform string for the camera viewport.
     */
    static calculateCameraTransform(zoomLevel: number, panOffset: {
        x: number;
        y: number;
    }, cursorPos: {
        x: number;
        y: number;
    }, canvasWidth: number, canvasHeight: number): string;
    /**
     * Calculates the movement delta for panning.
     */
    static calculatePanDelta(currentX: number, currentY: number, lastX: number, lastY: number): {
        dx: number;
        dy: number;
    };
}
