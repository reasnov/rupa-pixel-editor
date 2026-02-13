import { atelier } from '../state/atelier.svelte';
import { studioAudio } from './audioContext.js';

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
		// Audible wooden tap
		this.playTone(450, 0.08, 'sine', 0.15);
	}

	playStitch() {
		// Gentle bell/chime
		this.playTone(1200, 0.15, 'sine', 0.03);
		setTimeout(() => this.playTone(1500, 0.1, 'sine', 0.02), 50);
	}

	playScale(index: number) {
		// C Major Scale frequencies (C4 to E5)
		const scale = [
			261.63, // C4
			293.66, // D4
			329.63, // E4
			349.23, // F4
			392.0, // G4
			440.0, // A4
			493.88, // B4
			523.25, // C5
			587.33, // D5
			659.25 // E5
		];

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
		// Warm, deep wooden hum
		this.playTone(220, 0.8, 'sine', 0.1);
		this.playTone(110, 1.2, 'sine', 0.05);
	}

	playReady() {
		// Magical glissando (C5, E5, G5, C6)
		const notes = [523.25, 659.25, 783.99, 1046.5];
		notes.forEach((freq, i) => {
			setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.05), i * 100);
		});
	}
}

export const sfx = new AudioEngine();
