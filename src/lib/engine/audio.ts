import { atelier } from '../state/atelier.svelte';

export class AudioEngine {
	private ctx: AudioContext | null = null;

	private init() {
		if (!this.ctx) {
			this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
		}
		if (this.ctx.state === 'suspended') {
			this.ctx.resume();
		}
	}

	private playTone(
		freq: number,
		duration: number,
		type: OscillatorType = 'sine',
		volume = 0.1,
		rampTo = 0.0001
	) {
		this.init();
		if (!this.ctx || atelier.isMuted) return;

		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

		gain.gain.setValueAtTime(volume, this.ctx.currentTime);
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
		this.playTone(freq, 0.15, 'sine', 0.05);
	}

	playUnstitch() {
		// Audible brush/paper rustle
		this.init();
		if (!this.ctx || atelier.isMuted) return;

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
		gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

		noise.connect(filter);
		filter.connect(gain);
		gain.connect(this.ctx.destination);

		noise.start();
	}
}

export const sfx = new AudioEngine();
