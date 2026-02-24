import { keyboard, type ActionIntent } from './keyboard.svelte.js';
import { pointer } from './pointer.svelte.js';
import { editor } from '../state/editor.svelte.js';

type InputSource = 'KEYBOARD' | 'MOUSE' | 'TOUCH' | 'PEN' | 'GAMEPAD';

interface NormalizedSignal {
	intent: ActionIntent;
	source: InputSource;
	meta?: any;
}

/**
 * InputEngine: The central nervous system for Input I/O.
 * It normalizes signals from all physical devices (Keyboard, Pointer)
 * into a single stream of semantic intents.
 */
export class InputEngine {
	activeSource = $state<InputSource>('KEYBOARD');

	private listeners: ((signal: NormalizedSignal) => void)[] = [];

	constructor() {}

	subscribe(fn: (signal: NormalizedSignal) => void) {
		this.listeners.push(fn);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== fn);
		};
	}

	emit(intent: ActionIntent, source: InputSource, meta?: any) {
		this.activeSource = source;
		const signal: NormalizedSignal = { intent, source, meta };
		this.listeners.forEach((fn) => fn(signal));
	}

	mount(window: Window) {
		// 1. Keyboard
		const onKey = (e: KeyboardEvent) => {
			if (!editor.isAppReady) return;

			// Always update physical state to keep modifiers in sync
			keyboard.updatePhysicalState(e, 'down');

			const target = e.target as HTMLElement;
			const active = document.activeElement;
			const isInputField =
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.isContentEditable ||
				target.closest('input, textarea, [contenteditable="true"]') ||
				active?.tagName === 'INPUT' ||
				active?.tagName === 'TEXTAREA' ||
				(active as HTMLElement)?.isContentEditable;

			if (isInputField && e.key !== 'Escape') {
				return;
			}

			const intent = keyboard.getIntent(e);
			if (intent) {
				e.preventDefault();
				this.emit(intent, 'KEYBOARD');
			}
		};

		const onKeyUp = (e: KeyboardEvent) => {
			keyboard.updatePhysicalState(e, 'up');
		};

		window.addEventListener('keydown', onKey);
		window.addEventListener('keyup', onKeyUp);

		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('keyup', onKeyUp);
		};
	}

	/**
	 * Binds the pointer events to a specific canvas element.
	 * This can be called after mount() when the UI is ready.
	 */
	bindCanvas(canvasElement: HTMLElement) {
		const onPointerDown = (e: PointerEvent) => {
			const source =
				e.pointerType === 'pen' ? 'PEN' : e.pointerType === 'touch' ? 'TOUCH' : 'MOUSE';
			pointer.handleStart(e, canvasElement);
			this.activeSource = source;
		};

		const onPointerMove = (e: PointerEvent) => {
			pointer.handleMove(e, canvasElement);
		};

		const onPointerUp = (e: PointerEvent) => {
			pointer.handleEnd();
		};

		canvasElement.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);

		return () => {
			canvasElement.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
		};
	}
}

export const input = new InputEngine();
