import { MovementService } from './services/movement.js';
import { DrawService } from './services/draw.js';
import { ManipulationService } from './services/manipulation.js';
import { ClipboardService } from './services/clipboard.js';
import { PersistenceService } from './services/persistence.js';
import { ProjectService } from './services/project.js';
import { SelectionService } from './services/selection.js';
import { ColorService } from './services/color.js';
import { HistoryService } from './services/history.js';
import { editor } from '../state/editor.svelte.js';
import { history } from './history.js';
import { sfx } from './audio.js';

/**
 * ServiceCoordinator: Unified access point for application services.
 * It provides a clean API for the UI while delegating to specialized services.
 */
export class ServiceCoordinator {
	private _movement: MovementService | null = null;
	private _draw: DrawService | null = null;
	private _manipulation: ManipulationService | null = null;
	private _clipboard: ClipboardService | null = null;
	private _persistence: PersistenceService | null = null;
	private _project: ProjectService | null = null;
	private _selection: SelectionService | null = null;
	private _color: ColorService | null = null;
	private _history: HistoryService | null = null;

	get movement() {
		if (!this._movement) this._movement = new MovementService();
		return this._movement;
	}
	get draw() {
		if (!this._draw) this._draw = new DrawService();
		return this._draw;
	}
	get manipulation() {
		if (!this._manipulation) this._manipulation = new ManipulationService();
		return this._manipulation;
	}
	get clipboard() {
		if (!this._clipboard) this._clipboard = new ClipboardService();
		return this._clipboard;
	}
	get persistence() {
		if (!this._persistence) this._persistence = new PersistenceService();
		return this._persistence;
	}
	get project() {
		if (!this._project) this._project = new ProjectService();
		return this._project;
	}
	get selection() {
		if (!this._selection) this._selection = new SelectionService();
		return this._selection;
	}
	get color() {
		if (!this._color) this._color = new ColorService();
		return this._color;
	}
	get history() {
		if (!this._history) this._history = new HistoryService();
		return this._history;
	}

	// --- Navigation Aliases ---

	moveCursor(dx: number, dy: number) {
		return this.movement.move(dx, dy);
	}

	jumpTo(tx: number, ty: number) {
		this.movement.jumpTo(tx, ty);
	}

	jumpHome() {
		this.movement.jumpHome();
	}

	// --- Drawing & Color Aliases ---

	paint() {
		this.draw.draw();
	}
	erase() {
		this.draw.erase();
	}
	pickColor() {
		this.color.pickFromCanvas();
	}

	// --- Selection & Manipulation ---

	startSelection() {
		this.selection.begin(editor.cursor.pos.x, editor.cursor.pos.y);
	}
	updateSelection() {
		this.selection.update(editor.cursor.pos.x, editor.cursor.pos.y);
	}
	commitSelection() {
		this.selection.fillSelection();
	}

	clearCanvas() {
		this.manipulation.clearAll();
	}
	resizeCanvas(w: number, h: number) {
		this.manipulation.resize(w, h);
	}
	flipCanvas(axis: 'horizontal' | 'vertical') {
		this.manipulation.flip(axis);
	}
	rotateCanvas() {
		this.manipulation.rotate();
	}

	mergeLayerDown() {
		this.project.mergeLayerDown();
	}
	mergeSelectedLayers() {
		this.project.mergeSelectedLayers();
	}
	mergeFrames() {
		this.project.mergeFrames();
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
		editor.selection.clear();
	}

	// --- Persistence & Backup ---

