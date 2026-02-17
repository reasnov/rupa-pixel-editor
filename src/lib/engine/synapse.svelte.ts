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
 * SynapseEngine: The central nervous system for Input I/O.
 * It normalizes signals from all physical devices (Keyboard, Pointer)
 * into a single stream of semantic intents for the Editor.
 */
export class SynapseEngine {
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

	mount(window: Window, canvasElement: HTMLElement | null) {
		// 1. Keyboard
		const onKey = (e: KeyboardEvent) => {
			if (!editor.isAppReady) return;
			const target = e.target as HTMLElement;
			if (
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target.isContentEditable
			) {
				return;
			}

			keyboard.updatePhysicalState(e, 'down');
			const intent = keyboard.getIntent(e);
			if (intent) {
				e.preventDefault();
				this.emit(intent, 'KEYBOARD');
			}
		};

		const onKeyUp = (e: KeyboardEvent) => {
			keyboard.updatePhysicalState(e, 'up');
		};

		// 2. Pointer
		if (canvasElement) {
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
		}

		window.addEventListener('keydown', onKey);
		window.addEventListener('keyup', onKeyUp);

		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('keyup', onKeyUp);
			if (canvasElement) {
				// Potential cleanup for pointer listeners would go here
			}
		};
	}
}

export const synapse = new SynapseEngine();
