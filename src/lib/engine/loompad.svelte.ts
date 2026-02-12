import shortcutsData from '../config/shortcuts.json' with { type: 'json' };
import { weaving } from './weaving.svelte.js';

export type LoomIntent =
	| 'MOVE_UP'
	| 'MOVE_DOWN'
	| 'MOVE_LEFT'
	| 'MOVE_RIGHT'
	| 'GOTO'
	| 'STITCH'
	| 'UNSTITCH'
	| 'PICK_DYE'
	| 'SAVE'
	| 'OPEN'
	| 'OPEN_SETTINGS'
	| 'OPEN_ARCHIVE'
	| 'FLOW_STITCH'
	| 'FLOW_UNSTITCH'
	| 'FLOW_SELECT'
	| 'UNDO'
	| 'REDO'
	| 'ZOOM_IN'
	| 'ZOOM_OUT'
	| 'RESET_ZOOM'
	| 'OPEN_PALETTE'
	| 'OPEN_DYES'
	| 'OPEN_EXPORT'
	| 'OPEN_HELP'
	| 'CLEAR_LINEN'
	| 'TOGGLE_MUTE'
	| 'ESCAPE'
	| 'COPY'
	| 'CUT'
	| 'PASTE'
	| 'FLIP_H'
	| 'FLIP_V'
	| 'ROTATE'
	| 'NEW_FRAME'
	| 'NEXT_FRAME'
	| 'PREV_FRAME'
	| 'DELETE_FRAME'
	| 'NEW_VEIL'
	| 'NEXT_VEIL'
	| 'PREV_VEIL'
	| 'DELETE_VEIL'
	| 'TOGGLE_VEIL_LOCK'
	| 'TOGGLE_VEIL_VISIBILITY'
	| 'MERGE_VEILS'
	| 'SWITCH_FOCUS'
	| 'SELECT_DYE_1'
	| 'SELECT_DYE_2'
	| 'SELECT_DYE_3'
	| 'SELECT_DYE_4'
	| 'SELECT_DYE_5'
	| 'SELECT_DYE_6'
	| 'SELECT_DYE_7'
	| 'SELECT_DYE_8'
	| 'SELECT_DYE_9'
	| 'SELECT_DYE_0';

interface LoomPattern {
	intent: LoomIntent;
	key: string;
	ctrl: boolean;
	shift: boolean;
	alt: boolean;
}

export class LoomPadEngine {
	private patterns: LoomPattern[] = [];

	// Reactive tracking for UI debugging - Using array for reliable reactivity
	activeKeys = $state<string[]>([]);

	// The "Resolved State" based on current physical grip
	isCtrlActive = $state(false);
	isShiftActive = $state(false);
	isAltActive = $state(false);

	constructor() {
		this.loadPatterns();
	}

	private loadPatterns() {
		const mapping: Record<string, LoomIntent> = {
			UP: 'MOVE_UP',
			DOWN: 'MOVE_DOWN',
			LEFT: 'MOVE_LEFT',
			RIGHT: 'MOVE_RIGHT',
			GOTO: 'GOTO',
			STITCH: 'STITCH',
			UNSTITCH: 'UNSTITCH',
			EYEDROPPER: 'PICK_DYE',
			SAVE: 'OPEN_ARCHIVE',
			OPEN: 'OPEN',
			SETTINGS: 'OPEN_SETTINGS',
			FLOW_STITCH: 'FLOW_STITCH',
			FLOW_UNSTITCH: 'FLOW_UNSTITCH',
			FLOW_SELECT: 'FLOW_SELECT',
			UNDO: 'UNDO',
			REDO: 'REDO',
			ZOOM_IN: 'ZOOM_IN',
			ZOOM_OUT: 'ZOOM_OUT',
			RESET_ZOOM: 'RESET_ZOOM',
			COMMAND_PALETTE: 'OPEN_PALETTE',
			COLOR_PICKER: 'OPEN_DYES',
			EXPORT: 'OPEN_EXPORT',
			CLEAR_LINEN: 'CLEAR_LINEN',
			TOGGLE_MUTE: 'TOGGLE_MUTE',
			ESCAPE: 'ESCAPE',
			COPY: 'COPY',
			CUT: 'CUT',
			PASTE: 'PASTE',
			FLIP_H: 'FLIP_H',
			FLIP_V: 'FLIP_V',
			ROTATE: 'ROTATE',
			NEW_FRAME: 'NEW_FRAME',
			NEXT_FRAME: 'NEXT_FRAME',
			PREV_FRAME: 'PREV_FRAME',
			DELETE_FRAME: 'DELETE_FRAME',
			NEW_VEIL: 'NEW_VEIL',
			NEXT_VEIL: 'NEXT_VEIL',
			PREV_VEIL: 'PREV_VEIL',
			TOGGLE_VEIL_LOCK: 'TOGGLE_VEIL_LOCK',
			TOGGLE_VEIL_VISIBILITY: 'TOGGLE_VEIL_VISIBILITY',
			MERGE_VEILS: 'MERGE_VEILS',
			DELETE_VEIL: 'DELETE_VEIL',
			SELECT_1: 'SELECT_DYE_1',
			SELECT_2: 'SELECT_DYE_2',
			SELECT_3: 'SELECT_DYE_3',
			SELECT_4: 'SELECT_DYE_4',
			SELECT_5: 'SELECT_DYE_5',
			SELECT_6: 'SELECT_DYE_6',
			SELECT_7: 'SELECT_DYE_7',
			SELECT_8: 'SELECT_DYE_8',
			SELECT_9: 'SELECT_DYE_9',
			SELECT_0: 'SELECT_DYE_0'
		};

		Object.values(shortcutsData).forEach((category) => {
			Object.entries(category).forEach(([action, keys]) => {
				const intent = mapping[action];
				if (!intent) return;
				(keys as string[]).forEach((keyCombo) => {
					const parts = keyCombo.toLowerCase().split('+');
					let key = parts[parts.length - 1].trim();
					if (key === 'space') key = ' ';
					if (key === 'ctrl' || key === 'control') key = 'control';
					this.patterns.push({
						intent,
						key,
						ctrl: parts.includes('ctrl') || parts.includes('control'),
						shift: parts.includes('shift'),
						alt: parts.includes('alt')
					});
				});
			});
		});

		this.patterns.sort((a, b) => {
			const score = (p: LoomPattern) => (p.ctrl ? 1 : 0) + (p.shift ? 1 : 0) + (p.alt ? 1 : 0);
			return score(b) - score(a);
		});
	}

