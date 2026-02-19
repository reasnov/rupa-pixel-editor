import { keyboard } from './keyboard.svelte.js';
import { pointer } from './pointer.svelte.js';
import { editor } from '../state/editor.svelte.js';
/**
 * InputEngine: The central nervous system for Input I/O.
 * It normalizes signals from all physical devices (Keyboard, Pointer)
 * into a single stream of semantic intents.
 */
export class InputEngine {
    activeSource = $state('KEYBOARD');
    listeners = [];
    constructor() { }
    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== fn);
        };
    }
    emit(intent, source, meta) {
        this.activeSource = source;
        const signal = { intent, source, meta };
        this.listeners.forEach((fn) => fn(signal));
    }
    mount(window, canvasElement) {
        // 1. Keyboard
        const onKey = (e) => {
            if (!editor.isAppReady)
                return;
            const target = e.target;
            if (target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target.isContentEditable) {
                // Allow Escape to propagate even when an input is focused
                if (e.key !== 'Escape')
                    return;
            }
            keyboard.updatePhysicalState(e, 'down');
            const intent = keyboard.getIntent(e);
            if (intent) {
                e.preventDefault();
                this.emit(intent, 'KEYBOARD');
            }
        };
        const onKeyUp = (e) => {
            keyboard.updatePhysicalState(e, 'up');
        };
        // 2. Pointer
        if (canvasElement) {
            const onPointerDown = (e) => {
                const source = e.pointerType === 'pen' ? 'PEN' : e.pointerType === 'touch' ? 'TOUCH' : 'MOUSE';
                pointer.handleStart(e, canvasElement);
                this.activeSource = source;
            };
            const onPointerMove = (e) => {
                pointer.handleMove(e, canvasElement);
            };
            const onPointerUp = (e) => {
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
        };
    }
}
export const input = new InputEngine();
