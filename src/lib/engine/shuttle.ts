import { MovementService } from './services/movement.js';
import { StitchService } from './services/stitch.js';
import { ManipulationService } from './services/manipulation.js';
import { ClipboardService } from './services/clipboard.js';
import { PersistenceService } from './services/persistence.js';
import { atelier } from '../state/atelier.svelte.js';

/**
 * ShuttleEngine: The unified service coordinator for atelier operations.
 * It provides a clean API for the UI/Loom while delegating to specialized services.
 */
export class ShuttleEngine {
    readonly movement = new MovementService();
    readonly stitching = new StitchService();
    readonly manipulation = new ManipulationService();
    readonly clipboard = new ClipboardService();
    readonly persistence = new PersistenceService();

    // --- Aliases for Backward Compatibility ---

    moveNeedle(dx: number, dy: number) { return this.movement.move(dx, dy); }
    
    stitch() { this.stitching.stitch(); }
    unstitch() { this.stitching.unstitch(); }
    pickDye() { this.stitching.pickDye(); }

    startSelection() { atelier.selection.begin(atelier.needle.pos.x, atelier.needle.pos.y); }
    updateSelection() { atelier.selection.update(atelier.needle.pos.x, atelier.needle.pos.y); }
    commitSelection() {
        const bounds = atelier.selection.bounds;
        if (!bounds) return;
        
        const { x1, x2, y1, y2 } = bounds;
        const activeDye = atelier.paletteState.activeDye;

        history.beginBatch();
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                const index = atelier.linen.getIndex(x, y);
                const oldColor = atelier.linen.stitches[index];
                if (oldColor !== activeDye) {
                    history.push({ index, oldColor, newColor: activeDye });
                    atelier.linen.setColor(x, y, activeDye);
                }
            }
        }
        history.endBatch();
        sfx.playStitch();
    }

    clearLinen() { this.manipulation.clearAll(); }
    resizeLinen(w: number, h: number) { this.manipulation.resize(w, h); }
    flipLinen(axis: 'horizontal' | 'vertical') { this.manipulation.flip(axis); }
    rotateLinen() { this.manipulation.rotate(); }

    copy() { this.clipboard.copy(); }
    cut() { this.clipboard.cut(); }
    paste() { 
        this.clipboard.paste(); 
        atelier.selection.clear();
    }

    save() { this.persistence.save(); }
    load() { this.persistence.load(); }
    backup() { this.persistence.backup(); }
}

export const shuttle = new ShuttleEngine();
