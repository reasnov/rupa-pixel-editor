import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { PixelLogic } from '../../logic/pixel.js';
import { Geometry } from '../../logic/geometry.js';

/**
 * MovementService: Handles cursor navigation and coordinate translations.
 */
export class MovementService {
	/**
	 * Move the cursor by a delta.
	 */
	move(dx: number, dy: number): boolean {
		let newX = editor.cursor.pos.x + dx;
		let newY = editor.cursor.pos.y + dy;

		if (editor.studio.isTilingEnabled) {
			const wrapped = PixelLogic.wrap(newX, newY, editor.canvas.width, editor.canvas.height);
			newX = wrapped.x;
			newY = wrapped.y;
		} else {
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
	internalToCartesian(x: number, y: number, width: number, height: number) {
		return Geometry.internalToCartesian(x, y, width, height);
	}

	/**
	 * Translates Artisan Cartesian coordinates back to internal array indices.
	 */
	cartesianToInternal(tx: number, ty: number, width: number, height: number) {
		return Geometry.cartesianToInternal(tx, ty, width, height);
	}

	/**
	 * Jump the cursor to a specific Cartesian coordinate.
	 */
	jumpTo(tx: number, ty: number) {
		const { x, y } = Geometry.cartesianToInternal(
			tx,
			ty,
			editor.canvas.width,
			editor.canvas.height
		);
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
