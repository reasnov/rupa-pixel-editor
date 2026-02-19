export declare class ExportEngine {
    /**
     * Generates an optimized SVG string.
     * If includeBorders is true, it draws individual rects with strokes instead of merged paths.
     */
    static toSVG(width: number, height: number, data: Uint32Array, bgColor?: string | 'transparent', includeBorders?: boolean): string;
    /**
     * Renders the pixel data to a data URL.
     */
    static toRaster(width: number, height: number, data: Uint32Array, scale: number, format?: 'png' | 'jpg' | 'webp', bgColor?: string | 'transparent', includeBorders?: boolean): Promise<string>;
    /**
     * Generates an Animated SVG.
     */
    static toAnimatedSVG(width: number, height: number, framesData: Uint32Array[], frameDurations: number[], bgColor?: string | 'transparent', includeBorders?: boolean): string;
    /**
     * Renders a sequence of frames to a video Blob.
     * Phase 1 of The Chronos Protocol: Deterministic Frame Assembly.
     */
    static toVideo(width: number, height: number, framesData: Uint32Array[], frameDurations: number[], scale: number, format?: 'webm' | 'mp4', bgColor?: string | 'transparent', includeBorders?: boolean): Promise<Blob>;
    /**
     * Generates a GIF.
     * Phase 2 of The Chronos Protocol: Accumulated Error Correction.
     */
    static toGIF(width: number, height: number, framesData: Uint32Array[], frameDurations: number[], scale: number, bgColor?: string | 'transparent', includeBorders?: boolean): Promise<Blob>;
    /**
     * Simple color quantizer for GIF.
     */
    private static quantizeFrame;
}
