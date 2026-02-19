import { MovementService } from './services/movement.js';
import { DrawService } from './services/draw.js';
import { ManipulationService } from './services/manipulation.js';
import { ClipboardService } from './services/clipboard.js';
import { PersistenceService } from './services/persistence.js';
import { ProjectService } from './services/project.js';
import { SelectionService } from './services/selection.js';
import { ColorService } from './services/color.js';
import { editor } from '../state/editor.svelte.js';
import { history } from './history.js';
import { sfx } from './audio.js';
/**
 * ServiceCoordinator: Unified access point for application services.
 * It provides a clean API for the UI while delegating to specialized services.
 */
export class ServiceCoordinator {
    _movement = null;
    _draw = null;
    _manipulation = null;
    _clipboard = null;
    _persistence = null;
    _project = null;
    _selection = null;
    _color = null;
    get movement() {
        if (!this._movement)
            this._movement = new MovementService();
        return this._movement;
    }
    get draw() {
        if (!this._draw)
            this._draw = new DrawService();
        return this._draw;
    }
    get manipulation() {
        if (!this._manipulation)
            this._manipulation = new ManipulationService();
        return this._manipulation;
    }
    get clipboard() {
        if (!this._clipboard)
            this._clipboard = new ClipboardService();
        return this._clipboard;
    }
    get persistence() {
        if (!this._persistence)
            this._persistence = new PersistenceService();
        return this._persistence;
    }
    get project() {
        if (!this._project)
            this._project = new ProjectService();
        return this._project;
    }
    get selection() {
        if (!this._selection)
            this._selection = new SelectionService();
        return this._selection;
    }
    get color() {
        if (!this._color)
            this._color = new ColorService();
        return this._color;
    }
    // --- Navigation Aliases ---
    moveCursor(dx, dy) {
        return this.movement.move(dx, dy);
    }
    jumpTo(tx, ty) {
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
    resizeCanvas(w, h) {
        this.manipulation.resize(w, h);
    }
    flipCanvas(axis) {
        this.manipulation.flip(axis);
    }
    rotateCanvas() {
        this.manipulation.rotate();
    }
    mergeLayerDown() {
        this.project.mergeLayerDown();
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
    async createArtifact(format, scale = 10, bgColor = 'transparent') {
        editor.studio.show('Preparing Cup...');
        const { ExportEngine } = await import('./export.js');
        const { width, height, compositePixels } = editor.canvas;
        const includeBorders = editor.studio.includePixelBorders;
        const isAnimated = ['webm', 'gif', 'mp4'].includes(format);
        const actualFormat = editor.project.frames.length <= 1 && isAnimated ? 'png' : format;
        if (actualFormat === 'svg') {
            if (editor.project.frames.length > 1) {
                const framesData = editor.project.frames.map((f) => f.compositePixels);
                const durations = editor.project.frames.map((f) => f.duration);
                const svg = ExportEngine.toAnimatedSVG(width, height, framesData, durations, bgColor, includeBorders);
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                this.download(URL.createObjectURL(blob), `rupa-image.svg`);
            }
            else {
                const svg = ExportEngine.toSVG(width, height, compositePixels, bgColor, includeBorders);
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                this.download(URL.createObjectURL(blob), `rupa-image.svg`);
            }
        }
        else if (actualFormat === 'webm' || actualFormat === 'mp4') {
            const framesData = editor.project.frames.map((f) => f.compositePixels);
            const durations = editor.project.frames.map((f) => f.duration);
            const videoBlob = await ExportEngine.toVideo(width, height, framesData, durations, scale, actualFormat, bgColor, includeBorders);
            const extension = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
            this.download(URL.createObjectURL(videoBlob), `rupa-video.${extension}`);
        }
        else if (actualFormat === 'gif') {
            const framesData = editor.project.frames.map((f) => f.compositePixels);
            const durations = editor.project.frames.map((f) => f.duration);
            const gifBlob = await ExportEngine.toGIF(width, height, framesData, durations, scale, bgColor, includeBorders);
            this.download(URL.createObjectURL(gifBlob), `rupa-animation.gif`);
        }
        else {
            const dataUrl = await ExportEngine.toRaster(width, height, compositePixels, scale, actualFormat, bgColor, includeBorders);
            this.download(dataUrl, `rupa-image.${actualFormat}`);
        }
        editor.studio.showExportMenu = false;
    }
    download(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.toLowerCase().replace(/\s+/g, '-');
        a.click();
    }
}
export const services = new ServiceCoordinator();
