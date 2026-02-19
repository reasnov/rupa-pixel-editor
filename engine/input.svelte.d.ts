import { type ActionIntent } from './keyboard.svelte.js';
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
export declare class InputEngine {
    activeSource: InputSource;
    private listeners;
    constructor();
    subscribe(fn: (signal: NormalizedSignal) => void): () => void;
    emit(intent: ActionIntent, source: InputSource, meta?: any): void;
    mount(window: Window, canvasElement: HTMLElement | null): () => void;
}
export declare const input: InputEngine;
export {};
