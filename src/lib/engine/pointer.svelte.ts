import { editor } from '../state/editor.svelte.js';
import { input } from './input.svelte.js';
import { mode } from './mode.svelte.js';
import { services } from './services.js';

/**
 * PointerEngine: Manages fluid pointer interactions.
 * It follows a strict sequence: handleStart -> handleMove -> handleEnd.
 */
export class PointerEngine {
	private isPointerDown = false;
	private lastPosition = { x: -1, y: -1 };
	private buttonType: 'primary' | 'secondary' | null = null;
	private holdTimer: any = null;
	private isSnapped = false;
	private rafId: number | null = null;
	isSnappedState = $state(false);

	mapToGrid(clientX: number, clientY: number, canvasElement: HTMLElement) {
		const rect = canvasElement.getBoundingClientRect();
		const { width, height } = editor.canvas;

		const xPct = (clientX - rect.left) / rect.width;
		const yPct = (clientY - rect.top) / rect.height;

		return {
			x: xPct * width,
			y: yPct * height
		};
	}

	handleStart(e: PointerEvent, canvasElement: HTMLElement) {
		this.isPointerDown = true;
		this.isSnapped = false;
		this.buttonType = e.button === 2 ? 'secondary' : 'primary';

		const pos = this.mapToGrid(e.clientX, e.clientY, canvasElement);
		this.lastPosition = { x: pos.x, y: pos.y };

		editor.cursor.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

		const currentMode = mode.current.type;
		if (this.buttonType === 'primary' && currentMode !== 'SELECT' && currentMode !== 'ERASE') {
			services.draw.beginStroke(pos.x, pos.y);
			this.startHoldTimer();
		}
	}

	handleMove(e: PointerEvent, canvasElement: HTMLElement) {
		if (!this.isPointerDown) return;

		if (this.rafId) return;

		this.rafId = requestAnimationFrame(() => {
			const pos = this.mapToGrid(e.clientX, e.clientY, canvasElement);
			const currentMode = mode.current.type;

			if (this.buttonType === 'primary' && currentMode !== 'SELECT' && currentMode !== 'ERASE') {
				if (!this.isSnapped) {
					services.draw.continueStroke(pos.x, pos.y, this.lastPosition.x, this.lastPosition.y);
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

		const currentMode = mode.current.type;
		if (this.buttonType === 'primary' && currentMode !== 'SELECT' && currentMode !== 'ERASE') {
			services.draw.endStroke();
		} else {
			editor.canvas.clearBuffer();
		}

		this.buttonType = null;
		this.lastPosition = { x: -1, y: -1 };
		this.isSnapped = false;
		this.isSnappedState = false;
	}

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
		services.draw.cancelStroke();
	}

	private startHoldTimer() {
		this.clearHoldTimer();
		this.holdTimer = setTimeout(() => {
			if (this.isPointerDown) {
				this.triggerSnap();
			}
		}, 600);
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
		services.draw.snapCurrentStroke();
	}
}

export const pointer = new PointerEngine();
