/**
 * AmbientEngine: A generative music engine that generates and plays
 * a soft, meditative piano-like soundscape.
 */
export declare class AmbientEngine {
    private isPlaying;
    private nextNoteTime;
    private timer;
    private get ctx();
    private scale;
    private chords;
    private currentChordIndex;
    toggle(): void;
    start(): void;
    stop(): void;
    private scheduler;
    private playGenerativeNote;
    private pianoPluck;
}
export declare const ambient: AmbientEngine;
