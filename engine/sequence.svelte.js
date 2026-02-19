import { services } from './services.js';
import {} from './keyboard.svelte.js';
/**
 * SequenceEngine: Manages multi-key command sequences.
 * It identifies patterns in the input sequence and translates them into Intents.
 */
export class SequenceEngine {
    buffer = [];
    timeout = null;
    // Reactive buffer for UI visualization
    currentSequence = $state([]);
    /**
     * Process a key into the buffer.
     * Returns an ActionIntent if a sequence is completed, otherwise null.
     */
    process(key) {
        const k = key.toLowerCase();
        this.buffer.push(k);
        this.currentSequence = [...this.buffer];
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.reset(), 1000);
        const seq = this.buffer.join(',');
        // Pattern Mapping
        const patterns = {
            'g,c': 'GOTO', // Go to Center
            'f,n': 'NEW_ITEM', // Project: New Frame
            'i,n': 'NEW_ITEM', // Layer: New Layer
            'i,l': 'TOGGLE_LAYER_LOCK', // Layer: Lock
            'i,h': 'TOGGLE_LAYER_VISIBILITY', // Layer: Hide
            'i,m': 'MERGE_LAYERS' // Layer: Merge
        };
        if (patterns[seq]) {
            const intent = patterns[seq];
            this.reset();
            return intent;
        }
        return null;
    }
    reset() {
        this.buffer = [];
        this.currentSequence = [];
        if (this.timeout)
            clearTimeout(this.timeout);
    }
    get isActive() {
        return this.currentSequence.length > 0;
    }
}
export const sequence = new SequenceEngine();
