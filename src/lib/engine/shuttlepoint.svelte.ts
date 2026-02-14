import { atelier } from '../state/atelier.svelte.js';
import { synapse } from './synapse.svelte.js';
import { stance } from './stance.svelte.js';
import { shuttle } from './shuttle.js';

/**
 * ShuttlePointEngine: Manages fluid pointer interactions.
 * It follows a strict sequence: handleStart -> handleMove -> handleEnd.
 */
export class ShuttlePointEngine {
	private isPointerDown = false;
	private lastPosition = { x: -1, y: -1 };
	private buttonType: 'primary' | 'secondary' | null = null;
	private holdTimer: any = null;
	private isSnapped = false;
	private rafId: number | null = null;
	isSnappedState = $state(false);

	mapToGrid(clientX: number, clientY: number, linenElement: HTMLElement) {
		const rect = linenElement.getBoundingClientRect();
		const { width, height } = atelier.linen;

		const xPct = (clientX - rect.left) / rect.width;
		const yPct = (clientY - rect.top) / rect.height;

		return {
			x: xPct * width, // Keep float for high-precision track
			y: yPct * height
		};
	}

	handleStart(e: PointerEvent, linenElement: HTMLElement) {
		this.isPointerDown = true;
		this.isSnapped = false;
		this.buttonType = e.button === 2 ? 'secondary' : 'primary';

		const pos = this.mapToGrid(e.clientX, e.clientY, linenElement);
		this.lastPosition = { x: pos.x, y: pos.y };

		// Infrastructure move (Needle Focus)
		atelier.needle.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

		const mode = stance.current.type;
		if (this.buttonType === 'primary' && mode !== 'LOOMING' && mode !== 'UNRAVELLING') {
			shuttle.stitching.beginStroke(pos.x, pos.y);
			this.startHoldTimer();
		}
	}

	handleMove(e: PointerEvent, linenElement: HTMLElement) {
		if (!this.isPointerDown) return;

		if (this.rafId) return; // Already scheduled

		this.rafId = requestAnimationFrame(() => {
			const pos = this.mapToGrid(e.clientX, e.clientY, linenElement);
			const mode = stance.current.type;

			if (this.buttonType === 'primary' && mode !== 'LOOMING' && mode !== 'UNRAVELLING') {
				if (!this.isSnapped) {
					shuttle.stitching.continueStroke(pos.x, pos.y, this.lastPosition.x, this.lastPosition.y);
					this.resetHoldTimer();
				}
			}

			this.lastPosition = { x: pos.x, y: pos.y };
			this.rafId = null;
		});
	}

	handleEnd() {
		if (!this.isPointerDown) return;
		this.isPointerDown = false;
		this.clearHoldTimer();
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		const mode = stance.current.type;
		if (this.buttonType === 'primary' && mode !== 'LOOMING' && mode !== 'UNRAVELLING') {
			shuttle.stitching.endStroke();
		} else {
			// Clear any remaining track
			atelier.linen.clearBuffer();
		}

		this.buttonType = null;
		this.lastPosition = { x: -1, y: -1 };
		this.isSnapped = false;
		this.isSnappedState = false;
	}

	/**
	 * Explicitly cancel the current pointer operation.
	 */
	cancel() {
		this.isPointerDown = false;
		this.clearHoldTimer();
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
		this.buttonType = null;
		this.lastPosition = { x: -1, y: -1 };
		this.isSnapped = false;
		this.isSnappedState = false;
		shuttle.stitching.cancelStroke();
	}

	private startHoldTimer() {
		this.clearHoldTimer();
		this.holdTimer = setTimeout(() => {
			if (this.isPointerDown) {
				this.triggerSnap();
			}
		}, 600); // 600ms hold threshold
	}

	private resetHoldTimer() {
		if (!this.isSnapped) this.startHoldTimer();
	}

	private clearHoldTimer() {
		if (this.holdTimer) clearTimeout(this.holdTimer);
		this.holdTimer = null;
	}

	private triggerSnap() {
		this.isSnapped = true;
		this.isSnappedState = true;
		// Trigger Quick Shape Correction
		shuttle.stitching.snapCurrentStroke();
	}
}

export const shuttlepoint = new ShuttlePointEngine();
