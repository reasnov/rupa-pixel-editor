import { __ } from '$lib/state/i18n.svelte.js';
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
import { StorageLogic } from '../logic/storage.js';

/**
 * EditorEngine: The primary orchestrator of action execution.
 */
export class EditorEngine {
	private backupInterval: any = null;
	private autoSaveTimer: any = null;
	private unsubscribeInput: (() => void) | null = null;

	mount() {
		this.backupInterval = setInterval(() => services.persistence.backup(), 10 * 60 * 1000);

		state.studio.mount();
		state.canvas.mount();
		ambient.start();

		// Link Pointer activity to Editor logic (No circular import)
		pointer.onActivity = () => {
			state.cursor.resetInactivityTimer();
			this.resetAutoSaveTimer();
		};

		// Check for recoverable session (v0.9.3)
		import('./services/persistence.js').then(async ({ PersistenceService }) => {
			const persistence = new PersistenceService();
			const hasBackup = await StorageLogic.loadProject('autosave_session');
			if (hasBackup && hasBackup.length > 1000) {
				// Only show prompt if backup exists and is not an empty/tiny file
				state.studio.showRecoveryPrompt = true;
			}
			persistence.loadGlobalPalettes();
		});

		this.unsubscribeInput = input.subscribe((signal) => {
			this.handleIntent(signal.intent as ActionIntent);
		});

		const cleanupInput = input.mount(window);

		return () => {
			if (this.unsubscribeInput) this.unsubscribeInput();
			cleanupInput();
			clearInterval(this.backupInterval);
			if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
		};
	}

	/**
	 * Connects the physical canvas element to the input engine.
	 */
	connectCanvas(el: HTMLElement) {
		return input.bindCanvas(el);
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

		if (this.handleNavigationIntent(intent)) return;
		if (this.handleDrawIntent(intent)) return;
		if (this.handleSelectionIntent(intent)) return;
		if (this.handleProjectIntent(intent)) return;
		if (this.handleViewportIntent(intent)) return;
		if (this.handleToolSettingsIntent(intent)) return;
		if (this.handleSystemIntent(intent)) return;
	}

