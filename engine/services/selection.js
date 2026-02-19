import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';
import { ColorLogic } from '../../logic/color.js';
import { PixelLogic } from '../../logic/pixel.js';
/**
 * SelectionService: Handles the logic for defining selection regions
 * and performing mass manipulation on those regions (Batch Fill).
 */
export class SelectionService {
    begin(x, y) {
        editor.selection.begin(x, y);
    }
    update(x, y) {
        if (editor.selection.isActive) {
            editor.selection.update(x, y);
        }
    }
    clear() {
        editor.selection.clear();
    }
    /**
     * Batch Fill: Fills the entire active selection with the active color.
     */
    fillSelection() {
        const points = editor.selection.getPoints(editor.canvas.width);
        if (points.length === 0)
            return;
        const activeColor = editor.paletteState.activeColor;
        const activeVal = ColorLogic.hexToUint32(activeColor);
        const width = editor.canvas.width;
        history.beginBatch();
        let changed = false;
        const currentPixels = new Uint32Array(editor.canvas.pixels);
        points.forEach((p) => {
            const index = p.y * width + p.x;
            const oldVal = currentPixels[index];
            if (oldVal !== activeVal) {
                history.push({
                    index,
                    oldColor: ColorLogic.uint32ToHex(oldVal),
                    newColor: activeColor
                });
                currentPixels[index] = activeVal;
                changed = true;
            }
        });
        if (changed) {
            editor.canvas.pixels = currentPixels;
            editor.canvas.triggerPulse();
            sfx.playDraw();
        }
        history.endBatch();
    }
    commit() {
        // Just a visual sync for mouse drag-to-select
        editor.canvas.triggerPulse();
    }
    /**
     * Magic Wand: Selects all connected pixels of the same color.
     * Uses scanline fill for performance.
     */
    spiritPick() {
        const { x, y } = editor.cursor.pos;
        const targetVal = editor.canvas.getColor(x, y);
        const { width, height, pixels } = editor.canvas;
        // Use floodFill to find connected region
        const markerVal = 0xffffffff; // temporary marker
        const filled = PixelLogic.floodFill(Array.from(pixels), width, height, x, y, markerVal);
        const indices = [];
        for (let i = 0; i < filled.length; i++) {
            if (filled[i] === markerVal)
                indices.push(i);
        }
        editor.selection.clear();
        if (indices.length > 0) {
            editor.selection.indices = indices;
            editor.canvas.triggerPulse();
            sfx.playScale(4); // Play a specific harmonic note
        }
    }
    /**
     * Polygon Selection: Add a vertex to the current polygon selection.
     */
    addVertex(x, y) {
        editor.selection.vertices.push({ x, y });
        sfx.playDraw();
    }
    /**
     * Seal the Polygon: Convert the polygon vertices into a pixel selection.
     */
    sealBinding() {
        const vertices = editor.selection.vertices;
        if (vertices.length < 3)
            return;
        const width = editor.canvas.width;
        const height = editor.canvas.height;
        const indices = [];
        // Ray casting algorithm for point-in-polygon
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this.isPointInPoly(x, y, vertices)) {
                    indices.push(y * width + x);
                }
            }
        }
        if (indices.length > 0) {
            editor.selection.indices = indices;
            editor.selection.vertices = [];
            sfx.playScale(6);
        }
    }
    isPointInPoly(px, py, poly) {
        let isInside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i].x, yi = poly[i].y;
            const xj = poly[j].x, yj = poly[j].y;
            const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
            if (intersect)
                isInside = !isInside;
        }
        return isInside;
    }
    /**
     * Nudge Selection: Moves the selected pixels by a delta.
     */
    nudge(dx, dy) {
        if (editor.selection.indices.length === 0)
            return;
        const width = editor.canvas.width;
        const height = editor.canvas.height;
        const currentPixels = new Uint32Array(editor.canvas.pixels);
        // 1. Capture current values and clear them from canvas
        const movedData = new Map();
        editor.selection.indices.forEach((idx) => {
            movedData.set(idx, currentPixels[idx]);
            currentPixels[idx] = 0;
        });
        // 2. Calculate new positions
        const newIndices = [];
        movedData.forEach((val, idx) => {
            const x = idx % width;
            const y = Math.floor(idx / width);
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                currentPixels[nIdx] = val;
                newIndices.push(nIdx);
            }
        });
        // 3. Update state
        editor.canvas.pixels = currentPixels;
        editor.canvas.triggerPulse();
        editor.selection.indices = newIndices;
        sfx.playMove();
    }
    /**
     * Syrup Flow (Selection Propagation):
     * Projects the current selection across next N frames with a linear offset.
     */
    propagate(frameCount, deltaX, deltaY) {
        if (editor.selection.indices.length === 0)
            return;
        const project = editor.project;
        const startFrameIdx = project.activeFrameIndex;
        const activeLayerIdx = project.activeFrame.activeLayerIndex;
        const width = editor.canvas.width;
        const height = editor.canvas.height;
        // 1. Capture selection data and affected layers
        const sourceLayer = project.activeFrame.activeLayer;
        const selectionData = [];
        editor.selection.indices.forEach((idx) => {
            selectionData.push({
                x: idx % width,
                y: Math.floor(idx / width),
                val: sourceLayer.pixels[idx]
            });
        });
        const oldPixelStates = new Map();
        const newPixelStates = new Map();
        for (let i = 1; i <= frameCount; i++) {
            const targetFrameIdx = startFrameIdx + i;
            if (targetFrameIdx >= project.frames.length)
                break;
            const targetLayer = project.frames[targetFrameIdx].layers[activeLayerIdx];
            if (!targetLayer || targetLayer.isLocked)
                continue;
            // Store old state
            oldPixelStates.set(targetFrameIdx, new Uint32Array(targetLayer.pixels));
            // Calculate new state
            const nextPixels = new Uint32Array(targetLayer.pixels);
            const offsetX = deltaX * i;
            const offsetY = deltaY * i;
            selectionData.forEach((item) => {
                const nx = item.x + offsetX;
                const ny = item.y + offsetY;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    nextPixels[ny * width + nx] = item.val;
                }
            });
            newPixelStates.set(targetFrameIdx, nextPixels);
        }
        const applyStates = (states) => {
            states.forEach((pixels, frameIdx) => {
                const layer = project.frames[frameIdx].layers[activeLayerIdx];
                if (layer)
                    layer.pixels = pixels;
            });
            editor.canvas.triggerPulse();
        };
        // Apply forward
        applyStates(newPixelStates);
        history.push({
            isStructural: true,
            label: 'Syrup Flow',
            undo: () => applyStates(oldPixelStates),
            redo: () => applyStates(newPixelStates)
        });
        sfx.playDraw();
        editor.studio.show(`Poured across ${newPixelStates.size} cups`);
    }
}
