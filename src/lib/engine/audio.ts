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

	private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
		this.init();
		if (!this.ctx) return;

		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
		
		gain.gain.setValueAtTime(volume, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

		osc.connect(gain);
		gain.connect(this.ctx.destination);

		osc.start();
		osc.stop(this.ctx.currentTime + duration);
	}

	playMove() {
		// Short, sharper "tick" for movement
		this.playTone(600, 0.03, 'sine', 0.15);
	}

	playStitch() {
		// Mid-frequency "pop" for placing a brick
		this.playTone(400, 0.1, 'square', 0.03);
		setTimeout(() => this.playTone(600, 0.05, 'sine', 0.02), 20);
	}

	playUnstitch() {
		// Noise-like crunch for destroying a brick
		this.init();
		if (!this.ctx) return;

		const duration = 0.1;
		const bufferSize = this.ctx.sampleRate * duration;
		const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < bufferSize; i++) {
			data[i] = Math.random() * 2 - 1;
		}

		const noise = this.ctx.createBufferSource();
		noise.buffer = buffer;

		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

		noise.connect(gain);
		gain.connect(this.ctx.destination);

		noise.start();
	}
}

export const sfx = new AudioEngine();
