import { editor } from '../state/editor.svelte.js';
import { studioAudio } from './audioContext.js';
import audioConfig from '../config/audio.json' with { type: 'json' };

/**
 * AmbientEngine: A generative music engine that generates and plays
 * a soft, meditative piano-like soundscape.
 */
export class AmbientEngine {
	private isPlaying = false;
	private nextNoteTime = 0;
	private timer: any = null;

	private get ctx(): AudioContext {
		return studioAudio.ctx;
	}

	// Music Data from Config
	private scale = audioConfig.ambient.scale;
	private chords = audioConfig.ambient.chords;

	private currentChordIndex = 0;

	toggle() {
		if (this.isPlaying) {
			this.stop();
		} else {
			this.start();
		}
	}

	start() {
		if (this.isPlaying) return;
		this.isPlaying = true;
		this.nextNoteTime = this.ctx.currentTime;
		this.scheduler();
	}

	stop() {
		this.isPlaying = false;
		clearTimeout(this.timer);
	}

	private scheduler() {
		if (!this.isPlaying || editor.studio.isMuted || !editor.studio.isAmbientPlaying) {
			this.timer = setTimeout(() => this.scheduler(), 100);
			return;
		}

		while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
			this.playGenerativeNote(this.nextNoteTime);

			// Human-like timing: randomized delay between 0.8s to 2.5s
			const delay = 0.8 + Math.random() * 1.7;
			this.nextNoteTime += delay;

			// Occasionally switch chords
			if (Math.random() > 0.85) {
				this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
			}
		}

		this.timer = setTimeout(() => this.scheduler(), 50);
	}

	private playGenerativeNote(time: number) {
		// Pick a note from the current chord or the general scale
		const chord = this.chords[this.currentChordIndex];
		const useChord = Math.random() > 0.3;
		const freq = useChord
			? chord[Math.floor(Math.random() * chord.length)]
			: this.scale[Math.floor(Math.random() * this.scale.length)];

		this.pianoPluck(freq, time);

		// Subtle Harmonic Overtone
		this.pianoPluck(freq * 2, time, 0.08);

		// Occasionally play a second soft note (harmony)
		if (Math.random() > 0.7) {
			this.pianoPluck(freq * 0.5, time + 0.05, 0.1); // Sub-octave
		}
	}

	private pianoPluck(freq: number, time: number, volume = 0.3) {
		// --- Generative Volume Logic (Data Driven) ---
		const { startMins, fullMins } = audioConfig.ambient.fade;
		const minutes = editor.usageMinutes;
		let fadeScale = 0;

		if (minutes >= startMins && minutes < fullMins) {
			fadeScale = (minutes - startMins) / (fullMins - startMins); // Linear fade
		} else if (minutes >= fullMins) {
			fadeScale = 1;
		}

		// Combined effective volume: (Base Volume * Fade Scale * User Settings)
		const effectiveVolume = volume * fadeScale * editor.bgmVolume;

		// Skip rendering if volume is negligible
		if (effectiveVolume < 0.001) return;

		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		const filter = this.ctx.createBiquadFilter();

		// Soft Sine + Triangle mix for a "felt piano" vibe
		osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
		osc.frequency.setValueAtTime(freq, time);

		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(1200, time);
		filter.frequency.exponentialRampToValueAtTime(400, time + 1.5);

		gain.gain.setValueAtTime(0, time);
		gain.gain.linearRampToValueAtTime(effectiveVolume, time + 0.02); // Soft attack
		gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5); // Long sustain/release

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(this.ctx.destination);

		osc.start(time);
		osc.stop(time + 2.6);
	}
}

export const ambient = new AmbientEngine();
