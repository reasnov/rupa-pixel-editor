import { atelier } from '../state/atelier.svelte.js';
import { shuttle } from './shuttle.js';
import { stance } from './stance.svelte.js';

/**
 * ShuttlePointEngine: Manages fluid pointer interactions (Mouse/Touch).
 * It translates screen-space movements into digital stitching intents.
 */
export class ShuttlePointEngine {
	private isPointerDown = false;
	private lastPosition = { x: -1, y: -1 };
	private buttonType: 'primary' | 'secondary' | null = null;

	/**
	 * Map screen coordinates to Linen grid coordinates.
	 * @param clientX Screen X
	 * @param clientY Screen Y
	 * @param linenElement The DOM element of the Linen grid
	 */
	mapToGrid(clientX: number, clientY: number, linenElement: HTMLElement) {
		const rect = linenElement.getBoundingClientRect();
		const { width, height } = atelier.linen;

		// Calculate relative percentage within the element
		const xPct = (clientX - rect.left) / rect.width;
		const yPct = (clientY - rect.top) / rect.height;

		// Convert to grid integer coordinates
		const gx = Math.floor(xPct * width);
		const gy = Math.floor(yPct * height);

		// Clamp to grid boundaries
		return {
			x: Math.max(0, Math.min(width - 1, gx)),
			y: Math.max(0, Math.min(height - 1, gy))
		};
	}

	/**
	 * Handle pointer start (mousedown/touchstart)
	 */
	handleStart(e: PointerEvent, linenElement: HTMLElement) {
		this.isPointerDown = true;
		this.buttonType = e.button === 2 ? 'secondary' : 'primary';

		const pos = this.mapToGrid(e.clientX, e.clientY, linenElement);
		this.executeAt(pos.x, pos.y);
	}

	/**
	 * Handle pointer movement (mousemove/touchmove)
	 */
	handleMove(e: PointerEvent, linenElement: HTMLElement) {
		if (!this.isPointerDown) return;

		const pos = this.mapToGrid(e.clientX, e.clientY, linenElement);

		// Only trigger if we've moved to a new pixel to avoid redundant operations
		if (pos.x !== this.lastPosition.x || pos.y !== this.lastPosition.y) {
			this.executeAt(pos.x, pos.y);
		}
	}

	/**
	 * Handle pointer end (mouseup/touchend)
	 */
	handleEnd() {
		this.isPointerDown = false;
		this.buttonType = null;
		this.lastPosition = { x: -1, y: -1 };

		// Commit selection if we were in Looming mode
		if (stance.current.type === 'LOOMING' && atelier.selection.isActive) {
			shuttle.commitSelection();
		}
	}

	/**
	 * Execute the appropriate intent at the given grid coordinate.
	 */
	private executeAt(gx: number, gy: number) {
		this.lastPosition = { x: gx, y: gy };

		// 1. Move the Needle to the new position
		atelier.needle.pos = { x: gx, y: gy };
		atelier.needle.resetInactivityTimer();

		const mode = stance.current.type;

		// 2. Resolve Intent based on Button and Stance
		if (this.buttonType === 'primary') {
			if (mode === 'LOOMING') {
				if (!atelier.selection.isActive) shuttle.startSelection();
				shuttle.updateSelection();
			} else if (mode === 'UNRAVELLING') {
				shuttle.stitching.unstitch();
			} else {
				// Default or Threading mode
				shuttle.stitching.stitch();
			}
		} else if (this.buttonType === 'secondary') {
			// Secondary button usually unstitches or picks dye
			if (mode === 'PICKING') {
				shuttle.dye.pickFromLinen();
			} else {
				shuttle.stitching.unstitch();
			}
		}
	}
}

export const shuttlepoint = new ShuttlePointEngine();
