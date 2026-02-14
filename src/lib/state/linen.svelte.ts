import { type ColorHex } from '../types/index.js';
import type { ProjectState } from './project.svelte.js';

/**
 * LinenState (Adapter):
 * Acts as a proxy to the active Frame and manages the temporary stitch buffer.
 */
export class LinenState {
	private project: ProjectState;

	// --- Batch Stitch Buffer (Reactive) ---
	stitchBuffer = $state<number[]>([]);
	strokePoints = $state<Array<{ x: number; y: number }>>([]);
	private internalBuffer = new Set<number>();

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

	// --- Proxies to Active Veil ---

	get stitches() {
		return this.project.activeFrame.activeVeil.stitches;
	}

	get compositeStitches() {
		return this.project.activeFrame.compositeStitches;
	}

	set stitches(v: (ColorHex | null)[]) {
		this.project.activeFrame.activeVeil.stitches = v;
	}

	// --- Buffer Management ---

	clearBuffer() {
		this.internalBuffer.clear();
		this.stitchBuffer = [];
		this.strokePoints = [];
	}

	/**
	 * Optimized batch update to prevent main-thread freeze during fast movement.
	 */
	addBatchToBuffer(points: Array<{ x: number; y: number }>) {
		const newStrokePoints = [...this.strokePoints];

		points.forEach((p) => {
			const px = Math.floor(p.x);
			const py = Math.floor(p.y);

			if (this.isValidCoord(px, py)) {
				this.internalBuffer.add(this.getIndex(px, py));
				newStrokePoints.push({ x: p.x, y: p.y });
			}
		});

		// Trigger re-assignment only ONCE per batch
		this.strokePoints = newStrokePoints;
		this.stitchBuffer = Array.from(this.internalBuffer);
	}

	addToBuffer(x: number, y: number) {
		this.addBatchToBuffer([{ x, y }]);
	}

	// --- Utilities ---

	reset(width: number, height: number, stitches: (ColorHex | null)[]) {
		this.width = width;
		this.height = height;
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