	undo() {
		this.history.undo();
	}
	redo() {
		this.history.redo();
	}

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
	async asyncCreateArtifact(
		format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		editor.studio.show('Preparing Cup...');
		editor.studio.exportProgress = 0;

		const { ExportEngine } = await import('./export.js');
		const { width, height } = editor.canvas;
		const includeBorders = editor.studio.includePixelBorders;

		const isAnimated = ['webm', 'gif', 'mp4'].includes(format);
		const isStatic = ['png', 'jpg', 'webp', 'svg'].includes(format);

		// Progress Callback
		const updateProgress = (p: number) => {
			editor.studio.exportProgress = Math.round(p * 100);
		};

		// 1. Determine which frames/pixel data to export
		let framesToProcess: Array<{ compositePixels: Uint32Array; name: string }> = [];

		if (isAnimated) {
			// Animations always use visible frames
			framesToProcess = editor.project.frames.filter((f) => f.isVisible);
		} else {
			// Static formats use the selection setting
			switch (editor.studio.exportFrameSelection) {
				case 'ACTIVE':
					framesToProcess = [editor.project.activeFrame];
					break;
				case 'VISIBLE':
					framesToProcess = editor.project.frames.filter((f) => f.isVisible);
					break;
				case 'SELECTED':
					framesToProcess = Array.from(editor.project.selectedFrameIndices)
						.sort((a, b) => a - b)
						.map((idx) => editor.project.frames[idx]);
					break;
				case 'ALL':
					framesToProcess = editor.project.frames;
					break;
				case 'SELECTED_LAYERS':
					framesToProcess = [
						{
							name: 'Selected Layers',
							compositePixels: editor.project.activeFrame.getSelectedLayerComposite()
						}
					];
					break;
				default:
					framesToProcess = [editor.project.activeFrame];
			}
		}

		if (framesToProcess.length === 0) {
			editor.studio.show('No frames to export');
			editor.studio.exportProgress = 0;
			return;
		}

		const actualFormat = framesToProcess.length <= 1 && isAnimated ? 'png' : format;

		const fpsDuration = 1000 / editor.project.fps;

		if (actualFormat === 'svg') {
			if (framesToProcess.length > 1) {
				const framesData = framesToProcess.map((f) => f.compositePixels);
				const durations = framesToProcess.map(() => fpsDuration);
				const svg = await ExportEngine.toAnimatedSVG(
					width,
					height,
					framesData,
					durations,
					bgColor,
					includeBorders,
					updateProgress
				);
				const blob = new Blob([svg], { type: 'image/svg+xml' });
				this.download(URL.createObjectURL(blob), `rupa-image.svg`);
			} else {
				// Single SVG
				const targetFrame = framesToProcess[0];
				const svg = await ExportEngine.toSVG(
					width,
					height,
					targetFrame.compositePixels,
					bgColor,
					includeBorders,
					updateProgress
				);
				const blob = new Blob([svg], { type: 'image/svg+xml' });
				this.download(URL.createObjectURL(blob), `rupa-image.svg`);
			}
		} else if (actualFormat === 'webm' || actualFormat === 'mp4') {
			const framesData = framesToProcess.map((f) => f.compositePixels);
			const durations = framesToProcess.map(() => fpsDuration);
			const videoBlob = await ExportEngine.toVideo(
				width,
				height,
				framesData,
				durations,
				scale,
				actualFormat as 'webm' | 'mp4',
				bgColor,
				includeBorders,
				updateProgress
			);

			const extension = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
			this.download(URL.createObjectURL(videoBlob), `rupa-video.${extension}`);
		} else if (actualFormat === 'gif') {
			const framesData = framesToProcess.map((f) => f.compositePixels);
			const durations = framesToProcess.map(() => fpsDuration);
			const gifBlob = await ExportEngine.toGIF(
				width,
				height,
				framesData,
				durations,
				scale,
				bgColor,
				includeBorders,
				updateProgress
			);
			this.download(URL.createObjectURL(gifBlob), `rupa-animation.gif`);
		} else {
			// Static Raster formats (PNG, JPG, WEBP)
			if (framesToProcess.length > 1) {
				// ZIP Strategy
				const JSZip = (await import('jszip')).default;
				const zip = new JSZip();

				for (let i = 0; i < framesToProcess.length; i++) {
					const frame = framesToProcess[i];
					const dataUrl = await ExportEngine.toRaster(
						width,
						height,
						frame.compositePixels,
						scale,
						actualFormat as any,
						bgColor,
						includeBorders
					);

					// Extract base64 part
					const base64Data = dataUrl.split(',')[1];
					zip.file(
						`${frame.name.toLowerCase().replace(/\s+/g, '-')}-${i}.${actualFormat}`,
						base64Data,
						{
							base64: true
						}
					);
					updateProgress((i + 1) / framesToProcess.length);
					await new Promise((r) => setTimeout(r, 0));
				}

				const zipBlob = await zip.generateAsync({ type: 'blob' });
				this.download(URL.createObjectURL(zipBlob), `rupa-export.zip`);
			} else {
				// Single Frame Raster
				const targetFrame = framesToProcess[0];
				const dataUrl = await ExportEngine.toRaster(
					width,
					height,
					targetFrame.compositePixels,
					scale,
					actualFormat as any,
					bgColor,
					includeBorders
				);
				this.download(dataUrl, `rupa-image.${actualFormat}`);
				updateProgress(1);
			}
		}
		editor.studio.exportProgress = 100;
		// Small delay to show 100% before closing
		await new Promise((r) => setTimeout(r, 300));
		editor.studio.showExportMenu = false;
		editor.studio.exportProgress = 0;
	}

	createArtifact(
		format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		return this.asyncCreateArtifact(format, scale, bgColor);
	}

	private download(url: string, filename: string) {
		const a = document.createElement('a');
		a.href = url;
		a.download = filename.toLowerCase().replace(/\s+/g, '-');
		a.click();
	}
}

export const services = new ServiceCoordinator();
