/**
 * Shared Audio Context to ensure all studio sounds (SFX and BGM)
 * pass through the same gateway and respect browser autoplay policies.
 */
class StudioAudio {
    context = null;
    get ctx() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.context;
    }
    /**
     * Resumes the audio context. Should be called during user interaction.
     */
    async resume() {
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }
    get isReady() {
        return this.context !== null && this.context.state === 'running';
    }
}
export const studioAudio = new StudioAudio();
