import { type ColorHex } from '../types/index.js';
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
export class ProjectState {
	currentFilePath = $state<string | null>(null);
	lastSaved = $state<Date | null>(null);

	// Project Structure (Global Dimensions)
	width = $state(32);
	height = $state(32);
	frames = $state<FrameState[]>([]);
	tags = $state<FrameTag[]>([]);
	activeFrameIndex = $state(0);
	selectedFrameIndices = $state<Set<number>>(new Set([0]));
	isPlaying = $state(false);
	fps = $state(10);

	clipboard = $state<{ width: number; height: number; data: Uint32Array } | null>(null);

	constructor() {
		// Initialize with one default frame
		this.frames = [new FrameState('Main Art', this)];
	}

	get activeFrame() {
		return this.frames[this.activeFrameIndex];
	}

	addFrame(name?: string) {
		const newName = name || `Frame ${this.frames.length + 1}`;
		const frame = new FrameState(newName, this);
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
