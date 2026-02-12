import { MovementService } from './services/movement.js';
import { StitchService } from './services/stitch.js';
import { ManipulationService } from './services/manipulation.js';
import { ClipboardService } from './services/clipboard.js';
import { PersistenceService } from './services/persistence.js';
import { FolioService } from './services/folio.js';
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

	// --- Navigation Aliases ---

	moveNeedle(dx: number, dy: number) {
		return this.movement.move(dx, dy);
	}

	jumpTo(tx: number, ty: number) {
		this.movement.jumpTo(tx, ty);
	}

	// --- Stitching Aliases ---

	stitch() {
		this.stitching.stitch();
	}
	unstitch() {
		this.stitching.unstitch();
	}
	pickDye() {
		this.stitching.pickDye();
	}

	// --- Selection & Manipulation ---

	startSelection() {
		atelier.selection.begin(atelier.needle.pos.x, atelier.needle.pos.y);
	}
	updateSelection() {
		atelier.selection.update(atelier.needle.pos.x, atelier.needle.pos.y);
	}
	commitSelection() {
		const bounds = atelier.selection.bounds;
		if (!bounds) return;

		const { x1, x2, y1, y2 } = bounds;
		const activeDye = atelier.paletteState.activeDye;

		history.beginBatch();
		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				const index = atelier.linen.getIndex(x, y);
				const oldColor = atelier.linen.stitches[index];
				if (oldColor !== activeDye) {
					history.push({ index, oldColor, newColor: activeDye });
					atelier.linen.setColor(x, y, activeDye);
				}
			}
		}
		history.endBatch();
		sfx.playStitch();
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
	 * Create a permanent artifact (PNG/SVG) and trigger download.
	 */
	async createArtifact(
		format: 'svg' | 'png',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		const { ExportEngine } = await import('./export.js');
		const { width, height, compositeStitches } = atelier.linen;

		if (format === 'svg') {
			const svg = ExportEngine.toSVG(width, height, compositeStitches, bgColor);
			const blob = new Blob([svg], { type: 'image/svg+xml' });
			this.download(URL.createObjectURL(blob), `${atelier.project.name}.svg`);
		} else {
			const dataUrl = await ExportEngine.toPNG(width, height, compositeStitches, scale, bgColor);
			this.download(dataUrl, `${atelier.project.name}.png`);
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
