import { type ColorHex } from '../types/index.js';
import { FrameState } from './frame.svelte.js';

/**
 * ProjectState (The Folio): Manages metadata, clipboard data, and the collection of Frames.
 */
export class ProjectState {
	currentFilePath = $state<string | null>(null);
	lastSaved = $state<Date | null>(null);

	// Folio Structure
	frames = $state<FrameState[]>([]);
	activeFrameIndex = $state(0);
	isPlaying = $state(false);

	clipboard = $state<{ width: number; height: number; data: (ColorHex | null)[] } | null>(null);

	constructor() {
		// Initialize with one default frame
		this.frames = [new FrameState('Main Motif')];
	}

	get activeFrame() {
		return this.frames[this.activeFrameIndex];
	}

	addFrame(name?: string) {
		const newName = name || `Frame ${this.frames.length + 1}`;
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
