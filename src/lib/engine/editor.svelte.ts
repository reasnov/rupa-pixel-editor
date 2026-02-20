import { editor as state } from '../state/editor.svelte.js';
import { keyboard, type ActionIntent } from './keyboard.svelte.js';
import { input } from './input.svelte.js';
import { mode } from './mode.svelte.js';
import { services } from './services.js';
import { ambient } from './ambient.js';
import { animation } from './animation.svelte.js';
import { studioAudio } from './audioContext.js';
import { pointer } from './pointer.svelte.js';
import { feedback } from './feedback.svelte.js';
import { history } from './history.js';
import { ColorLogic } from '../logic/color.js';
import { Geometry } from '../logic/geometry.js';
import { PixelLogic } from '../logic/pixel.js';

/**
 * EditorEngine: The primary orchestrator of action execution.
 */
export class EditorEngine {
	private backupInterval: any = null;
	private autoSaveTimer: any = null;
	private unsubscribeInput: (() => void) | null = null;

	mount(canvasElement: HTMLElement | null = null) {
		this.backupInterval = setInterval(() => services.persistence.backup(), 10 * 60 * 1000);

		state.studio.mount();
		state.canvas.mount();
		ambient.start();

		// Attempt to restore last session
		services.persistence.restoreLastSession();
		services.persistence.loadGlobalPalettes();

		this.unsubscribeInput = input.subscribe((signal) => {
			this.handleIntent(signal.intent as ActionIntent);
		});

		const cleanupInput = input.mount(window, canvasElement);

		return () => {
			if (this.unsubscribeInput) this.unsubscribeInput();
			cleanupInput();
			clearInterval(this.backupInterval);
			if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
		};
	}

