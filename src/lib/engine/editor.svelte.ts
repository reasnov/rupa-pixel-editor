import { editor as state } from '../state/editor.svelte.js';
import { keyboard, type ActionIntent } from './keyboard.svelte.js';
import { synapse } from './synapse.svelte.js';
import { mode } from './mode.svelte.js';
import { shuttle } from './shuttle.js';
import { ambient } from './ambient.js';
import { chronos } from './chronos.svelte.js';
import { studioAudio } from './audioContext.js';
import { pointer } from './pointer.svelte.js';

/**
 * EditorEngine: The primary orchestrator of action execution.
 * It listens to normalized signals from the SynapseEngine and executes ShuttleEngine operations.
 */
export class EditorEngine {
	private backupInterval: any = null;
	private unsubscribeSynapse: (() => void) | null = null;

	mount(canvasElement: HTMLElement | null = null) {
		this.backupInterval = setInterval(() => shuttle.persistence.backup(), 10 * 60 * 1000);

		state.studio.mount();
		ambient.start();

		this.unsubscribeSynapse = synapse.subscribe((signal) => {
			this.handleIntent(signal.intent as ActionIntent);
		});

		const cleanupSynapse = synapse.mount(window, canvasElement);

		return () => {
			if (this.unsubscribeSynapse) this.unsubscribeSynapse();
			cleanupSynapse();
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
				return shuttle.jumpHome();
			case 'GOTO':
				return (state.showGoTo = true);

			case 'PAINT':
				if (state.selection.isActive) return shuttle.commitSelection();
				return shuttle.draw.draw();

			case 'ERASE':
				return shuttle.draw.erase();
			case 'SOAK':
				return shuttle.color.soak();
			case 'BIND_VERTEX':
				return shuttle.selection.addVertex(state.cursor.pos.x, state.cursor.pos.y);
			case 'SEAL_BINDING':
				if (state.selection.vertices.length >= 3) {
					return shuttle.selection.sealBinding();
				}
				if (state.selection.isActive) return shuttle.commitSelection();
				return shuttle.draw.draw();
			case 'PICK_COLOR':
				return shuttle.color.pickFromCanvas();

			case 'COPY':
				return shuttle.clipboard.copy();
			case 'CUT':
				return shuttle.clipboard.cut();
			case 'PASTE':
				return shuttle.clipboard.paste();
			case 'RECOLOR':
				return shuttle.manipulation.bleach();

			case 'UNDO':
				return state.undo();
			case 'REDO':
				return state.redo();
			case 'SAVE':
				return (state.showPersistenceMenu = true);
			case 'OPEN':
				return shuttle.persistence.load();

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
				return chronos.togglePlayback();
			case 'TOGGLE_GHOST_LAYERS':
				return (state.showGhostLayers = !state.showGhostLayers);

			case 'ZOOM_IN':
				return state.studio.setZoom(0.1);
			case 'ZOOM_OUT':
				return state.studio.setZoom(-0.1);
			case 'RESET_ZOOM':
				return state.studio.resetZoom();

			case 'CLEAR_CANVAS':
				return shuttle.manipulation.clearAll();
			case 'TOGGLE_MUTE':
				return state.studio.toggleMute();
			case 'SELECT_SAME':
				return shuttle.selection.spiritPick();

			case 'FLIP_H':
				return shuttle.manipulation.flip('horizontal');
			case 'FLIP_V':
				return shuttle.manipulation.flip('vertical');
			case 'ROTATE':
				return shuttle.manipulation.rotate();

			case 'NEW_FRAME':
				return shuttle.project.addFrame();
			case 'DUPLICATE_FRAME':
				return shuttle.project.duplicateFrame(state.project.activeFrameIndex);
			case 'NEXT_FRAME':
				return shuttle.project.nextFrame();
			case 'PREV_FRAME':
				return shuttle.project.prevFrame();
			case 'DELETE_FRAME':
				return shuttle.project.removeFrame(state.project.activeFrameIndex);
			case 'TAB_TIMELINE':
				return (state.studio.projectActiveTab = 'frames');
			case 'TAB_LAYERS':
				return (state.studio.projectActiveTab = 'layers');

			case 'NEW_LAYER':
				return shuttle.project.addLayer();
			case 'DUPLICATE_LAYER':
				return shuttle.project.duplicateLayer(state.project.activeFrame.activeLayerIndex);
			case 'NEXT_LAYER':
				return shuttle.project.nextLayer();
			case 'PREV_LAYER':
				return shuttle.project.prevLayer();
			case 'DELETE_LAYER':
				return shuttle.project.removeLayer(state.project.activeFrame.activeLayerIndex);
			case 'TOGGLE_LAYER_LOCK':
				return shuttle.project.toggleLock();
			case 'TOGGLE_LAYER_VISIBILITY':
				return shuttle.project.toggleVisibility();
			case 'MOVE_LAYER_UP':
				return shuttle.project.moveLayerUp();
			case 'MOVE_LAYER_DOWN':
				return shuttle.project.moveLayerDown();

			default:
				if (intent.startsWith('SELECT_COLOR_')) {
					const num = parseInt(intent.split('_')[2]);
					return shuttle.color.select(num === 0 ? 9 : num - 1);
				}
		}
	}

	private executeMove(dx: number, dy: number) {
		if (shuttle.movement.move(dx, dy)) {
			const currentMode = mode.current.type;
			if (currentMode === 'SELECT') {
				if (!state.selection.isActive) shuttle.startSelection();
				shuttle.updateSelection();
			}
			if (currentMode === 'PAINT') shuttle.draw.draw();
			if (currentMode === 'ERASE') shuttle.draw.erase();
		}
	}
}

export const editor = new EditorEngine();
