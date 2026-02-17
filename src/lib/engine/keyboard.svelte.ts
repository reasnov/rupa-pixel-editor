import shortcutsData from '../config/shortcuts.json' with { type: 'json' };
import { sequence } from './sequence.svelte.js';

export type ActionIntent =
	| 'MOVE_UP'
	| 'MOVE_DOWN'
	| 'MOVE_LEFT'
	| 'MOVE_RIGHT'
	| 'JUMP_HOME'
	| 'SET_POSITION'
	| 'GOTO'
	| 'PAINT'
	| 'ERASE'
	| 'FLOOD_FILL'
	| 'BIND_VERTEX'
	| 'SEAL_BINDING'
	| 'PICK_COLOR'
	| 'SAVE'
	| 'OPEN'
	| 'OPEN_SETTINGS'
	| 'OPEN_MENU'
	| 'FLOW_PAINT'
	| 'FLOW_ERASE'
	| 'FLOW_SELECT'
	| 'SELECT_SAME'
	| 'UNDO'
	| 'REDO'
	| 'ZOOM_IN'
	| 'ZOOM_OUT'
	| 'RESET_ZOOM'
	| 'OPEN_PALETTE'
	| 'OPEN_AUDIO'
	| 'OPEN_EXPORT'
	| 'OPEN_HELP'
	| 'OPEN_MANUAL'
	| 'PLAY_PAUSE'
	| 'TOGGLE_GHOST_LAYERS'
	| 'CLEAR_CANVAS'
	| 'TOGGLE_MUTE'
	| 'ESCAPE'
	| 'COPY'
	| 'CUT'
	| 'PASTE'
	| 'RECOLOR'
	| 'FLIP_H'
	| 'FLIP_V'
	| 'ROTATE'
	| 'NEW_FRAME'
	| 'DUPLICATE_FRAME'
	| 'NEXT_FRAME'
	| 'PREV_FRAME'
	| 'DELETE_FRAME'
	| 'TAB_TIMELINE'
	| 'TAB_LAYERS'
	| 'NEW_LAYER'
	| 'DUPLICATE_LAYER'
	| 'NEXT_LAYER'
	| 'PREV_LAYER'
	| 'DELETE_LAYER'
	| 'TOGGLE_LAYER_LOCK'
	| 'TOGGLE_LAYER_VISIBILITY'
	| 'MOVE_LAYER_UP'
	| 'MOVE_LAYER_DOWN'
	| 'MERGE_LAYERS'
	| 'SWITCH_FOCUS'
	| 'SELECT_COLOR_1'
	| 'SELECT_COLOR_2'
	| 'SELECT_COLOR_3'
	| 'SELECT_COLOR_4'
	| 'SELECT_COLOR_5'
	| 'SELECT_COLOR_6'
	| 'SELECT_COLOR_7'
	| 'SELECT_COLOR_8'
	| 'SELECT_COLOR_9'
	| 'SELECT_COLOR_0';

interface ShortcutPattern {
	intent: ActionIntent;
	key: string;
	ctrl: boolean;
	shift: boolean;
	alt: boolean;
	label: string;
	group: string;
}

export class KeyboardEngine {
	private patterns: ShortcutPattern[] = [];

	activeKeys = $state<string[]>([]);

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

				// PROFESSIONAL KEYS: Use updated common.json keys
				const label = __({ key: `shortcut_labels.${intent}` });
				const groupKey = group.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
				const translatedGroup = __({ key: `shortcut_groups.${groupKey}` });

				keys.forEach((keyCombo) => {
					const parts = keyCombo.toLowerCase().split('+');
					let key = parts[parts.length - 1].trim();
					if (key === 'space') key = ' ';
					if (key === 'ctrl' || key === 'control') key = 'control';

					this.patterns.push({
						intent: intent as ActionIntent,
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
			const score = (p: ShortcutPattern) => (p.ctrl ? 1 : 0) + (p.shift ? 1 : 0) + (p.alt ? 1 : 0);
			return score(b) - score(a);
		});
	}

	getActions() {
		const uniqueIntents = new Set<ActionIntent>();
		const result: Array<{ intent: ActionIntent; label: string; group: string; shortcut: string }> =
			[];

		this.patterns.forEach((p) => {
			if (!uniqueIntents.has(p.intent)) {
				uniqueIntents.add(p.intent);
				result.push({
					intent: p.intent,
					label: p.label,
					group: p.group,
					shortcut: this.getLabel(p.intent)
				});
			}
		});

		return result;
	}

	getGroupedActions() {
		const actions = this.getActions();
		const groups: Record<string, typeof actions> = {};

		const groupMapping: Record<string, string> = {
			MOVE_UP: 'navigation',
			MOVE_DOWN: 'navigation',
			MOVE_LEFT: 'navigation',
			MOVE_RIGHT: 'navigation',
			SELECT_COLOR_1: 'colors',
			SELECT_COLOR_2: 'colors',
			SELECT_COLOR_3: 'colors',
			SELECT_COLOR_4: 'colors',
			SELECT_COLOR_5: 'colors',
			SELECT_COLOR_6: 'colors',
			SELECT_COLOR_7: 'colors',
			SELECT_COLOR_8: 'colors',
			SELECT_COLOR_9: 'colors',
			SELECT_COLOR_0: 'colors'
		};

		const finalActions: Array<{
			intent: ActionIntent;
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
					const cleanLabel = __({ key: `shortcut_groups.${custom}` });
					finalActions.push({ ...a, label: cleanLabel, customKey: custom.toUpperCase() });
				}
			} else {
				finalActions.push(a);
			}
		});

		finalActions.forEach((a) => {
			if (!groups[a.group]) groups[a.group] = [];
			groups[a.group].push(a as any);
		});

		const order = [
			__({ key: 'shortcut_groups.rhythms' }),
			__({ key: 'shortcut_groups.navigation' }),
			__({ key: 'shortcut_groups.cursor' }),
			__({ key: 'shortcut_groups.barista' }),
			__({ key: 'shortcut_groups.flow' }),
			__({ key: 'shortcut_groups.magic' }),
			__({ key: 'shortcut_groups.selection' }),
			__({ key: 'shortcut_groups.geometry' }),
			__({ key: 'shortcut_groups.timeline' }),
			__({ key: 'shortcut_groups.layers' }),
			__({ key: 'shortcut_groups.menu' }),
			__({ key: 'shortcut_groups.vibes' }),
			__({ key: 'shortcut_groups.colors' })
		];

		return order
			.filter((name) => groups[name])
			.map((name) => ({
				group: name,
				items: groups[name]
			}));
	}

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

	getIntent(e: KeyboardEvent): ActionIntent | null {
		const key = e.key.toLowerCase();

		if (!this.isCtrlActive && !this.isAltActive && !this.isShiftActive) {
			const sequenceIntent = sequence.process(key);
			if (sequenceIntent) return sequenceIntent as ActionIntent;
		} else {
			sequence.reset();
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

	getLabel(intent: ActionIntent): string {
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

export const keyboard = new KeyboardEngine();
