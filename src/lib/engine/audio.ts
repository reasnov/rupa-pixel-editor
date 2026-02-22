import { editor } from '../state/editor.svelte';
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
		if (editor.isMuted) return;

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
		// The Tatami Step: Low-freq square wave with a heavy low-pass filter
		const osc = this.ctx.createOscillator();
		const filter = this.ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(400, this.ctx.currentTime);

		this.playTone(freq, duration, 'square', volume * 0.5, 0.001);
	}

	playDraw() {
		const { freq, duration, volume } = audioConfig.tones.draw;
		// Mechanical Click: High-pitch square with very short decay
		this.playTone(freq, 0.05, 'square', volume, 0.0001);
		// Resonant tink overtone
		setTimeout(() => this.playTone(freq * 1.5, 0.1, 'triangle', volume * 0.3, 0.0001), 10);
	}

	playScale(index: number) {
		const scale = audioConfig.scales['c-major'];
		const freq = scale[index % scale.length];
		// Retro-FM synth style: Square + Triangle
		this.playTone(freq, 0.2, 'square', 0.05, 0.001);
		this.playTone(freq, 0.2, 'triangle', 0.08, 0.001);
	}

	playErase() {
		if (editor.isMuted) return;

		// Bit-crushed Bamboo Sweep
		const duration = 0.4;
		const bufferSize = this.ctx.sampleRate * duration;
		const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < bufferSize; i++) {
			// Lo-fi noise generation
			data[i] = Math.round((Math.random() * 2 - 1) * 4) / 4;
		}

		const noise = this.ctx.createBufferSource();
		noise.buffer = buffer;

		const filter = this.ctx.createBiquadFilter();
		filter.type = 'bandpass';
		filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
		filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + duration);
		filter.Q.value = 2;

		const gain = this.ctx.createGain();
		const effectiveVolume = 0.12 * editor.sfxVolume;
		gain.gain.setValueAtTime(effectiveVolume, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

		noise.connect(filter);
		filter.connect(gain);
		gain.connect(this.ctx.destination);

		noise.start();
	}

	playStartup() {
		const { freq, duration, volume } = audioConfig.tones.startup;
		// 8-bit Temple Bell: Harmonized Square waves
		this.playTone(freq, duration, 'square', volume * 0.6, 0.0001);
		this.playTone(freq * 0.5, duration * 2, 'triangle', volume * 0.4, 0.0001);
	}

	playReady() {
		const notes = audioConfig.tones.ready;
		// The Furin (Wind Chime): Cascading 8-bit arpeggio
		notes.forEach((freq, i) => {
			setTimeout(() => {
				this.playTone(freq, 0.8, 'triangle', 0.03, 0.0001);
				this.playTone(freq * 2, 0.2, 'square', 0.01, 0.0001);
			}, i * 120);
		});
	}

	playPaperFlip() {
		if (editor.isMuted) return;
		// A soft, short parchment rustle
		const duration = 0.15;
		const bufferSize = this.ctx.sampleRate * duration;
		const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

		const noise = this.ctx.createBufferSource();
		noise.buffer = buffer;
		const filter = this.ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
		filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + duration);

		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(0.05 * editor.sfxVolume, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

		noise.connect(filter);
		filter.connect(gain);
		gain.connect(this.ctx.destination);
		noise.start();
	}

	playCeramicSlide() {
		if (editor.isMuted) return;
		// A dull, heavy friction sound
		this.playTone(150, 0.2, 'triangle', 0.08, 0.001);
		this.playTone(100, 0.3, 'sine', 0.05, 0.001);
	}
}

export const sfx = new AudioEngine();
