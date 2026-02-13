import { atelier } from '../state/atelier.svelte.js';
import { loompad, type LoomIntent } from './loompad.svelte.js';
import { stance } from './stance.svelte.js';
import { shuttle } from './shuttle.js';
import { ambient } from './ambient.js';

/**
 * TheLoom: The primary orchestrator of user input and action execution.
 * It maps LoomIntents to ShuttleEngine operations.
 */
export class TheLoom {
	private backupInterval: any = null;

	/**
	 * Mount the loom: initialize listeners and heartbeats.
	 */
	mount() {
		this.backupInterval = setInterval(() => shuttle.persistence.backup(), 10 * 60 * 1000);

		// Start generative background music
		ambient.start();

		const onKeyDown = (e: KeyboardEvent) => this.handleInput(e, 'down');
		const onKeyUp = (e: KeyboardEvent) => this.handleInput(e, 'up');

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			clearInterval(this.backupInterval);
		};
	}

	handleInput(e: KeyboardEvent, type: 'down' | 'up') {
		if (!atelier.studio.isAppReady) return;

		// 1. Update physical key ledger
		loompad.updatePhysicalState(e, type);

		// 2. Shield Check
		const target = e.target as HTMLElement;
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target.isContentEditable
		) {
			if (type === 'down' && e.key === 'Escape') atelier.handleEscape();
			return;
		}

		atelier.needle.resetInactivityTimer();

		// 3. Action Resolution
		if (type === 'down') {
			const intent = loompad.getIntent(e);
			console.log('Loom Intent:', intent, 'Key:', e.key, 'Shift:', e.shiftKey);
			if (intent) this.executeIntent(intent, e);
		}
	}

	private executeIntent(intent: LoomIntent, e: KeyboardEvent) {
		const isNav = intent.startsWith('MOVE_');
		if (!isNav) e.preventDefault();

		switch (intent) {
			case 'MOVE_UP':
				return this.executeMove(0, -1);
			case 'MOVE_DOWN':
				return this.executeMove(0, 1);
			case 'MOVE_LEFT':
				return this.executeMove(-1, 0);
			case 'MOVE_RIGHT':
				return this.executeMove(1, 0);
			case 'GOTO':
				return (atelier.studio.showGoTo = true);

			case 'STITCH':
				if (atelier.selection.isActive) return shuttle.commitSelection();
				return shuttle.stitching.stitch();

			case 'UNSTITCH':
				return shuttle.stitching.unstitch();
			case 'PICK_DYE':
				return shuttle.stitching.pickDye();

			case 'COPY':
				return shuttle.clipboard.copy();
			case 'CUT':
				return shuttle.clipboard.cut();
			case 'PASTE':
				return shuttle.clipboard.paste();

			case 'UNDO':
				return atelier.undo();
			case 'REDO':
				return atelier.redo();
			case 'SAVE':
				return shuttle.persistence.save();
			case 'OPEN':
				return shuttle.persistence.load();

			case 'OPEN_ARCHIVE':
				return (atelier.studio.showArchivePattern = true);
			case 'OPEN_SETTINGS':
				return (atelier.studio.showLinenSettings = true);

			case 'ESCAPE':
				if (atelier.selection.isActive) {
					atelier.selection.clear();
					return;
				}
				return atelier.handleEscape();

			case 'OPEN_PALETTE':
				return (atelier.studio.showPatternCatalog = !atelier.studio.showPatternCatalog);
			case 'OPEN_DYES':
				return (atelier.studio.showDyeBasin = !atelier.studio.showDyeBasin);
			case 'OPEN_EXPORT':
				return (atelier.studio.showArtifactCrate = true);
			case 'OPEN_HELP':
				return (atelier.studio.showArtisanGuide = true);

			case 'ZOOM_IN':
				return atelier.studio.setZoom(0.1);
			case 'ZOOM_OUT':
				return atelier.studio.setZoom(-0.1);
			case 'RESET_ZOOM':
				return atelier.studio.resetZoom();

			case 'CLEAR_LINEN':
				return shuttle.manipulation.clearAll();
			case 'TOGGLE_MUTE':
				return atelier.studio.toggleMute();

			case 'FLIP_H':
				return shuttle.manipulation.flip('horizontal');
			case 'FLIP_V':
				return shuttle.manipulation.flip('vertical');
			case 'ROTATE':
				return shuttle.manipulation.rotate();

			case 'NEW_FRAME':
				return shuttle.folio.addFrame();
			case 'NEXT_FRAME':
				return shuttle.folio.nextFrame();
			case 'PREV_FRAME':
				return shuttle.folio.prevFrame();
			case 'DELETE_FRAME':
				return shuttle.folio.removeFrame(atelier.project.activeFrameIndex);

			case 'NEW_VEIL':
				return shuttle.folio.addVeil();
			case 'NEXT_VEIL':
				return shuttle.folio.nextVeil();
			case 'PREV_VEIL':
				return shuttle.folio.prevVeil();
			case 'DELETE_VEIL':
				return shuttle.folio.removeVeil(atelier.project.activeFrame.activeVeilIndex);
			case 'TOGGLE_VEIL_LOCK':
				return shuttle.folio.toggleLock();
			case 'TOGGLE_VEIL_VISIBILITY':
				return shuttle.folio.toggleVisibility();
			case 'MOVE_VEIL_UP':
				return shuttle.folio.moveVeilUp();
			case 'MOVE_VEIL_DOWN':
				return shuttle.folio.moveVeilDown();
			case 'SWITCH_FOCUS':
				// TODO: Implement focus toggle logic if needed
				return;

			default:
				if (intent.startsWith('SELECT_DYE_')) {
					const num = parseInt(intent.split('_')[2]);
					return shuttle.dye.select(num === 0 ? 9 : num - 1);
				}
		}
	}

	private executeMove(dx: number, dy: number) {
		if (shuttle.movement.move(dx, dy)) {
			const mode = stance.current.type;
			if (mode === 'LOOMING') {
				if (!atelier.selection.isActive) shuttle.startSelection();
				shuttle.updateSelection();
			}
			if (mode === 'THREADING') shuttle.stitching.stitch();
			if (mode === 'UNRAVELLING') shuttle.stitching.unstitch();
		}
	}
}

export const loom = new TheLoom();
