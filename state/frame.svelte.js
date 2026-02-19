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
    duration = $state(100); // Duration in ms (Default 100ms = 10 FPS)
    opacity = $state(1.0); // 0.0 to 1.0 (Global cup opacity)
    // The stack of layers. Order: [Background, ..., Foreground]
    layers = $state([]);
    activeLayerIndex = $state(0);
    selectedLayerIndices = $state(new Set([0]));
    constructor(name, width = 32, height = 32) {
        this.name = name;
        this.width = width;
        this.height = height;
        // Always start with one base layer
        this.layers = [new LayerState('Base Layer', width, height)];
    }
    get activeLayer() {
        return this.layers[this.activeLayerIndex];
    }
    addLayer(name) {
        const newName = name || `Layer ${this.layers.length + 1}`;
        const layer = new LayerState(newName, this.width, this.height);
        // If active layer is a folder or inside a folder, inherit parent
        const active = this.activeLayer;
        if (active.type === 'FOLDER') {
            layer.parentId = active.id;
        }
        else if (active.parentId) {
            layer.parentId = active.parentId;
        }
        this.layers.push(layer);
        this.activeLayerIndex = this.layers.length - 1; // Auto-focus new layer
        return layer;
    }
    addGroup(name) {
        const newName = name || `Group ${this.layers.length + 1}`;
        const group = new LayerState(newName, this.width, this.height, 'FOLDER');
        this.layers.push(group);
        this.activeLayerIndex = this.layers.length - 1;
        return group;
    }
    removeLayer(index) {
        if (this.layers.length <= 1)
            return; // Cannot delete the last layer
        const layerToRemove = this.layers[index];
        // If removing a folder, unparent its children
        if (layerToRemove.type === 'FOLDER') {
            this.layers.forEach((l) => {
                if (l.parentId === layerToRemove.id)
                    l.parentId = null;
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
        const time = animation.elapsedTime / 1000;
        // Cache folder visibility for performance
        const folderVisibility = new Map();
        this.layers.forEach((l) => {
            if (l.type === 'FOLDER')
                folderVisibility.set(l.id, l.isVisible);
        });
        // Render from bottom to top
        for (const layer of this.layers) {
            if (layer.type === 'FOLDER')
                continue; // Folders don't have pixels
            if (!layer.isVisible)
                continue;
            // If inside a hidden folder, don't render
            if (layer.parentId && folderVisibility.get(layer.parentId) === false)
                continue;
            // Apply Aroma Pulse Modifiers (Procedural)
            let offsetX = 0;
            let offsetY = 0;
            if (layer.swayAmount > 0) {
                offsetX += Math.sin(time * layer.swaySpeed * Math.PI) * layer.swayAmount;
            }
            if (layer.wiggleAmount > 0) {
                // Deterministic wiggle based on time
                offsetX += (Math.sin(time * 20) + Math.cos(time * 13)) * (layer.wiggleAmount / 2);
                offsetY += (Math.cos(time * 17) + Math.sin(time * 11)) * (layer.wiggleAmount / 2);
            }
            const pixels = layer.pixels;
            for (let i = 0; i < result.length; i++) {
                const pixel = pixels[i];
                if (pixel !== 0) {
                    // Apply translation if offsets exist
                    if (offsetX !== 0 || offsetY !== 0) {
                        const x = i % this.width;
                        const y = Math.floor(i / this.width);
                        const tx = Math.round(x + offsetX);
                        const ty = Math.round(y + offsetY);
                        if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
                            result[ty * this.width + tx] = pixel;
                        }
                    }
                    else {
                        result[i] = pixel;
                    }
                }
            }
        }
        return result;
    });
}
