import { FrameState } from './frame.svelte.js';
export interface FrameTag {
    id: string;
    name: string;
    color: string;
    from: number;
    to: number;
}
/**
 * ProjectState: Manages metadata, clipboard data, and the collection of Frames.
 */
export declare class ProjectState {
    currentFilePath: string | null;
    lastSaved: Date | null;
    frames: FrameState[];
    tags: FrameTag[];
    activeFrameIndex: number;
    selectedFrameIndices: Set<number>;
    isPlaying: boolean;
    clipboard: {
        width: number;
        height: number;
        data: Uint32Array;
    } | null;
    constructor();
    get activeFrame(): FrameState;
    addFrame(name?: string): FrameState;
    removeFrame(index: number): void;
    setMetadata(path?: string | null): void;
}
