import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';

/**
 * MovementService: Handles needle navigation and coordinate translations.
 */
export class MovementService {
	/**
	 * Move the needle by a delta.
	 */
	move(dx: number, dy: number): boolean {
		const newX = Math.max(0, Math.min(atelier.linen.width - 1, atelier.needle.pos.x + dx));
		const newY = Math.max(0, Math.min(atelier.linen.height - 1, atelier.needle.pos.y + dy));

		if (newX !== atelier.needle.pos.x || newY !== atelier.needle.pos.y) {
			atelier.needle.setPos(newX, newY);
			sfx.playMove();
			return true;
		}
		return false;
	}

	/**
	 * Translates internal array coordinates to Artisan Cartesian coordinates.
	 */
	internalToCartesian(x: number, y: number, width: number, height: number) {
		const calc = (pos: number, size: number) => {
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
	cartesianToInternal(tx: number, ty: number, width: number, height: number) {
		const midX = Math.floor(width / 2);
		const midY = Math.floor(height / 2);

		let ix, iy;

		// X Conversion
		if (width % 2 === 0) {
			ix = tx < 0 ? tx + midX : tx + midX - 1;
		} else {
			ix = tx + midX;
		}

		// Y Conversion (Y is inverted in display)
		const dispY = -ty;
		if (height % 2 === 0) {
			iy = dispY < 0 ? dispY + midY : dispY + midY - 1;
		} else {
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
	jumpTo(tx: number, ty: number) {
		const { x, y } = this.cartesianToInternal(tx, ty, atelier.linen.width, atelier.linen.height);
		atelier.needle.setPos(x, y);
	}

	/**
	 * Reset the needle to the absolute center.
	 */
	jumpHome() {
		const cx = Math.floor(atelier.linen.width / 2);
		const cy = Math.floor(atelier.linen.height / 2);
		atelier.needle.setPos(cx, cy);
		sfx.playMove();
	}
}
