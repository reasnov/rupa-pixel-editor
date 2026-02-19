/**
 * LayerState: Represents a single layer of the digital frame.
 * It holds the actual pixel data and visibility properties.
 */
export declare class LayerState {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    isVisible: boolean;
    isLocked: boolean;
    opacity: number;
    isLinked: boolean;
    wiggleAmount: number;
    swayAmount: number;
    swaySpeed: number;
    pulseAmount: number;
    pulseSpeed: number;
    type: "LAYER" | "FOLDER";
    parentId: string | null;
    isCollapsed: boolean;
    pixels: Uint32Array<ArrayBufferLike>;
    hasContent: boolean;
    constructor(name: string, width: number, height: number, type?: 'LAYER' | 'FOLDER');
    clone(width: number, height: number): LayerState;
    clear(): void;
    hasPixel(index: number): boolean;
}
