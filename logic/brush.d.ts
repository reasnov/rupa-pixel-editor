import { type Point } from '../types/index.js';
/**
 * BrushLogic: Pure mathematical calculations for multi-pixel kernels.
 * Part of the stateless Logic Layer.
 */
export declare class BrushLogic {
    /**
     * Returns a list of relative offsets for a given brush size and shape.
     * Size is the diameter (1, 2, 3, 4, 5).
     */
    static getKernel(size: number, shape: 'SQUARE' | 'CIRCLE'): Point[];
    /**
     * Returns horizontal spans for high-performance large-scale construction.
     * Size is the diameter (1 to 100).
     */
    static getSpans(size: number, shape: 'SQUARE' | 'CIRCLE'): Array<{
        y: number;
        x1: number;
        x2: number;
    }>;
}
