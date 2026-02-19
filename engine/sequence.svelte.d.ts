import { type ActionIntent } from './keyboard.svelte.js';
/**
 * SequenceEngine: Manages multi-key command sequences.
 * It identifies patterns in the input sequence and translates them into Intents.
 */
export declare class SequenceEngine {
    private buffer;
    private timeout;
    currentSequence: string[];
    /**
     * Process a key into the buffer.
     * Returns an ActionIntent if a sequence is completed, otherwise null.
     */
    process(key: string): ActionIntent | null;
    reset(): void;
    get isActive(): boolean;
}
export declare const sequence: SequenceEngine;
