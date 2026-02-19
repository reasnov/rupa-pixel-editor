/**
 * Shared Audio Context to ensure all studio sounds (SFX and BGM)
 * pass through the same gateway and respect browser autoplay policies.
 */
declare class StudioAudio {
    private context;
    get ctx(): AudioContext;
    /**
     * Resumes the audio context. Should be called during user interaction.
     */
    resume(): Promise<void>;
    get isReady(): boolean;
}
export declare const studioAudio: StudioAudio;
export {};
