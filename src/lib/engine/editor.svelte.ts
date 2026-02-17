import { editor as state } from '../state/editor.svelte.js';
import { keyboard, type ActionIntent } from './keyboard.svelte.js';
import { input } from './input.svelte.js';
import { mode } from './mode.svelte.js';
import { services } from './services.js';
import { ambient } from './ambient.js';
import { animation } from './animation.svelte.js';
import { studioAudio } from './audioContext.js';
import { pointer } from './pointer.svelte.js';

/**
 * EditorEngine: The primary orchestrator of action execution.
 * It listens to normalized signals from the InputEngine and executes ServiceManager operations.
 */
export class EditorEngine {
	private backupInterval: any = null;
	private unsubscribeInput: (() => void) | null = null;

	mount(canvasElement: HTMLElement | null = null) {
		this.backupInterval = setInterval(() => services.persistence.backup(), 10 * 60 * 1000);

		state.studio.mount();
		ambient.start();

		this.unsubscribeInput = input.subscribe((signal) => {
			this.handleIntent(signal.intent as ActionIntent);
		});

		const cleanupInput = input.mount(window, canvasElement);

		return () => {
			if (this.unsubscribeInput) this.unsubscribeInput();
			cleanupInput();
			clearInterval(this.backupInterval);
		};
	}

	handleIntent(intent: ActionIntent) {
		studioAudio.resume();
		state.cursor.resetInactivityTimer();

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

			case 'PAINT':
				if (state.selection.isActive) return services.commitSelection();
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
				if ((pointer as any).isPointerDown) {
					pointer.cancel();
					return;
				}

				if (state.selection.isActive) {
					state.selection.clear();
					return;
				}
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

			case 'CLEAR_CANVAS':
				return services.manipulation.clearAll();
			case 'TOGGLE_MUTE':
				return state.studio.toggleMute();
			case 'SELECT_SAME':
				return services.selection.spiritPick();

			case 'FLIP_H':
				return services.manipulation.flip('horizontal');
			case 'FLIP_V':
				return services.manipulation.flip('vertical');
			case 'ROTATE':
				return services.manipulation.rotate();

			case 'NEW_FRAME':
				return services.project.addFrame();
			case 'DUPLICATE_FRAME':
				return services.project.duplicateFrame(state.project.activeFrameIndex);
			case 'NEXT_FRAME':
				return services.project.nextFrame();
			case 'PREV_FRAME':
				return services.project.prevFrame();
			case 'DELETE_FRAME':
				return services.project.removeFrame(state.project.activeFrameIndex);
			case 'TAB_TIMELINE':
				return (state.studio.projectActiveTab = 'frames');
			case 'TAB_LAYERS':
				return (state.studio.projectActiveTab = 'layers');

			case 'NEW_LAYER':
				return services.project.addLayer();
			case 'DUPLICATE_LAYER':
				return services.project.duplicateLayer(state.project.activeFrame.activeLayerIndex);
			case 'NEXT_LAYER':
				return services.project.nextLayer();
			case 'PREV_LAYER':
				return services.project.prevLayer();
			case 'DELETE_LAYER':
				return services.project.removeLayer(state.project.activeFrame.activeLayerIndex);
			case 'TOGGLE_LAYER_LOCK':
				return services.project.toggleLock();
			case 'TOGGLE_LAYER_VISIBILITY':
				return services.project.toggleVisibility();
			case 'MOVE_LAYER_UP':
				return services.project.moveLayerUp();
			case 'MOVE_LAYER_DOWN':
				return services.project.moveLayerDown();
			case 'MERGE_LAYERS':
				return services.project.mergeLayerDown();

			default:
				if (intent.startsWith('SELECT_COLOR_')) {
					const num = parseInt(intent.split('_')[2]);
					return services.color.select(num === 0 ? 9 : num - 1);
				}
		}
	}

	private executeMove(dx: number, dy: number) {
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
}

export const editor = new EditorEngine();
