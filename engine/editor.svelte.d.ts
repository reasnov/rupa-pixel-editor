import { type ActionIntent } from './keyboard.svelte.js';
/**
 * EditorEngine: The primary orchestrator of action execution.
 */
export declare class EditorEngine {
    private backupInterval;
    private autoSaveTimer;
    private unsubscribeInput;
    mount(canvasElement?: HTMLElement | null): () => void;
    handleIntent(intent: ActionIntent): boolean | void | Promise<void> | import("../state/layer.svelte.ts").LayerState | import("../state/frame.svelte.ts").FrameState;
    private executeMove;
    resetAutoSaveTimer(): void;
}
export declare const editor: EditorEngine;
