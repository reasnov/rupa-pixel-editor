import { MovementService } from './services/movement.js';
import { StitchService } from './services/stitch.js';
import { ManipulationService } from './services/manipulation.js';
import { ClipboardService } from './services/clipboard.js';
import { PersistenceService } from './services/persistence.js';
import { FolioService } from './services/folio.js';
import { SelectionService } from './services/selection.js';
import { DyeService } from './services/dye.js';
import { atelier } from '../state/atelier.svelte.js';
import { history } from './history.js';
import { sfx } from './audio.js';

/**
 * ShuttleEngine: The unified service coordinator for atelier operations.
 * It provides a clean API for the UI/Loom while delegating to specialized services.
 */
export class ShuttleEngine {
	readonly movement = new MovementService();
	readonly stitching = new StitchService();
	readonly manipulation = new ManipulationService();
	readonly clipboard = new ClipboardService();
	readonly persistence = new PersistenceService();
	readonly folio = new FolioService();
	readonly selection = new SelectionService();
	readonly dye = new DyeService();

	// --- Navigation Aliases ---

	moveNeedle(dx: number, dy: number) {
		return this.movement.move(dx, dy);
	}

	jumpTo(tx: number, ty: number) {
		this.movement.jumpTo(tx, ty);
	}

	jumpHome() {
		this.movement.jumpHome();
	}

	// --- Stitching & Dye Aliases ---

	stitch() {
		this.stitching.stitch();
	}
	unstitch() {
		this.stitching.unstitch();
	}
	pickDye() {
		this.dye.pickFromLinen();
	}

	// --- Selection & Manipulation ---

	startSelection() {
		this.selection.begin(atelier.needle.pos.x, atelier.needle.pos.y);
	}
	updateSelection() {
		this.selection.update(atelier.needle.pos.x, atelier.needle.pos.y);
	}
	commitSelection() {
		this.selection.commit();
	}

	clearLinen() {
		this.manipulation.clearAll();
	}
	resizeLinen(w: number, h: number) {
		this.manipulation.resize(w, h);
	}
	flipLinen(axis: 'horizontal' | 'vertical') {
		this.manipulation.flip(axis);
	}
	rotateLinen() {
		this.manipulation.rotate();
	}

	// --- Clipboard Aliases ---

	copy() {
		this.clipboard.copy();
	}
	cut() {
		this.clipboard.cut();
	}
	paste() {
		this.clipboard.paste();
		atelier.selection.clear();
	}

	// --- Persistence & Backup ---

	save() {
		this.persistence.save();
	}
	load() {
		this.persistence.load();
	}
	backup() {
		this.persistence.backup();
	}

	/**
	 * Create a permanent artifact (PNG/SVG/JPG/WEBP/WEBM/GIF/MP4) and trigger download.
	 */
	async createArtifact(
		format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		const { ExportEngine } = await import('./export.js');
		const { width, height, compositeStitches } = atelier.linen;

		// Fallback for kinetic formats with single frames
		const isKinetic = ['webm', 'gif', 'mp4'].includes(format);
		const actualFormat = atelier.project.frames.length <= 1 && isKinetic ? 'png' : format;

		if (actualFormat === 'svg') {
			// Check if we have multiple frames for animation
			if (atelier.project.frames.length > 1) {
				const framesData = atelier.project.frames.map((f) => f.compositeStitches);
				const durations = atelier.project.frames.map((f) => f.duration);
				const svg = ExportEngine.toAnimatedSVG(width, height, framesData, durations, bgColor);
				const blob = new Blob([svg], { type: 'image/svg+xml' });
				this.download(URL.createObjectURL(blob), `rupa-kinetic.svg`);
			} else {
				const svg = ExportEngine.toSVG(width, height, compositeStitches, bgColor);
				const blob = new Blob([svg], { type: 'image/svg+xml' });
				this.download(URL.createObjectURL(blob), `rupa-motif.svg`);
			}
		} else if (actualFormat === 'webm' || actualFormat === 'mp4') {
			const framesData = atelier.project.frames.map((f) => f.compositeStitches);
			const durations = atelier.project.frames.map((f) => f.duration);
			const videoBlob = await ExportEngine.toVideo(
				width,
				height,
				framesData,
				durations,
				scale,
				actualFormat as 'webm' | 'mp4',
				bgColor
			);

			// Download the raw blob returned by the engine (it already has the correct mimeType)
			const extension = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
			this.download(URL.createObjectURL(videoBlob), `rupa-stitch.${extension}`);
		} else if (actualFormat === 'gif') {
			const framesData = atelier.project.frames.map((f) => f.compositeStitches);
			const durations = atelier.project.frames.map((f) => f.duration);
			const gifBlob = await ExportEngine.toGIF(
				width,
				height,
				framesData,
				durations,
				scale,
				bgColor
			);
			this.download(URL.createObjectURL(gifBlob), `rupa-weave.gif`);
		} else {
			const dataUrl = await ExportEngine.toRaster(
				width,
				height,
				compositeStitches,
				scale,
				actualFormat as any,
				bgColor
			);
			this.download(dataUrl, `rupa-artifact.${actualFormat}`);
		}
		atelier.studio.showArtifactCrate = false;
	}

	private download(url: string, filename: string) {
		const a = document.createElement('a');
		a.href = url;
		a.download = filename.toLowerCase().replace(/\s+/g, '-');
		a.click();
	}
}

export const shuttle = new ShuttleEngine();
