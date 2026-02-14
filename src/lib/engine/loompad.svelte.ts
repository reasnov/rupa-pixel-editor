import shortcutsData from '../config/shortcuts.json' with { type: 'json' };
import { weaving } from './weaving.svelte.js';

export type LoomIntent =
	| 'MOVE_UP'
	| 'MOVE_DOWN'
	| 'MOVE_LEFT'
	| 'MOVE_RIGHT'
	| 'JUMP_HOME'
	| 'SET_POSITION'
	| 'GOTO'
	| 'STITCH'
	| 'UNSTITCH'
	| 'SOAK'
	| 'BIND_VERTEX'
	| 'SEAL_BINDING'
	| 'PICK_DYE'
	| 'SAVE'
	| 'OPEN'
	| 'OPEN_SETTINGS'
	| 'OPEN_ARCHIVE'
	| 'FLOW_STITCH'
	| 'FLOW_UNSTITCH'
	| 'FLOW_SELECT'
	| 'SPIRIT_PICK'
	| 'UNDO'
	| 'REDO'
	| 'ZOOM_IN'
	| 'ZOOM_OUT'
	| 'RESET_ZOOM'
	| 'OPEN_PALETTE'
	| 'OPEN_DYES'
	| 'OPEN_AUDIO'
	| 'OPEN_EXPORT'
	| 'OPEN_HELP'
	| 'OPEN_CODEX'
	| 'PLAY_PULSE'
	| 'TOGGLE_GHOST_THREADS'
	| 'CLEAR_LINEN'
	| 'TOGGLE_MUTE'
	| 'ESCAPE'
	| 'COPY'
	| 'CUT'
	| 'PASTE'
	| 'BLEACH'
	| 'FLIP_H'
	| 'FLIP_V'
	| 'ROTATE'
	| 'NEW_FRAME'
	| 'DUPLICATE_FRAME'
	| 'NEXT_FRAME'
	| 'PREV_FRAME'
	| 'DELETE_FRAME'
	| 'TAB_FRAMES'
	| 'TAB_VEILS'
	| 'NEW_VEIL'
	| 'DUPLICATE_VEIL'
	| 'NEXT_VEIL'
	| 'PREV_VEIL'
	| 'DELETE_VEIL'
	| 'TOGGLE_VEIL_LOCK'
	| 'TOGGLE_VEIL_VISIBILITY'
	| 'MOVE_VEIL_UP'
	| 'MOVE_VEIL_DOWN'
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
	label: string;
	group: string;
}

export class LoomPadEngine {
	private patterns: LoomPattern[] = [];

	// Reactive tracking for UI debugging
	activeKeys = $state<string[]>([]);

	// The "Resolved State" based on current physical grip
	isCtrlActive = $state(false);
	isShiftActive = $state(false);
	isAltActive = $state(false);

	constructor() {
		this.loadPatterns();
	}

