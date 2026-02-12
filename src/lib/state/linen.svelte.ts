import { type ColorHex } from '../types/index.js';
import type { ProjectState } from './project.svelte.js';

/**
 * LinenState (Adapter):
 * Formerly the source of truth for the grid, this class now acts as a
 * compatibility proxy (adapter) to the active Frame and Veil in the ProjectState.
 * This ensures the rest of the application (Renderer, Engine) continues to work
 * while we transition to the Multi-Layer architecture.
 */
export class LinenState {
	private project: ProjectState;

	constructor(project: ProjectState) {
		this.project = project;
	}

	// --- Proxies to Active Frame ---

	get width() {
		return this.project.activeFrame.width;
	}
	set width(v: number) {
		this.project.activeFrame.width = v;
	}

	get height() {
		return this.project.activeFrame.height;
	}
	set height(v: number) {
		this.project.activeFrame.height = v;
	}

	// --- Proxies to Active Veil (The actual pixel data) ---

	get stitches() {
		return this.project.activeFrame.activeVeil.stitches;
	}

	get compositeStitches() {
		return this.project.activeFrame.compositeStitches;
	}
	
	set stitches(v: (ColorHex | null)[]) {
		// When legacy code tries to replace the whole array, update the active layer
		this.project.activeFrame.activeVeil.stitches = v;
	}

	// --- Methods ---

	reset(width: number, height: number, stitches: (ColorHex | null)[]) {
		// Update Frame Dimensions
		this.width = width;
		this.height = height;
		// Update Active Veil Data
		this.stitches = stitches;
	}

	clear() {
		this.project.activeFrame.activeVeil.clear();
	}

	getIndex(x: number, y: number): number {
		return y * this.width + x;
	}

	getColor(x: number, y: number): ColorHex | null {
		return this.stitches[this.getIndex(x, y)];
	}

	setColor(x: number, y: number, color: ColorHex | null) {
		this.stitches[this.getIndex(x, y)] = color;
	}

	isValidCoord(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}
}
