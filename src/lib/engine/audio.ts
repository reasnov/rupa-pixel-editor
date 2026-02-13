import { atelier } from '../state/atelier.svelte';
import { studioAudio } from './audioContext.js';
import audioConfig from '../config/audio.json' with { type: 'json' };

export class AudioEngine {
	private get ctx(): AudioContext {
		return studioAudio.ctx;
	}

	private playTone(
		freq: number,
		duration: number,
		type: OscillatorType = 'sine',
		volume = 0.1,
		rampTo = 0.0001
	) {
		if (atelier.isMuted) return;

		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

		// Apply global SFX volume
		const effectiveVolume = volume * atelier.sfxVolume;

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

	playStitch() {
		const { freq, duration, volume } = audioConfig.tones.stitch;
		this.playTone(freq, duration, 'sine', volume);
		setTimeout(() => this.playTone(freq * 1.25, duration * 0.6, 'sine', volume * 0.6), 50);
	}

	playScale(index: number) {
		const scale = audioConfig.scales['c-major'];
		const freq = scale[index % scale.length];
		this.playTone(freq, 0.15, 'sine', 0.12);
	}

	playUnstitch() {
		// Audible brush/paper rustle
		if (atelier.isMuted) return;

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
		const effectiveVolume = 0.1 * atelier.sfxVolume;
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
