import type { ProjectState } from './project.svelte.js';
/**
 * CanvasState (Adapter):
 * Acts as a proxy to the active Frame and manages the temporary pixel buffer.
 */
export declare class CanvasState {
    private project;
    renderPulse: number;
    triggerPulse(): void;
    pixelBuffer: number[];
    strokePoints: {
        x: number;
        y: number;
    }[];
    private internalBuffer;
    constructor(project: ProjectState);
    mount(): void;
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    get pixels(): Uint32Array;
    get compositePixels(): Uint32Array<ArrayBuffer>;
    set pixels(v: Uint32Array);
    clearBuffer(): void;
    /**
     * Optimized batch update to prevent main-thread freeze during fast movement.
     */
    addBatchToBuffer(points: Array<{
        x: number;
        y: number;
    }>): void;
    addToBuffer(x: number, y: number): void;
    reset(width: number, height: number, pixels: Uint32Array): void;
    clear(): void;
    getIndex(x: number, y: number): number;
    getColor(x: number, y: number): number;
    setColor(x: number, y: number, colorVal: number): void;
    isValidCoord(x: number, y: number): boolean;
    fitWidth: string;
    fitHeight: string;
    /**
     * Calculates the effective dimension of the canvas within the viewport
     * for a specific orientation, matching the aspect-ratio fitting.
     */
    getFitDimension(orientation: 'horizontal' | 'vertical'): string;
}
