import { LayerState } from './layer.svelte.js';
/**
 * FrameState: Represents a single frame in the Project.
 * It manages dimensions and a stack of Layers.
 */
export declare class FrameState {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    width: number;
    height: number;
    duration: number;
    opacity: number;
    layers: LayerState[];
    activeLayerIndex: number;
    selectedLayerIndices: Set<number>;
    constructor(name: string, width?: number, height?: number);
    get activeLayer(): LayerState;
    addLayer(name?: string): LayerState;
    addGroup(name?: string): LayerState;
    removeLayer(index: number): void;
    compositePixels: Uint32Array<ArrayBuffer>;
}
