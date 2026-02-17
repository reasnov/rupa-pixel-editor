import { type ColorHex } from '../types/index.js';
import { FrameState } from './frame.svelte.js';

/**
 * ProjectState (The Recipe Book): Manages metadata, clipboard data, and the collection of Frames (Cups).
 */
export class ProjectState {
	currentFilePath = $state<string | null>(null);
	lastSaved = $state<Date | null>(null);

	// Recipe Book Structure
	frames = $state<FrameState[]>([]);
	activeFrameIndex = $state(0);
	isPlaying = $state(false);

	clipboard = $state<{ width: number; height: number; data: (ColorHex | null)[] } | null>(null);

	constructor() {
		// Initialize with one default frame
		this.frames = [new FrameState('Main Art')];
	}

	get activeFrame() {
		return this.frames[this.activeFrameIndex];
	}

	addFrame(name?: string) {
		const newName = name || `Cup ${this.frames.length + 1}`;
		const frame = new FrameState(newName);
		this.frames.push(frame);
		this.activeFrameIndex = this.frames.length - 1;
		return frame;
	}

	removeFrame(index: number) {
		if (this.frames.length <= 1) return; // Cannot delete the last frame
		this.frames.splice(index, 1);
		if (this.activeFrameIndex >= this.frames.length) {
			this.activeFrameIndex = this.frames.length - 1;
		}
	}

	setMetadata(path: string | null = null) {
		this.currentFilePath = path;
		this.lastSaved = new Date();
	}
}
