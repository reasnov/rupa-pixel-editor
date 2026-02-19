export declare class AudioEngine {
    private get ctx();
    private playTone;
    playMove(): void;
    playDraw(): void;
    playScale(index: number): void;
    playErase(): void;
    playStartup(): void;
    playReady(): void;
}
export declare const sfx: AudioEngine;
