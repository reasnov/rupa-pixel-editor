import { LayerState } from './layer.svelte.js';

/**
 * FrameState: Represents a single frame in the Project.
 * It manages dimensions and a stack of Layers.
 */
export class FrameState {
	id = crypto.randomUUID();
	name = $state('Untitled Frame');
	width = $state(32);
	height = $state(32);
	duration = $state(100); // Duration in ms (Default 100ms = 10 FPS)

	// The stack of layers. Order: [Background, ..., Foreground]
	layers = $state<LayerState[]>([]);
	activeLayerIndex = $state(0);
	selectedLayerIndices = $state<Set<number>>(new Set([0]));

	constructor(name: string, width = 32, height = 32) {
		this.name = name;
		this.width = width;
		this.height = height;
		// Always start with one base layer
		this.layers = [new LayerState('Base Layer', width, height)];
	}

	get activeLayer() {
		return this.layers[this.activeLayerIndex];
	}

	addLayer(name?: string) {
		const newName = name || `Layer ${this.layers.length + 1}`;
		const layer = new LayerState(newName, this.width, this.height);

		// If active layer is a folder or inside a folder, inherit parent
		const active = this.activeLayer;
		if (active.type === 'FOLDER') {
			layer.parentId = active.id;
		} else if (active.parentId) {
			layer.parentId = active.parentId;
		}

		this.layers.push(layer);
		this.activeLayerIndex = this.layers.length - 1; // Auto-focus new layer
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
		if (this.layers.length <= 1) return; // Cannot delete the last layer
		const layerToRemove = this.layers[index];

		// If removing a folder, unparent its children
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

	// Composite projection for rendering (flattening layers)
	compositePixels = $derived.by(() => {
		const result = new Uint32Array(this.width * this.height);

		// Cache folder visibility for performance
		const folderVisibility = new Map<string, boolean>();
		this.layers.forEach((l) => {
			if (l.type === 'FOLDER') folderVisibility.set(l.id, l.isVisible);
		});

		// Render from bottom to top
		for (const layer of this.layers) {
			if (layer.type === 'FOLDER') continue; // Folders don't have pixels
			if (!layer.isVisible) continue;

			// If inside a hidden folder, don't render
			if (layer.parentId && folderVisibility.get(layer.parentId) === false) continue;

			const pixels = layer.pixels;
			for (let i = 0; i < result.length; i++) {
				const pixel = pixels[i];
				if (pixel !== 0) {
					result[i] = pixel;
				}
			}
		}
		return result;
	});
}
