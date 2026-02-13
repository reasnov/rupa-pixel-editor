import { loompad, type LoomIntent } from './loompad.svelte.js';
import { shuttlepoint } from './shuttlepoint.svelte.js';
import { atelier } from '../state/atelier.svelte.js';

type InputSource = 'KEYBOARD' | 'MOUSE' | 'TOUCH' | 'PEN' | 'GAMEPAD';

interface NormalizedSignal {
	intent: LoomIntent;
	source: InputSource;
	meta?: any; // For pressure data (pen) or coordinates (mouse)
}

/**
 * SynapseEngine: The central nervous system for Input I/O.
 * It normalizes signals from all physical devices (LoomPad, ShuttlePoint, future Pen/Touch)
 * into a single stream of semantic intents for The Loom.
 */
export class SynapseEngine {
	// The current active input method (used for UI hints)
	activeSource = $state<InputSource>('KEYBOARD');

	// Event Bus for normalized intents
	private listeners: ((signal: NormalizedSignal) => void)[] = [];

	constructor() {
		// We will hook up device listeners in the mount phase
	}

	/**
	 * Subscribe to the normalized intent stream.
	 */
	subscribe(fn: (signal: NormalizedSignal) => void) {
		this.listeners.push(fn);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== fn);
		};
	}

	/**
	 * Broadcast a normalized signal to the system.
	 */
	emit(intent: LoomIntent, source: InputSource, meta?: any) {
		this.activeSource = source;
		const signal: NormalizedSignal = { intent, source, meta };
		this.listeners.forEach((fn) => fn(signal));
	}

	/**
	 * Main integration point. Should be called by TheLoom.
	 */
	mount(window: Window, linenElement: HTMLElement | null) {
		// 1. Keyboard (LoomPad)
		const onKey = (e: KeyboardEvent) => {
			if (!atelier.studio.isAppReady) return;
			// Skip input fields
			const target = e.target as HTMLElement;
			if (
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target.isContentEditable
			) {
				return;
			}

			loompad.updatePhysicalState(e, 'down');
			const intent = loompad.getIntent(e);
			if (intent) {
				e.preventDefault();
				this.emit(intent, 'KEYBOARD');
			}
		};

		// 2. Pointer (ShuttlePoint) - Only if Linen is available
		if (linenElement) {
			const onPointerDown = (e: PointerEvent) => {
				const source =
					e.pointerType === 'pen' ? 'PEN' : e.pointerType === 'touch' ? 'TOUCH' : 'MOUSE';
				shuttlepoint.handleStart(e, linenElement);
				// Note: ShuttlePoint currently executes directly.
				// Future Refactor: ShuttlePoint should return an Intent to be emitted here.
				this.activeSource = source;
			};

			const onPointerMove = (e: PointerEvent) => {
				shuttlepoint.handleMove(e, linenElement);
			};

			const onPointerUp = (e: PointerEvent) => {
				shuttlepoint.handleEnd();
			};

			linenElement.addEventListener('pointerdown', onPointerDown);
			window.addEventListener('pointermove', onPointerMove);
			window.addEventListener('pointerup', onPointerUp);

			// Cleanup function
			const cleanupPointer = () => {
				linenElement.removeEventListener('pointerdown', onPointerDown);
				window.removeEventListener('pointermove', onPointerMove);
				window.removeEventListener('pointerup', onPointerUp);
			};
		}

		window.addEventListener('keydown', onKey);
		window.addEventListener('keyup', (e) => loompad.updatePhysicalState(e, 'up'));

		return () => {
			window.removeEventListener('keydown', onKey);
			// window.removeEventListener('keyup', ...);
		};
	}
}

export const synapse = new SynapseEngine();
