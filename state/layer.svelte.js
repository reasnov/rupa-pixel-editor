import {} from '../types/index.js';
/**
 * LayerState: Represents a single layer of the digital frame.
 * It holds the actual pixel data and visibility properties.
 */
export class LayerState {
    id = crypto.randomUUID();
    name = $state('New Layer');
    isVisible = $state(true);
    isLocked = $state(false);
    opacity = $state(1.0); // 0.0 to 1.0 (Density)
    isLinked = $state(false); // Steeped Layers (Linked Cells)
    // Aroma Pulse (Procedural Modifiers)
    wiggleAmount = $state(0); // 0 to 10 pixels
    swayAmount = $state(0); // 0 to 50 pixels
    swaySpeed = $state(1.0);
    pulseAmount = $state(0); // 0 to 1.0 opacity depth
    pulseSpeed = $state(1.0);
    // --- Folder System (v0.8.0 Archive) ---
    type = $state('LAYER');
    parentId = $state(null);
    isCollapsed = $state(false);
    // The actual pixel data for this layer (ABGR Uint32)
    pixels = $state.raw(new Uint32Array(0));
    hasContent = $derived.by(() => {
        if (this.type === 'FOLDER')
            return false;
        for (let i = 0; i < this.pixels.length; i++) {
            if (this.pixels[i] !== 0)
                return true;
        }
        return false;
    });
    constructor(name, width, height, type = 'LAYER') {
        this.name = name;
        this.type = type;
        if (type === 'LAYER') {
            this.pixels = new Uint32Array(width * height);
        }
    }
    clone(width, height) {
        const newLayer = new LayerState(this.name, width, height, this.type);
        newLayer.pixels = this.type === 'LAYER' ? new Uint32Array(this.pixels) : new Uint32Array(0);
        newLayer.isVisible = this.isVisible;
        newLayer.isLocked = this.isLocked;
        newLayer.opacity = this.opacity;
        newLayer.parentId = this.parentId;
        newLayer.isCollapsed = this.isCollapsed;
        return newLayer;
    }
    clear() {
        const newPixels = new Uint32Array(this.pixels.length);
        newPixels.fill(0);
        this.pixels = newPixels;
    }
    // Helper to check if a pixel exists at an index
    hasPixel(index) {
        return this.pixels[index] !== 0;
    }
}
