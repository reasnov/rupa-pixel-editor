import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { PixelLogic } from '../../logic/pixel.js';
/**
 * MovementService: Handles cursor navigation and coordinate translations.
 */
export class MovementService {
    /**
     * Move the cursor by a delta.
     */
    move(dx, dy) {
        let newX = editor.cursor.pos.x + dx;
        let newY = editor.cursor.pos.y + dy;
        if (editor.studio.isTilingEnabled) {
            const wrapped = PixelLogic.wrap(newX, newY, editor.canvas.width, editor.canvas.height);
            newX = wrapped.x;
            newY = wrapped.y;
        }
        else {
            newX = Math.max(0, Math.min(editor.canvas.width - 1, newX));
            newY = Math.max(0, Math.min(editor.canvas.height - 1, newY));
        }
        if (newX !== editor.cursor.pos.x || newY !== editor.cursor.pos.y) {
            editor.cursor.setPos(newX, newY);
            sfx.playMove();
            return true;
        }
        return false;
    }
    /**
     * Translates internal array coordinates to Artisan Cartesian coordinates.
     */
    internalToCartesian(x, y, width, height) {
        const calc = (pos, size) => {
            const mid = Math.floor(size / 2);
            return size % 2 === 0 ? (pos < mid ? pos - mid : pos - mid + 1) : pos - mid;
        };
        return {
            x: calc(x, width),
            y: -calc(y, height)
        };
    }
    /**
     * Translates Artisan Cartesian coordinates back to internal array indices.
     */
    cartesianToInternal(tx, ty, width, height) {
        const midX = Math.floor(width / 2);
        const midY = Math.floor(height / 2);
        let ix, iy;
        // X Conversion
        if (width % 2 === 0) {
            ix = tx < 0 ? tx + midX : tx + midX - 1;
        }
        else {
            ix = tx + midX;
        }
        // Y Conversion (Y is inverted in display)
        const dispY = -ty;
        if (height % 2 === 0) {
            iy = dispY < 0 ? dispY + midY : dispY + midY - 1;
        }
        else {
            iy = dispY + midY;
        }
        return {
            x: Math.max(0, Math.min(width - 1, ix)),
            y: Math.max(0, Math.min(height - 1, iy))
        };
    }
    /**
     * Jump the needle to a specific Cartesian coordinate.
     */
    jumpTo(tx, ty) {
        const { x, y } = this.cartesianToInternal(tx, ty, editor.canvas.width, editor.canvas.height);
        editor.cursor.setPos(x, y);
    }
    /**
     * Reset the cursor to the center (1,1).
     */
    jumpHome() {
        this.jumpTo(1, 1);
        sfx.playMove();
    }
}
