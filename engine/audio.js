import { editor } from '../state/editor.svelte';
import { studioAudio } from './audioContext.js';
import audioConfig from '../config/audio.json' with { type: 'json' };
export class AudioEngine {
    get ctx() {
        return studioAudio.ctx;
    }
    playTone(freq, duration, type = 'sine', volume = 0.1, rampTo = 0.0001) {
        if (editor.isMuted)
            return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        // Apply global SFX volume
        const effectiveVolume = volume * editor.sfxVolume;
        gain.gain.setValueAtTime(effectiveVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(rampTo, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    playMove() {
        const { freq, duration, volume } = audioConfig.tones.move;
        this.playTone(freq, duration, 'sine', volume);
    }
    playDraw() {
        const { freq, duration, volume } = audioConfig.tones.draw;
        this.playTone(freq, duration, 'sine', volume);
        setTimeout(() => this.playTone(freq * 1.25, duration * 0.6, 'sine', volume * 0.6), 50);
    }
    playScale(index) {
        const scale = audioConfig.scales['c-major'];
        const freq = scale[index % scale.length];
        this.playTone(freq, 0.15, 'sine', 0.12);
    }
    playErase() {
        if (editor.isMuted)
            return;
        const duration = 0.25;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + duration);
        const gain = this.ctx.createGain();
        const effectiveVolume = 0.1 * editor.sfxVolume;
        gain.gain.setValueAtTime(effectiveVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }
    playStartup() {
        const { freq, duration, volume } = audioConfig.tones.startup;
        this.playTone(freq, duration, 'sine', volume);
        this.playTone(freq / 2, duration * 1.5, 'sine', volume / 2);
    }
    playReady() {
        const notes = audioConfig.tones.ready;
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.05), i * 100);
        });
    }
}
export const sfx = new AudioEngine();
