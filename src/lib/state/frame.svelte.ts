import { LayerState } from './layer.svelte.js';
import { animation } from '../engine/animation.svelte.js';

/**
 * FrameState: Represents a single frame in the Project.
 * It manages dimensions and a stack of Layers.
 */
export class FrameState {
	id = crypto.randomUUID();
	name = $state('Untitled Frame');
	width = $state(32);
	height = $state(32);
	opacity = $state(1.0);
	isVisible = $state(true);

	// The stack of layers. Order: [Background, ..., Foreground]
	layers = $state<LayerState[]>([]);
	activeLayerIndex = $state(0);
	selectedLayerIndices = $state<Set<number>>(new Set([0]));

	// Performance Cache (v0.9.3)
	private _cachedComposite = new Uint32Array(0);
	private _lastRenderVersion = -1;
	private _lastTimeKey = -1;

	constructor(name: string, width = 32, height = 32) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.layers = [new LayerState('Base Layer', width, height)];
	}

	get activeLayer() {
		return this.layers[this.activeLayerIndex];
	}

	/**
	 * Composite pixels for rendering (flattening layers).
	 * Optimized: Uses manual caching to avoid excessive $derived recalculations.
	 */
	get compositePixels() {
		// We access reactive properties to ensure Svelte tracks them,
		// but we still use the cache for the heavy pixel-pushing logic.
		const structuralKey = this.layers.map((l) => `${l.id}-${l.isVisible}-${l.parentId}`).join('|');
		const time = animation.elapsedTime / 1000;
		const timeKey = Math.floor(time * 60); // 60fps time key

		if (
			this._cachedComposite.length === this.width * this.height &&
			this._lastTimeKey === timeKey &&
			(this as any)._lastStructuralKey === structuralKey
		) {
			return this._cachedComposite;
		}

		(this as any)._lastStructuralKey = structuralKey;

		const result = new Uint32Array(this.width * this.height);
		const folderVisibility = new Map<string, boolean>();
		this.layers.forEach((l) => {
			if (l.type === 'FOLDER') folderVisibility.set(l.id, l.isVisible);
		});

		for (const layer of this.layers) {
			if (layer.type === 'FOLDER' || !layer.isVisible) continue;
			if (layer.parentId && folderVisibility.get(layer.parentId) === false) continue;

			let offsetX = 0;
			let offsetY = 0;

			if (layer.swayAmount > 0) {
				offsetX += Math.sin(time * layer.swaySpeed * Math.PI) * layer.swayAmount;
			}
			if (layer.wiggleAmount > 0) {
				offsetX += (Math.sin(time * 20) + Math.cos(time * 13)) * (layer.wiggleAmount / 2);
				offsetY += (Math.cos(time * 17) + Math.sin(time * 11)) * (layer.wiggleAmount / 2);
			}

			const pixels = layer.pixels;
			for (let i = 0; i < result.length; i++) {
				const pixel = pixels[i];
				if (pixel !== 0) {
					if (offsetX !== 0 || offsetY !== 0) {
						const x = i % this.width;
						const y = Math.floor(i / this.width);
						const tx = Math.round(x + offsetX);
						const ty = Math.round(y + offsetY);
						if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
							result[ty * this.width + tx] = pixel;
						}
					} else {
						result[i] = pixel;
					}
				}
			}
		}

		this._cachedComposite = result;
		this._lastTimeKey = timeKey;
		return result;
	}

	addLayer(name?: string) {
		const newName = name || `Layer ${this.layers.length + 1}`;
		const layer = new LayerState(newName, this.width, this.height);
		const active = this.activeLayer;
		if (active.type === 'FOLDER') layer.parentId = active.id;
		else if (active.parentId) layer.parentId = active.parentId;

		this.layers.push(layer);
		this.activeLayerIndex = this.layers.length - 1;
		return layer;
	}

	addGroup(name?: string) {
		const newName = name || `Group ${this.layers.length + 1}`;
		const group = new LayerState(newName, this.width, this.height, 'FOLDER');
		this.layers.push(group);
		this.activeLayerIndex = this.layers.length - 1;
		return group;
	}

	removeLayer(index: number) {
		if (this.layers.length <= 1) return;
		const layerToRemove = this.layers[index];
		if (layerToRemove.type === 'FOLDER') {
			this.layers.forEach((l) => {
				if (l.parentId === layerToRemove.id) l.parentId = null;
			});
		}
		this.layers.splice(index, 1);
		if (this.activeLayerIndex >= this.layers.length) {
			this.activeLayerIndex = this.layers.length - 1;
		}
	}
}