	private loadPatterns() {
		this.patterns = [];
		Object.values(shortcutsData).forEach((category) => {
			Object.entries(category).forEach(([intent, data]) => {
				const { keys, group } = data as { label: string; keys: string[]; group: string };

				// Get translated label and group
				const label = __({ key: `shortcuts.labels.${intent}` });
				const groupKey = group.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
				const translatedGroup = __({ key: `shortcuts.groups.${groupKey}` });

				keys.forEach((keyCombo) => {
					const parts = keyCombo.toLowerCase().split('+');
					let key = parts[parts.length - 1].trim();
					if (key === 'space') key = ' ';
					if (key === 'ctrl' || key === 'control') key = 'control';

					this.patterns.push({
						intent: intent as LoomIntent,
						key,
						ctrl: parts.includes('ctrl') || parts.includes('control'),
						shift: parts.includes('shift'),
						alt: parts.includes('alt'),
						label,
						group: translatedGroup
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
	 * Get a flattened list of all unique actions for search and catalogs.
	 */
	getActions() {
		const uniqueIntents = new Set<LoomIntent>();
		const result: Array<{ intent: LoomIntent; label: string; group: string; shortcut: string }> =
			[];

		this.patterns.forEach((p) => {
			if (!uniqueIntents.has(p.intent)) {
				uniqueIntents.add(p.intent);
				result.push({
					intent: p.intent,
					label: p.label, // This is already translated in loadPatterns
					group: p.group,
					shortcut: this.getLabel(p.intent)
				});
			}
		});

		return result;
	}

	/**
	 * Get actions grouped for the Guide.
	 */
	getGroupedActions() {
		const actions = this.getActions();
		const groups: Record<string, typeof actions> = {};

		// Special handling for key groups to avoid listing every arrow/number
		const groupMapping: Record<string, string> = {
			MOVE_UP: 'Arrows',
			MOVE_DOWN: 'Arrows',
			MOVE_LEFT: 'Arrows',
			MOVE_RIGHT: 'Arrows',
			SELECT_DYE_1: '1-0',
			SELECT_DYE_2: '1-0',
			SELECT_DYE_3: '1-0',
			SELECT_DYE_4: '1-0',
			SELECT_DYE_5: '1-0',
			SELECT_DYE_6: '1-0',
			SELECT_DYE_7: '1-0',
			SELECT_DYE_8: '1-0',
			SELECT_DYE_9: '1-0',
			SELECT_DYE_0: '1-0'
		};

		const finalActions: Array<{
			intent: LoomIntent;
			label: string;
			group: string;
			customKey?: string;
		}> = [];
		const seenGroupedIntents = new Set<string>();

		actions.forEach((a) => {
			const custom = groupMapping[a.intent];
			if (custom) {
				if (!seenGroupedIntents.has(custom)) {
					seenGroupedIntents.add(custom);
					// Get translated labels for custom groups
					const groupKey = custom.toLowerCase();
					const cleanLabel = __({ key: `shortcuts.groups.${groupKey}` });
					finalActions.push({ ...a, label: cleanLabel, customKey: custom });
				}
			} else {
				finalActions.push(a);
			}
		});

		finalActions.forEach((a) => {
			if (!groups[a.group]) groups[a.group] = [];
			groups[a.group].push(a as any);
		});

		// Order groups logically using translated names
		const order = [
			__({ key: 'shortcuts.groups.basic_rhythms' }),
			__({ key: 'shortcuts.groups.the_needle' }),
			__({ key: 'shortcuts.groups.the_hand' }),
			__({ key: 'shortcuts.groups.continuous_weaving' }),
			__({ key: 'shortcuts.groups.artisan_magic' }),
			__({ key: 'shortcuts.groups.the_loom' }),
			__({ key: 'shortcuts.groups.dimensions_forms' }),
			__({ key: 'shortcuts.groups.the_spindle' }),
			__({ key: 'shortcuts.groups.the_veils' }),
			__({ key: 'shortcuts.groups.the_pattern_book' }),
			__({ key: 'shortcuts.groups.atmosphere_tuning' })
		];

		return order
			.filter((name) => groups[name])
			.map((name) => ({
				group: name,
				items: groups[name]
			}));
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
			this.activeKeys = this.activeKeys.filter((k) => k !== key);
			if (key === 'alt' && !e.altKey) {
				this.activeKeys = this.activeKeys.filter((k) => k !== 'alt');
			}
		}

		this.isCtrlActive = e.ctrlKey || e.metaKey;
		this.isShiftActive = e.shiftKey;
		this.isAltActive = e.altKey;

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

		if (!this.isCtrlActive && !this.isAltActive && !this.isShiftActive) {
			const sequenceIntent = weaving.process(key);
			if (sequenceIntent) return sequenceIntent;
		} else {
			weaving.reset();
		}

		if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
			if (key === 'arrowup') return 'MOVE_UP';
			if (key === 'arrowdown') return 'MOVE_DOWN';
			if (key === 'arrowleft') return 'MOVE_LEFT';
			if (key === 'arrowright') return 'MOVE_RIGHT';
		}

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

	/**
	 * Get a normalized, professional label for an intent's shortcut.
	 */
	getLabel(intent: LoomIntent): string {
		const p = this.patterns.find((p) => p.intent === intent);
		if (!p) return 'Unassigned';

		const modifiers: string[] = [];
		if (p.ctrl) modifiers.push('Ctrl');
		if (p.shift) modifiers.push('Shift');
		if (p.alt) modifiers.push('Alt');

		let keyLabel = p.key;

		const keyMap: Record<string, string> = {
			' ': 'Space',
			control: 'Ctrl',
			meta: 'Cmd',
			alt: 'Alt',
			shift: 'Shift',
			arrowup: 'Up',
			arrowdown: 'Down',
			arrowleft: 'Left',
			arrowright: 'Right',
			backspace: 'Backspace',
			delete: 'Delete',
			enter: 'Enter',
			escape: 'Esc',
			tab: 'Tab'
		};

		const lowerKey = keyLabel.toLowerCase();
		if (keyMap[lowerKey]) {
			keyLabel = keyMap[lowerKey];
		} else {
			keyLabel = keyLabel.charAt(0).toUpperCase() + keyLabel.slice(1).toLowerCase();
		}

		const filteredModifiers = modifiers.filter((m) => m.toLowerCase() !== keyLabel.toLowerCase());

		if (filteredModifiers.length === 0) return keyLabel;
		return filteredModifiers.join('+') + '+' + keyLabel;
	}
}

export const loompad = new LoomPadEngine();