	/**
	 * Physical Update: Call this on EVERY keydown/keyup.
	 */
	updatePhysicalState(e: KeyboardEvent, type: 'down' | 'up') {
		const key = e.key.toLowerCase();

		if (type === 'down') {
			if (!this.activeKeys.includes(key)) {
				this.activeKeys.push(key);
			}
		} else {
			// Remove the specific key
			this.activeKeys = this.activeKeys.filter((k) => k !== key);

			// SECURITY: If Alt is specifically stuck (common browser bug),
			// we check the physical state reported by the event.
			if (key === 'alt' && !e.altKey) {
				this.activeKeys = this.activeKeys.filter((k) => k !== 'alt');
			}
		}

		// Sync modifier states immediately with the event's truth
		this.isCtrlActive = e.ctrlKey || e.metaKey;
		this.isShiftActive = e.shiftKey;
		this.isAltActive = e.altKey;

		// Final cleanup: if event says modifier is up, it MUST be removed from array
		if (!this.isCtrlActive)
			this.activeKeys = this.activeKeys.filter((k) => k !== 'control' && k !== 'meta');
		if (!this.isShiftActive) this.activeKeys = this.activeKeys.filter((k) => k !== 'shift');
		if (!this.isAltActive) this.activeKeys = this.activeKeys.filter((k) => k !== 'alt');
	}

	/**
	 * Intent Resolution: Decides what action to take based on current grip.
	 */
	getIntent(e: KeyboardEvent): LoomIntent | null {
		const key = e.key.toLowerCase();

		// 1. Sequence Handling (Weaving)
		if (!this.isCtrlActive && !this.isAltActive && !this.isShiftActive) {
			const sequenceIntent = weaving.process(key);
			if (sequenceIntent) return sequenceIntent;
		} else {
			weaving.reset();
		}

		// 2. Navigation is prioritized
		if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
			if (key === 'arrowup') return 'MOVE_UP';
			if (key === 'arrowdown') return 'MOVE_DOWN';
			if (key === 'arrowleft') return 'MOVE_LEFT';
			if (key === 'arrowright') return 'MOVE_RIGHT';
		}

		// Search for the best pattern match given current modifiers
		for (const pattern of this.patterns) {
			const keyMatch = key === pattern.key;

			if (
				keyMatch &&
				this.isCtrlActive === pattern.ctrl &&
				this.isShiftActive === pattern.shift &&
				this.isAltActive === pattern.alt
			) {
				return pattern.intent;
			}
		}
		return null;
	}

	getLabel(intent: LoomIntent): string {
		const p = this.patterns.find((p) => p.intent === intent);
		if (!p) return '';
		let label = '';
		if (p.ctrl) label += 'Ctrl+';
		if (p.shift) label += 'Shift+';
		if (p.alt) label += 'Alt+';
		label += p.key === ' ' ? 'Space' : p.key.toUpperCase();
		return label;
	}
}

export const loompad = new LoomPadEngine();
