/**
 * ProjectService: Manages Frames and Layers.
 * Handles addition, removal, and navigation within the Project hierarchy.
 */
export declare class ProjectService {
    addFrame(name?: string): import("../../state/frame.svelte.ts").FrameState;
    removeFrame(index: number): void;
    duplicateFrame(index: number): void;
    nextFrame(): void;
    prevFrame(): void;
    addLayer(name?: string): import("../../state/layer.svelte.ts").LayerState;
    addGroup(name?: string): import("../../state/layer.svelte.ts").LayerState;
    removeLayer(index: number): void;
    duplicateLayer(index: number): void;
    nextLayer(): void;
    prevLayer(): void;
    toggleLock(index?: number): void;
    toggleVisibility(index?: number): void;
    reorderLayer(fromIndex: number, toIndex: number): void;
    reorderFrame(fromIndex: number, toIndex: number): void;
    moveLayerUp(): void;
    moveLayerDown(): void;
    moveLayerToTop(): void;
    moveLayerToBottom(): void;
    /**
     * Merge Layer Down: Combines the active layer with the one directly below it.
     */
    mergeLayerDown(): void;
    addTag(name: string, from: number, to: number, color?: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        color: string;
        from: number;
        to: number;
    };
    removeTag(id: string): void;
}
