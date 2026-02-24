import { type ColorHex } from '../types/index.js';
import type { ProjectState } from './project.svelte.js';

/**
 * CanvasState (Adapter):
 * Acts as a proxy to the active Frame and manages the temporary pixel buffer.
 * Part of the reactive State Layer.
 */
export class CanvasState {
	private project: ProjectState;

	// --- Versioning Signal ---
	// Incremented to signal the UI to refresh without deep-diffing pixels.
	version = $state(0);

	incrementVersion() {
		this.version++;
	}

	// --- Batch Pixel Buffer (Reactive) ---
	pixelBuffer = $state<number[]>([]);
	strokePoints = $state<Array<{ x: number; y: number }>>([]);
	private internalBuffer = new Set<number>();

	constructor(project: ProjectState) {
		this.project = project;
	}

	mount() {
		// Automatically trigger version bump when visual source changes
		$effect(() => {
			const _p = this.compositePixels;
			const _f = this.project.activeFrameIndex;
			const _l = this.project.activeFrame.activeLayerIndex;
			this.incrementVersion();
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

		// Linked Layers Logic: Sync pixels across frames if layer is linked
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
		this.incrementVersion();
	}

	clear() {
		this.project.activeFrame.activeLayer.clear();
		this.incrementVersion();
	}

	getIndex(x: number, y: number): number {
		return y * this.width + x;
	}

	getColor(x: number, y: number): number {
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

	getFitDimension(orientation: 'horizontal' | 'vertical'): string {
		const w = this.width;
		const h = this.height;
		return orientation === 'horizontal'
			? `min(${this.fitWidth}, calc(${this.fitHeight} * (${w} / ${h})))`
			: `min(${this.fitHeight}, calc(${this.fitWidth} * (${h} / ${w})))`;
	}
}