	handleIntent(intent: ActionIntent) {
		studioAudio.resume();
		state.cursor.resetInactivityTimer();
		this.resetAutoSaveTimer();

		// Special Case: Underlay Nudging (Ctrl + Alt + Arrows)
		if (
			keyboard.isCtrlActive &&
			keyboard.isAltActive &&
			['MOVE_UP', 'MOVE_DOWN', 'MOVE_LEFT', 'MOVE_RIGHT'].includes(intent)
		) {
			const dx = intent === 'MOVE_LEFT' ? -1 : intent === 'MOVE_RIGHT' ? 1 : 0;
			const dy = intent === 'MOVE_UP' ? -1 : intent === 'MOVE_DOWN' ? 1 : 0;
			state.studio.underlayOffset.x += dx;
			state.studio.underlayOffset.y += dy;
			return;
		}

		switch (intent) {
			case 'MOVE_UP':
				return this.executeMove(0, -1);
			case 'MOVE_DOWN':
				return this.executeMove(0, 1);
			case 'MOVE_LEFT':
				return this.executeMove(-1, 0);
			case 'MOVE_RIGHT':
				return this.executeMove(1, 0);
			case 'JUMP_HOME':
				return services.jumpHome();
			case 'GOTO':
				return (state.showGoTo = true);
			case 'RESET_PAN':
				state.studio.resetPan();
				return feedback.emit('READY');

			case 'PAINT':
				if (state.selection.isActive) return services.commitSelection();
				if (state.studio.activeTool !== 'BRUSH') {
					services.draw.commitShape();
					return;
				}
				return services.draw.draw();

			case 'ERASE':
				return services.draw.erase();
			case 'FLOOD_FILL':
				return services.color.floodFill();
			case 'BIND_VERTEX':
				return services.selection.addVertex(state.cursor.pos.x, state.cursor.pos.y);
			case 'SEAL_BINDING':
				if (state.selection.vertices.length >= 3) {
					return services.selection.sealBinding();
				}
				if (state.selection.isActive) return services.commitSelection();
				if (state.studio.activeTool !== 'BRUSH') {
					services.draw.commitShape();
					return;
				}
				return services.draw.draw();
			case 'PICK_COLOR':
				return services.color.pickFromCanvas();

			case 'COPY':
				return services.clipboard.copy();
			case 'CUT':
				return services.clipboard.cut();
			case 'PASTE':
				return services.clipboard.paste();
			case 'RECOLOR':
				return services.manipulation.bleach();

			case 'UNDO':
				return state.undo();
			case 'REDO':
				return state.redo();
			case 'SAVE':
				return (state.showPersistenceMenu = true);
			case 'OPEN':
				return services.persistence.load();

			case 'OPEN_MENU':
				return (state.showCommandPalette = !state.showCommandPalette);
			case 'OPEN_SETTINGS':
				return (state.showCanvasSettings = !state.showCanvasSettings);

			case 'ESCAPE':
				return state.handleEscape();

			case 'OPEN_PALETTE':
				return (state.showColorPicker = !state.showColorPicker);
			case 'OPEN_AUDIO':
				return (state.showAudioSettings = !state.showAudioSettings);
			case 'OPEN_EXPORT':
				return (state.showExportMenu = true);
			case 'OPEN_HELP':
				return (state.showGuideMenu = true);
			case 'OPEN_MANUAL':
				return (state.showGuideBook = true);
			case 'PLAY_PAUSE':
				return animation.togglePlayback();
			case 'TOGGLE_GHOST_LAYERS':
				return (state.showGhostLayers = !state.showGhostLayers);

			case 'ZOOM_IN':
				return state.studio.setZoom(0.1);
			case 'ZOOM_OUT':
				return state.studio.setZoom(-0.1);
			case 'RESET_ZOOM':
				return state.studio.resetZoom();
			case 'RESET_VIEWPORT':
				state.studio.resetZoom();
				state.studio.resetPan();
				return feedback.emit('READY');

			case 'CLEAR_CANVAS':
				return services.manipulation.clearAll();
			case 'TOGGLE_MUTE':
				return state.studio.toggleMute();
			case 'TOGGLE_MINIMAP':
				state.studio.showMinimap = !state.studio.showMinimap;
				return feedback.emit('READY');
			case 'SELECT_SAME':
				return services.selection.spiritPick();

			case 'FLIP_H':
				return services.manipulation.flip('horizontal');
			case 'FLIP_V':
				return services.manipulation.flip('vertical');
			case 'ROTATE':
				return services.manipulation.rotate();

			case 'TAB_TIMELINE':
				state.studio.projectActiveTab = 'frames';
				return feedback.emit('READY');
			case 'TAB_LAYERS':
				state.studio.projectActiveTab = 'layers';
				return feedback.emit('READY');

			case 'NEW_ITEM':
				if (state.studio.projectActiveTab === 'frames') return services.project.addFrame();
				return services.project.addLayer();
			case 'NEW_LAYER_GROUP':
				return services.project.addGroup();
			case 'DUPLICATE_ITEM':
				if (state.studio.projectActiveTab === 'frames')
					return services.project.duplicateFrame(state.project.activeFrameIndex);
				return services.project.duplicateLayer(state.project.activeFrame.activeLayerIndex);
			case 'DELETE_ITEM':
				if (state.studio.projectActiveTab === 'frames')
					return services.project.removeFrame(state.project.activeFrameIndex);
				return services.project.removeLayer(state.project.activeFrame.activeLayerIndex);
			case 'TOGGLE_LAYER_LOCK':
				return services.project.toggleLock();
			case 'TOGGLE_LAYER_VISIBILITY':
				return services.project.toggleVisibility();
			case 'MOVE_ITEM_UP':
				if (state.studio.projectActiveTab === 'frames') {
					const cur = state.project.activeFrameIndex;
					if (cur < state.project.frames.length - 1) services.project.reorderFrame(cur, cur + 1);
				} else {
					services.project.moveLayerUp();
				}
				return;
			case 'MOVE_ITEM_DOWN':
				if (state.studio.projectActiveTab === 'frames') {
					const cur = state.project.activeFrameIndex;
					if (cur > 0) services.project.reorderFrame(cur, cur - 1);
				} else {
					services.project.moveLayerDown();
				}
				return;
			case 'MOVE_ITEM_TOP':
				if (state.studio.projectActiveTab === 'frames') {
					services.project.reorderFrame(
						state.project.activeFrameIndex,
						state.project.frames.length - 1
					);
				} else {
					services.project.moveLayerToTop();
				}
				return;
			case 'MOVE_ITEM_BOTTOM':
				if (state.studio.projectActiveTab === 'frames') {
					services.project.reorderFrame(state.project.activeFrameIndex, 0);
				} else {
					services.project.moveLayerToBottom();
				}
				return;
			case 'MERGE_LAYERS':
				return services.project.mergeLayerDown();

			case 'BRUSH_SIZE_INC':
				state.studio.brushSize = Math.min(100, state.studio.brushSize + 1);
				return feedback.emit('READY');
			case 'BRUSH_SIZE_DEC':
				state.studio.brushSize = Math.max(1, state.studio.brushSize - 1);
				return feedback.emit('READY');
			case 'TOGGLE_PATTERN_BRUSH':
				if (state.studio.isPatternBrushActive) {
					state.studio.isPatternBrushActive = false;
				} else if (state.project.clipboard) {
					const cb = state.project.clipboard;
					const u32 = new Uint32Array(cb.data.length);
					for (let i = 0; i < cb.data.length; i++) {
						u32[i] = cb.data[i];
					}
					state.studio.patternBrushData = {
						width: cb.width,
						height: cb.height,
						data: u32
					};
					state.studio.isPatternBrushActive = true;
				}
				return feedback.emit('READY');
			case 'TOGGLE_BRUSH_SHAPE':
				state.studio.brushShape = state.studio.brushShape === 'SQUARE' ? 'CIRCLE' : 'SQUARE';
				return feedback.emit('READY');
			case 'TOGGLE_HAND_TOOL':
				state.studio.isHandToolActive = !state.studio.isHandToolActive;
				return feedback.emit('READY');
			case 'CYCLE_SYMMETRY':
				const modes: Array<'OFF' | 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'> = [
					'OFF',
					'HORIZONTAL',
					'VERTICAL',
					'QUADRANT'
				];
				const currentIdx = modes.indexOf(state.studio.symmetryMode);
				state.studio.symmetryMode = modes[(currentIdx + 1) % modes.length];
				return feedback.emit('READY');
			case 'TOGGLE_TILING':
				state.studio.isTilingEnabled = !state.studio.isTilingEnabled;
				return feedback.emit('READY');
			case 'TOGGLE_AIRBRUSH':
				state.studio.isAirbrushActive = !state.studio.isAirbrushActive;
				state.studio.show(state.studio.isAirbrushActive ? 'Mist Active' : 'Mist Off');
				return feedback.emit('READY');
			case 'TOGGLE_ALPHA_LOCK':
				state.studio.isAlphaLocked = !state.studio.isAlphaLocked;
				return feedback.emit('READY');
			case 'TOGGLE_PIXEL_PERFECT':
				state.studio.isPixelPerfect = !state.studio.isPixelPerfect;
				return feedback.emit('READY');
			case 'TOGGLE_SHADE_LIGHTEN':
				state.studio.isShadingLighten = !state.studio.isShadingLighten;
				if (state.studio.isShadingLighten) {
					state.studio.isShadingDarken = false;
					state.studio.isShadingDither = false;
				}
				state.studio.show(state.studio.isShadingLighten ? 'Light Roast Active' : 'Light Roast Off');
				return feedback.emit('READY');
			case 'TOGGLE_SHADE_DARKEN':
				state.studio.isShadingDarken = !state.studio.isShadingDarken;
				if (state.studio.isShadingDarken) {
					state.studio.isShadingLighten = false;
					state.studio.isShadingDither = false;
				}
				state.studio.show(state.studio.isShadingDarken ? 'Dark Roast Active' : 'Dark Roast Off');
				return feedback.emit('READY');
			case 'TOGGLE_SHADE_DITHER':
				state.studio.isShadingDither = !state.studio.isShadingDither;
				if (state.studio.isShadingDither) {
					state.studio.isShadingLighten = false;
					state.studio.isShadingDarken = false;
				}
				state.studio.show(state.studio.isShadingDither ? 'Texture Active' : 'Texture Off');
				return feedback.emit('READY');

			case 'SHADE_LIGHTEN':
				state.studio.isShadingLighten = !state.studio.isShadingLighten;
				if (state.studio.isShadingLighten) {
					state.studio.isShadingDarken = false;
					state.studio.isShadingDither = false;
				}
				state.studio.show(state.studio.isShadingLighten ? 'Light Roast Active' : 'Light Roast Off');
				return feedback.emit('READY');
			case 'SHADE_DARKEN':
				state.studio.isShadingDarken = !state.studio.isShadingDarken;
				if (state.studio.isShadingDarken) {
					state.studio.isShadingLighten = false;
					state.studio.isShadingDither = false;
				}
				state.studio.show(state.studio.isShadingDarken ? 'Dark Roast Active' : 'Dark Roast Off');
				return feedback.emit('READY');
			case 'SHADE_DITHER':
				state.studio.isShadingDither = !state.studio.isShadingDither;
				if (state.studio.isShadingDither) {
					state.studio.isShadingLighten = false;
					state.studio.isShadingDarken = false;
				}
				state.studio.show(state.studio.isShadingDither ? 'Texture Active' : 'Texture Off');
				return feedback.emit('READY');

			case 'TOGGLE_COLOR_LOCK':
				if (state.studio.isColorLocked) {
					state.studio.isColorLocked = false;
					state.studio.colorLockSource = null;
				} else {
					state.studio.isColorLocked = true;
					const val = state.canvas.getColor(state.cursor.pos.x, state.cursor.pos.y);
					state.studio.colorLockSource = ColorLogic.uint32ToHex(val);
				}
				return feedback.emit('READY');

			case 'TOGGLE_UNDERLAY':
				state.studio.isUnderlayVisible = !state.studio.isUnderlayVisible;
				return feedback.emit('READY');
			case 'OPEN_UNDERLAY_MENU':
				state.studio.showUnderlayMenu = !state.studio.showUnderlayMenu;
				return feedback.emit('READY');

			case 'TOOL_RECTANGLE':
				state.studio.activeTool = 'RECTANGLE';
				state.studio.shapeAnchor = { ...state.cursor.pos };
				return feedback.emit('READY');
			case 'TOOL_ELLIPSE':
				state.studio.activeTool = 'ELLIPSE';
				state.studio.shapeAnchor = { ...state.cursor.pos };
				return feedback.emit('READY');
			case 'TOOL_BRUSH':
				state.studio.activeTool = 'BRUSH';
				return feedback.emit('READY');
			case 'TOOL_ERASER':
				state.studio.activeTool = 'ERASER';
				return feedback.emit('READY');
			case 'TOOL_SELECT':
				state.studio.activeTool = 'SELECT';
				return feedback.emit('READY');
			case 'TOOL_POLYGON':
				state.studio.activeTool = 'POLYGON';
				state.studio.shapeAnchor = { ...state.cursor.pos };
				return feedback.emit('READY');
			case 'POLY_SIDES_INC':
				state.studio.polygonSides = Math.min(12, state.studio.polygonSides + 1);
				state.studio.show(`${state.studio.polygonSides} Facets`);
				return feedback.emit('READY');
			case 'POLY_SIDES_DEC':
				state.studio.polygonSides = Math.max(3, state.studio.polygonSides - 1);
				state.studio.show(`${state.studio.polygonSides} Facets`);
				return feedback.emit('READY');
			case 'POLY_INDENT_INC':
				state.studio.polygonIndentation = Math.min(100, state.studio.polygonIndentation + 10);
				state.studio.show(`${state.studio.polygonIndentation}% Steeping`);
				return feedback.emit('READY');
			case 'POLY_INDENT_DEC':
				state.studio.polygonIndentation = Math.max(0, state.studio.polygonIndentation - 10);
				state.studio.show(`${state.studio.polygonIndentation}% Steeping`);
				return feedback.emit('READY');
			case 'TOGGLE_DITHER_BLEND':
				state.studio.isDitherBlendActive = !state.studio.isDitherBlendActive;
				state.studio.show(
					state.studio.isDitherBlendActive ? 'Classic Blend ON' : 'Classic Blend OFF'
				);
				return feedback.emit('READY');
			case 'TOOL_TRANSFORM':
				if (state.selection.isActive) {
					state.studio.isTransforming = !state.studio.isTransforming;
					return feedback.emit('READY');
				}
				return;

			default:
				if (intent.startsWith('SET_SIDES_')) {
					const num = parseInt(intent.split('_')[2]);
					state.studio.polygonSides = num;
					state.studio.show(`${num} Facets`);
					return feedback.emit('READY');
				}
				if (intent.startsWith('SELECT_COLOR_')) {
					const num = parseInt(intent.split('_')[2]);
					return services.color.select(num === 0 ? 9 : num - 1);
				}
		}
	}

	private executeMove(dx: number, dy: number) {
		if (state.studio.isTransforming && state.selection.isActive) {
			services.selection.nudge(dx, dy);
			return;
		}

		if (services.movement.move(dx, dy)) {
			const currentMode = mode.current.type;
			if (currentMode === 'SELECT') {
				if (!state.selection.isActive) services.startSelection();
				services.updateSelection();
			}
			if (currentMode === 'PAINT') services.draw.draw();
			if (currentMode === 'ERASE') services.draw.erase();
		}
	}

	resetAutoSaveTimer() {
		if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
		this.autoSaveTimer = setTimeout(() => {
			services.persistence.autoSaveSession();
		}, 10000); // 10 seconds of inactivity
	}
}

export const editor = new EditorEngine();
