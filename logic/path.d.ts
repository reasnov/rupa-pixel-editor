/**
 * Path Logic: Algorithms for path simplification and smoothing.
 */
export declare class Path {
    /**
     * Ramer-Douglas-Peucker Algorithm
     */
    static simplify(points: Array<{
        x: number;
        y: number;
    }>, epsilon: number): Array<{
        x: number;
        y: number;
    }>;
    /**
     * Path Smoothing (Moving Average)
     */
    static smooth(points: Array<{
        x: number;
        y: number;
    }>, strength: number): Array<{
        x: number;
        y: number;
    }>;
    /**
     * Trace the perimeter of a color cluster to create a single SVG path.
     * (Pure mathematical algorithm for the Logic Layer)
     */
    static traceCluster(indices: Set<number>, width: number): string;
}
