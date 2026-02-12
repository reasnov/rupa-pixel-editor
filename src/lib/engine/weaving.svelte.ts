import { shuttle } from './shuttle.js';
import { type LoomIntent } from './loompad.svelte.js';

/**
 * WeavingEngine: Manages multi-key command sequences.
 * It identifies patterns in the input rhythm and translates them into Intents.
 */
export class WeavingEngine {
	private buffer: string[] = [];
	private timeout: any = null;

	// Reactive buffer for UI visualization
	currentSequence = $state<string[]>([]);

	/**
	 * Process a key into the weaving buffer.
	 * Returns a LoomIntent if a sequence is completed, otherwise null.
	 */
	process(key: string): LoomIntent | null {
		const k = key.toLowerCase();
		this.buffer.push(k);
		this.currentSequence = [...this.buffer];

		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.reset(), 1000);

		const seq = this.buffer.join(',');

		// Pattern Mapping
		const patterns: Record<string, LoomIntent> = {
			'g,c': 'GOTO', // Go to Center (alias)
			'f,n': 'NEW_FRAME', // Folio: New Frame
			'v,n': 'NEW_VEIL', // Veil: New Veil
			'v,l': 'TOGGLE_VEIL_LOCK', // Veil: Lock
			'v,h': 'TOGGLE_VEIL_VISIBILITY', // Veil: Hide
			'v,m': 'MERGE_VEILS' // Veil: Merge
		};

		if (patterns[seq]) {
			const intent = patterns[seq];
			this.reset();
			return intent;
		}

		// If buffer is too long or no match possible, reset logic could go here
		// For now, we just wait for timeout or next key
		return null;
	}

	reset() {
		this.buffer = [];
		this.currentSequence = [];
		if (this.timeout) clearTimeout(this.timeout);
	}

	get isActive() {
		return this.currentSequence.length > 0;
	}
}

export const weaving = new WeavingEngine();
