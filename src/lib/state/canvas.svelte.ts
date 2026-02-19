import { type ColorHex } from '../types/index.js';
import type { ProjectState } from './project.svelte.js';

/**
 * CanvasState (Adapter):
 * Acts as a proxy to the active Frame and manages the temporary pixel buffer.
 */
export class CanvasState {
	private project: ProjectState;

	// --- The Pulse (v0.8.0) ---
	// Incremented to signal the UI to refresh without deep-diffing pixels.
	renderPulse = $state(0);

	triggerPulse() {
		this.renderPulse++;
	}

	// --- Batch Pixel Buffer (Reactive) ---
	pixelBuffer = $state<number[]>([]);
	strokePoints = $state<Array<{ x: number; y: number }>>([]);
	private internalBuffer = new Set<number>();

	constructor(project: ProjectState) {
		this.project = project;
	}

	mount() {
		// Automatically trigger pulse when the visual source changes
		// Only runs on the client
		$effect(() => {
			// Accessing these values makes the effect reactive to them
			const _p = this.compositePixels;
			const _f = this.project.activeFrameIndex;
			const _l = this.project.activeFrame.activeLayerIndex;
			this.triggerPulse();
		});
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

	// --- Proxies to Active Layer ---

	get pixels() {
		return this.project.activeFrame.activeLayer.pixels;
	}

	get compositePixels() {
		return this.project.activeFrame.compositePixels;
	}

	set pixels(v: Uint32Array) {
		const frame = this.project.activeFrame;
		const layerIndex = frame.activeLayerIndex;
		const layer = frame.activeLayer;

		layer.pixels = v;

		// Steeped Layers (Linked Cells) Logic
		if (layer.isLinked) {
			this.project.frames.forEach((f, idx) => {
				if (idx !== this.project.activeFrameIndex) {
					const targetLayer = f.layers[layerIndex];
					if (targetLayer) {
						targetLayer.pixels = v;
					}
				}
			});
		}
	}

	// --- Buffer Management ---

	clearBuffer() {
		this.internalBuffer.clear();
		this.pixelBuffer = [];
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
		this.pixelBuffer = Array.from(this.internalBuffer);
	}

	addToBuffer(x: number, y: number) {
		this.addBatchToBuffer([{ x, y }]);
	}

	// --- Utilities ---

	reset(width: number, height: number, pixels: Uint32Array) {
		this.width = width;
		this.height = height;
		this.pixels = pixels;
		this.triggerPulse();
	}

	clear() {
		this.project.activeFrame.activeLayer.clear();
		this.triggerPulse();
	}

	getIndex(x: number, y: number): number {
		return y * this.width + x;
	}

	getColor(x: number, y: number): number {
		// Layer agnostic picking: use composite pixels
		return this.compositePixels[this.getIndex(x, y)];
	}

	setColor(x: number, y: number, colorVal: number) {
		this.pixels[this.getIndex(x, y)] = colorVal;
	}

	isValidCoord(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	// --- Viewport Fitting (Derived) ---

	fitWidth = $derived(`calc((100cqi - 20px) * ${this.width} / (${this.width} + 2))`);
	fitHeight = $derived(`calc((100cqb - 20px) * ${this.height} / (${this.height} + 2))`);

	/**
	 * Calculates the effective dimension of the canvas within the viewport
	 * for a specific orientation, matching the aspect-ratio fitting.
	 */
	getFitDimension(orientation: 'horizontal' | 'vertical'): string {
		const w = this.width;
		const h = this.height;
		return orientation === 'horizontal'
			? `min(${this.fitWidth}, calc(${this.fitHeight} * (${w} / ${h})))`
			: `min(${this.fitHeight}, calc(${this.fitWidth} * (${h} / ${w})))`;
	}
}
