import { MovementService } from './services/movement.js';
import { DrawService } from './services/draw.js';
import { ManipulationService } from './services/manipulation.js';
import { ClipboardService } from './services/clipboard.js';
import { PersistenceService } from './services/persistence.js';
import { ProjectService } from './services/project.js';
import { SelectionService } from './services/selection.js';
import { ColorService } from './services/color.js';
/**
 * ServiceCoordinator: Unified access point for application services.
 * It provides a clean API for the UI while delegating to specialized services.
 */
export declare class ServiceCoordinator {
    private _movement;
    private _draw;
    private _manipulation;
    private _clipboard;
    private _persistence;
    private _project;
    private _selection;
    private _color;
    get movement(): MovementService;
    get draw(): DrawService;
    get manipulation(): ManipulationService;
    get clipboard(): ClipboardService;
    get persistence(): PersistenceService;
    get project(): ProjectService;
    get selection(): SelectionService;
    get color(): ColorService;
    moveCursor(dx: number, dy: number): boolean;
    jumpTo(tx: number, ty: number): void;
    jumpHome(): void;
    paint(): void;
    erase(): void;
    pickColor(): void;
    startSelection(): void;
    updateSelection(): void;
    commitSelection(): void;
    clearCanvas(): void;
    resizeCanvas(w: number, h: number): void;
    flipCanvas(axis: 'horizontal' | 'vertical'): void;
    rotateCanvas(): void;
    mergeLayerDown(): void;
    copy(): void;
    cut(): void;
    paste(): void;
    save(): void;
    load(): void;
    backup(): void;
    /**
     * Create a permanent artifact (PNG/SVG/JPG/WEBP/WEBM/GIF/MP4) and trigger download.
     */
    createArtifact(format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4', scale?: number, bgColor?: string | 'transparent'): Promise<void>;
    private download;
}
export declare const services: ServiceCoordinator;
