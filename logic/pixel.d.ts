import { type ColorHex, type Point } from '../types/index.js';
/**
 * Pixel Logic: Pure data transformations for pixel grids.
 * Part of the stateless Logic Layer.
 */
export declare class PixelLogic {
    /**
     * Returns mirrored coordinates based on the active symmetry mode.
     */
    static getSymmetryPoints(x: number, y: number, width: number, height: number, mode: 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'): Point[];
    /**
     * Wraps a point to the canvas boundaries for seamless tiling.
     */
    static wrap(x: number, y: number, width: number, height: number): Point;
    /**
     * Scanline Flood Fill: Highly efficient area filling algorithm.
     * Processes horizontal spans of pixels to minimize queue operations.
     */
    static floodFill<T>(data: T[], width: number, height: number, startX: number, startY: number, fillColor: T): T[];
    private static scan;
    /**
     * Global color replacement.
     */
    static recolor(data: (ColorHex | null)[], oldColor: ColorHex | null, newColor: ColorHex): (ColorHex | null)[];
    /**
     * Analyzes unique color usage in a pixel array.
     */
    static getPaletteUsage(data: (ColorHex | null)[]): Set<ColorHex>;
    /**
     * Pixel-Perfect Filter: Removes redundant pixels from a path to maintain
     * a strict 1-pixel width (prevents double-corners).
     */
    static pixelPerfectFilter(points: Point[]): Point[];
    /**
     * Returns points for a rectangle outline.
     */
    static getRectanglePoints(x1: number, y1: number, x2: number, y2: number): Point[];
    /**
     * Midpoint Ellipse Algorithm.
     */
    static getEllipsePoints(x1: number, y1: number, x2: number, y2: number): Point[];
    private static addEllipsePoints;
    /**
     * Returns points for a regular polygon or star outline.
     * If indentation > 0, it creates a star by adding inner vertices.
     */
    static getPolygonPoints(x1: number, y1: number, x2: number, y2: number, sides: number, indentation?: number): Point[];
    /**
     * Returns points and their interpolation ratios (0-1) for a linear gradient.
     * It fills the entire bounding box or selection based on the axis p1-p2.
     */
    static getLinearGradientMap(x1: number, y1: number, x2: number, y2: number, targetIndices: number[], width: number): Array<{
        index: number;
        ratio: number;
    }>;
}