	private handleNavigationIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'MOVE_UP':
				this.executeMove(0, -1);
				return true;
			case 'MOVE_DOWN':
				this.executeMove(0, 1);
				return true;
			case 'MOVE_LEFT':
				this.executeMove(-1, 0);
				return true;
			case 'MOVE_RIGHT':
				this.executeMove(1, 0);
				return true;
			case 'JUMP_HOME':
				services.jumpHome();
				return true;
			case 'GOTO':
				state.showGoTo = true;
				return true;
			case 'RESET_PAN':
				state.studio.resetPan();
				feedback.emit('READY');
				return true;
		}
		return false;
	}

	private handleDrawIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'PAINT':
				if (state.selection.isActive) {
					services.selection.fillSelection();
				} else if (state.studio.activeTool !== 'BRUSH') {
					services.draw.commitShape();
				} else {
					services.draw.draw();
				}
				return true;
			case 'ERASE':
				if (state.selection.isActive) {
					services.selection.eraseSelection();
				} else {
					services.draw.erase();
				}
				return true;
			case 'FLOOD_FILL':
				services.color.floodFill();
				return true;
			case 'PICK_COLOR':
				services.color.pickFromCanvas();
				return true;
			case 'RECOLOR':
				services.manipulation.recolorAll();
				return true;
		}
		return false;
	}

	private handleSelectionIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'BIND_VERTEX':
				services.selection.addVertex(state.cursor.pos.x, state.cursor.pos.y);
				return true;
			case 'SEAL_BINDING':
				if (state.selection.vertices.length >= 3) {
					services.selection.commitPolygon();
				} else if (state.selection.isActive) {
					services.selection.commit();
				} else if (state.studio.activeTool !== 'BRUSH') {
					services.draw.commitShape();
				} else {
					services.draw.draw();
				}
				return true;
			case 'COPY':
				services.clipboard.copy();
				return true;
			case 'CUT':
				services.clipboard.cut();
				return true;
			case 'PASTE':
				services.clipboard.paste();
				return true;
			case 'SELECT_ALL':
				services.selection.selectAll();
				return true;
			case 'SELECT_SAME':
				services.selection.magicWand();
				return true;
		}
		return false;
	}

	private handleProjectIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'UNDO':
				state.undo();
				return true;
			case 'REDO':
				state.redo();
				return true;
			case 'SAVE':
				state.showPersistenceMenu = true;
				return true;
			case 'OPEN':
				services.persistence.load();
				return true;
			case 'NEW_ITEM':
				if (state.studio.projectActiveTab === 'frames') services.project.addFrame();
				else services.project.addLayer();
				return true;
			case 'NEW_LAYER_GROUP':
				services.project.addGroup();
				return true;
			case 'DUPLICATE_ITEM':
				if (state.studio.projectActiveTab === 'frames')
					services.project.duplicateFrame(state.project.activeFrameIndex);
				else services.project.duplicateLayer(state.project.activeFrame.activeLayerIndex);
				return true;
			case 'DELETE_ITEM':
				if (state.studio.projectActiveTab === 'frames')
					services.project.removeFrame(state.project.activeFrameIndex);
				else services.project.removeLayer(state.project.activeFrame.activeLayerIndex);
				return true;
			case 'TOGGLE_LAYER_LOCK':
				services.project.toggleLock();
				return true;
			case 'TOGGLE_LAYER_VISIBILITY':
				services.project.toggleVisibility();
				return true;
			case 'MOVE_ITEM_UP':
				if (state.studio.projectActiveTab === 'frames') {
					const cur = state.project.activeFrameIndex;
					if (cur < state.project.frames.length - 1) services.project.reorderFrame(cur, cur + 1);
				} else services.project.moveLayerUp();
				return true;
			case 'MOVE_ITEM_DOWN':
				if (state.studio.projectActiveTab === 'frames') {
					const cur = state.project.activeFrameIndex;
					if (cur > 0) services.project.reorderFrame(cur, cur - 1);
				} else services.project.moveLayerDown();
				return true;
			case 'MOVE_ITEM_TOP':
				if (state.studio.projectActiveTab === 'frames')
					services.project.reorderFrame(
						state.project.activeFrameIndex,
						state.project.frames.length - 1
					);
				else services.project.moveLayerToTop();
				return true;
			case 'MOVE_ITEM_BOTTOM':
				if (state.studio.projectActiveTab === 'frames')
					services.project.reorderFrame(state.project.activeFrameIndex, 0);
				else services.project.moveLayerToBottom();
				return true;
			case 'MERGE_LAYERS':
				services.project.mergeLayerDown();
				return true;
			case 'MERGE_SELECTED_LAYERS':
				services.project.mergeSelectedLayers();
				return true;
			case 'MERGE_FRAMES':
				services.project.mergeFrames();
				return true;
			case 'PLAY_PAUSE':
				animation.togglePlayback();
				return true;
			case 'TOGGLE_GHOST_LAYERS':
				state.showGhostLayers = !state.showGhostLayers;
				return true;
		}
		return false;
	}

	private handleViewportIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'ZOOM_IN':
				state.studio.setZoom(0.1);
				return true;
			case 'ZOOM_OUT':
				state.studio.setZoom(-0.1);
				return true;
			case 'RESET_ZOOM':
				state.studio.resetZoom();
				return true;
			case 'RESET_VIEWPORT':
				state.studio.resetZoom();
				state.studio.resetPan();
				feedback.emit('READY');
				return true;
			case 'FLIP_H':
				services.manipulation.flip('horizontal');
				return true;
			case 'FLIP_V':
				services.manipulation.flip('vertical');
				return true;
			case 'ROTATE':
				services.manipulation.rotate();
				return true;
			case 'TAB_TIMELINE':
				state.studio.projectActiveTab = 'frames';
				feedback.emit('READY');
				return true;
			case 'TAB_LAYERS':
				state.studio.projectActiveTab = 'layers';
				feedback.emit('READY');
				return true;
		}
		return false;
	}

	private handleToolSettingsIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'BRUSH_SIZE_INC':
				state.studio.brushSize = Math.min(100, state.studio.brushSize + 1);
				feedback.emit('READY');
				return true;
			case 'BRUSH_SIZE_DEC':
				state.studio.brushSize = Math.max(1, state.studio.brushSize - 1);
				feedback.emit('READY');
				return true;
			case 'TOGGLE_PATTERN_BRUSH':
				if (state.studio.isPatternBrushActive) {
					state.studio.isPatternBrushActive = false;
				} else if (state.project.clipboard) {
					const cb = state.project.clipboard;
					state.studio.patternBrushData = {
						width: cb.width,
						height: cb.height,
						data: new Uint32Array(cb.data)
					};
					state.studio.isPatternBrushActive = true;
				}
				feedback.emit('READY');
				return true;
			case 'TOGGLE_BRUSH_SHAPE':
				state.studio.brushShape = state.studio.brushShape === 'SQUARE' ? 'CIRCLE' : 'SQUARE';
				feedback.emit('READY');
				return true;
			case 'TOGGLE_AIRBRUSH':
				state.studio.isAirbrushActive = !state.studio.isAirbrushActive;
				state.studio.show(
					__(state.studio.isAirbrushActive ? 'ui:studio.mist_active' : 'ui:studio.mist_off')
				);
				feedback.emit('READY');
				return true;
			case 'TOGGLE_PIXEL_PERFECT':
				state.studio.isPixelPerfect = !state.studio.isPixelPerfect;
				feedback.emit('READY');
				return true;
			case 'TOGGLE_DITHER_BLEND':
				state.studio.isDitherBlendActive = !state.studio.isDitherBlendActive;
				state.studio.show(
					__(state.studio.isDitherBlendActive ? 'ui:studio.blend_on' : 'ui:studio.blend_off')
				);
				feedback.emit('READY');
				return true;
			case 'TOGGLE_SHADE_LIGHTEN':
			case 'SHADE_LIGHTEN':
				state.studio.isShadingLighten = !state.studio.isShadingLighten;
				if (state.studio.isShadingLighten) {
					state.studio.isShadingDarken = false;
					state.studio.isShadingDither = false;
				}
				state.studio.show(
					__(
						state.studio.isShadingLighten
							? 'ui:studio.light_roast_active'
							: 'ui:studio.light_roast_off'
					)
				);
				feedback.emit('READY');
				return true;
			case 'TOGGLE_SHADE_DARKEN':
			case 'SHADE_DARKEN':
				state.studio.isShadingDarken = !state.studio.isShadingDarken;
				if (state.studio.isShadingDarken) {
					state.studio.isShadingLighten = false;
					state.studio.isShadingDither = false;
				}
				state.studio.show(
					__(
						state.studio.isShadingDarken
							? 'ui:studio.dark_roast_active'
							: 'ui:studio.dark_roast_off'
					)
				);
				feedback.emit('READY');
				return true;
			case 'TOGGLE_SHADE_DITHER':
			case 'SHADE_DITHER':
				state.studio.isShadingDither = !state.studio.isShadingDither;
				if (state.studio.isShadingDither) {
					state.studio.isShadingLighten = false;
					state.studio.isShadingDarken = false;
				}
				state.studio.show(
					__(state.studio.isShadingDither ? 'ui:studio.texture_active' : 'ui:studio.texture_off')
				);
				feedback.emit('READY');
				return true;
			case 'TOGGLE_COLOR_LOCK':
				if (state.studio.isColorLocked) {
					state.studio.isColorLocked = false;
					state.studio.colorLockSource = null;
				} else {
					state.studio.isColorLocked = true;
					const val = state.canvas.getColor(state.cursor.pos.x, state.cursor.pos.y);
					state.studio.colorLockSource = ColorLogic.uint32ToHex(val);
				}
				feedback.emit('READY');
				return true;
			case 'POLY_SIDES_INC':
				state.studio.polygonSides = Math.min(12, state.studio.polygonSides + 1);
				state.studio.show(
					__('ui:studio.facets', { replace: { count: state.studio.polygonSides } })
				);
				feedback.emit('READY');
				return true;
			case 'POLY_SIDES_DEC':
				state.studio.polygonSides = Math.max(3, state.studio.polygonSides - 1);
				state.studio.show(
					__('ui:studio.facets', { replace: { count: state.studio.polygonSides } })
				);
				feedback.emit('READY');
				return true;
			case 'POLY_INDENT_INC':
				state.studio.polygonIndentation = Math.min(100, state.studio.polygonIndentation + 10);
				state.studio.show(
					__('ui:studio.steeping', { replace: { count: state.studio.polygonIndentation } })
				);
				feedback.emit('READY');
				return true;
			case 'POLY_INDENT_DEC':
				state.studio.polygonIndentation = Math.max(0, state.studio.polygonIndentation - 10);
				state.studio.show(
					__('ui:studio.steeping', { replace: { count: state.studio.polygonIndentation } })
				);
				feedback.emit('READY');
				return true;
		}
		return false;
	}

	private handleSystemIntent(intent: ActionIntent): boolean {
		switch (intent) {
			case 'OPEN_MENU':
				state.showCommandPalette = !state.showCommandPalette;
				return true;
			case 'OPEN_SETTINGS':
				state.showCanvasSettings = !state.showCanvasSettings;
				return true;
			case 'OPEN_PALETTE':
				state.showColorPicker = !state.showColorPicker;
				return true;
			case 'OPEN_AUDIO':
				state.showAudioSettings = !state.showAudioSettings;
				return true;
			case 'OPEN_EXPORT':
				state.showExportMenu = true;
				return true;
			case 'OPEN_HELP':
				state.showShortcuts = true;
				return true;
			case 'OPEN_MANUAL':
				state.showManual = true;
				return true;
			case 'ESCAPE':
				state.handleEscape();
				return true;
			case 'CLEAR_CANVAS':
				services.manipulation.clearAll();
				return true;
			case 'TOGGLE_MUTE':
				state.studio.toggleMute();
				return true;
			case 'TOGGLE_MINIMAP':
				state.studio.showMinimap = !state.studio.showMinimap;
				feedback.emit('READY');
				return true;
			case 'TOGGLE_HAND_TOOL':
				state.studio.isHandToolActive = !state.studio.isHandToolActive;
				feedback.emit('READY');
				return true;
			case 'CYCLE_SYMMETRY':
				const modes: Array<'OFF' | 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'> = [
					'OFF',
					'HORIZONTAL',
					'VERTICAL',
					'QUADRANT'
				];
				const currentIdx = modes.indexOf(state.studio.symmetryMode);
				state.studio.symmetryMode = modes[(currentIdx + 1) % modes.length];
				feedback.emit('READY');
				return true;
			case 'TOGGLE_TILING':
				state.studio.isTilingEnabled = !state.studio.isTilingEnabled;
				feedback.emit('READY');
				return true;
			case 'TOGGLE_ALPHA_LOCK':
				state.studio.isAlphaLocked = !state.studio.isAlphaLocked;
				feedback.emit('READY');
				return true;
			case 'TOGGLE_UNDERLAY':
				state.studio.isUnderlayVisible = !state.studio.isUnderlayVisible;
				feedback.emit('READY');
				return true;
			case 'OPEN_UNDERLAY_MENU':
				state.studio.showUnderlayMenu = !state.studio.showUnderlayMenu;
				feedback.emit('READY');
				return true;
			case 'TOOL_RECTANGLE':
				state.studio.activeTool = 'RECTANGLE';
				state.studio.shapeAnchor = { ...state.cursor.pos };
				feedback.emit('READY');
				return true;
			case 'TOOL_ELLIPSE':
				state.studio.activeTool = 'ELLIPSE';
				state.studio.shapeAnchor = { ...state.cursor.pos };
				feedback.emit('READY');
				return true;
			case 'TOOL_POLYGON':
				state.studio.activeTool = 'POLYGON';
				state.studio.shapeAnchor = { ...state.cursor.pos };
				feedback.emit('READY');
				return true;
			case 'TOOL_RECT_SELECT':
				state.studio.activeTool = 'RECT_SELECT';
				feedback.emit('READY');
				return true;
			case 'TOOL_LASSO_SELECT':
				state.studio.activeTool = 'LASSO_SELECT';
				feedback.emit('READY');
				return true;
			case 'TOOL_POLY_SELECT':
				state.studio.activeTool = 'POLY_SELECT';
				feedback.emit('READY');
				return true;
			case 'TOOL_BRUSH':
				state.studio.activeTool = 'BRUSH';
				feedback.emit('READY');
				return true;
			case 'TOOL_ERASER':
				state.studio.activeTool = 'ERASER';
				feedback.emit('READY');
				return true;
			case 'TOOL_TRANSFORM':
				if (state.selection.isActive) {
					state.studio.isTransforming = !state.studio.isTransforming;
					feedback.emit('READY');
				}
				return true;
		}

		if (intent.startsWith('SET_SIDES_')) {
			const num = parseInt(intent.split('_')[2]);
			state.studio.polygonSides = num;
			state.studio.show(__('ui:studio.facets', { replace: { count: num } }));
			feedback.emit('READY');
			return true;
		}
		if (intent.startsWith('SELECT_COLOR_')) {
			const num = parseInt(intent.split('_')[2]);
			services.color.select(num === 0 ? 9 : num - 1);
			return true;
		}

		return false;
	}

	private executeMove(dx: number, dy: number) {
		if (state.studio.isTransforming && state.selection.isActive) {
			services.selection.nudge(dx, dy);
			return;
		}

		// Priority 1: Continuous Erasing (Stream Sweeping) - Ctrl + Shift
		const isEraseFlow = keyboard.isCtrlActive && keyboard.isShiftActive;
		// Priority 2: Continuous Painting (Stream Painting) - Ctrl
		const isPaintFlow = keyboard.isCtrlActive && !keyboard.isShiftActive;
		// Priority 3: Rectangle Selection - Shift (without Ctrl)
		const isSelecting = keyboard.isShiftActive && !keyboard.isCtrlActive;

		if (isSelecting && !state.selection.start) {
			state.studio.activeTool = 'RECT_SELECT';
			services.selection.begin(state.cursor.pos.x, state.cursor.pos.y);
		}

		if (services.movement.move(dx, dy)) {
			if (isSelecting) {
				services.selection.update(state.cursor.pos.x, state.cursor.pos.y);
			} else if (isEraseFlow) {
				services.draw.erase();
			} else if (isPaintFlow) {
				services.draw.draw();
			}
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
