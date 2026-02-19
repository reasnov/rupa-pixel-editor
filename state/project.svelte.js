import {} from '../types/index.js';
import { FrameState } from './frame.svelte.js';
/**
 * ProjectState: Manages metadata, clipboard data, and the collection of Frames.
 */
export class ProjectState {
    currentFilePath = $state(null);
    lastSaved = $state(null);
    // Project Structure
    frames = $state([]);
    tags = $state([]);
    activeFrameIndex = $state(0);
    selectedFrameIndices = $state(new Set([0]));
    isPlaying = $state(false);
    clipboard = $state(null);
    constructor() {
        // Initialize with one default frame
        this.frames = [new FrameState('Main Art')];
    }
    get activeFrame() {
        return this.frames[this.activeFrameIndex];
    }
    addFrame(name) {
        const newName = name || `Frame ${this.frames.length + 1}`;
        const frame = new FrameState(newName);
        this.frames.push(frame);
        this.activeFrameIndex = this.frames.length - 1;
        return frame;
    }
    removeFrame(index) {
        if (this.frames.length <= 1)
            return; // Cannot delete the last frame
        this.frames.splice(index, 1);
        if (this.activeFrameIndex >= this.frames.length) {
            this.activeFrameIndex = this.frames.length - 1;
        }
    }
    setMetadata(path = null) {
        this.currentFilePath = path;
        this.lastSaved = new Date();
    }
}
