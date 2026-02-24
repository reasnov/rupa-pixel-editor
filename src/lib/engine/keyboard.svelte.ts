import { __ } from '$lib/state/i18n.svelte.js';
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
	| 'RESET_PAN'
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
	| 'RESET_VIEWPORT'
	| 'OPEN_PALETTE'
	| 'OPEN_AUDIO'
	| 'OPEN_EXPORT'
	| 'OPEN_HELP'
	| 'OPEN_MANUAL'
	| 'PLAY_PAUSE'
	| 'TOGGLE_GHOST_LAYERS'
	| 'CLEAR_CANVAS'
	| 'TOGGLE_MUTE'
	| 'TOGGLE_MINIMAP'
	| 'ESCAPE'
	| 'COPY'
	| 'CUT'
	| 'PASTE'
	| 'RECOLOR'
	| 'FLIP_H'
	| 'FLIP_V'
	| 'ROTATE'
	| 'NEXT_FRAME'
	| 'PREV_FRAME'
	| 'TAB_TIMELINE'
	| 'TAB_LAYERS'
	| 'NEW_ITEM'
	| 'NEW_LAYER_GROUP'
	| 'DUPLICATE_ITEM'
	| 'DELETE_ITEM'
	| 'MOVE_ITEM_UP'
	| 'MOVE_ITEM_DOWN'
	| 'MOVE_ITEM_TOP'
	| 'MOVE_ITEM_BOTTOM'
	| 'TOGGLE_LAYER_LOCK'
	| 'TOGGLE_LAYER_VISIBILITY'
	| 'MERGE_LAYERS'
	| 'MERGE_SELECTED_LAYERS'
	| 'MERGE_FRAMES'
	| 'SWITCH_FOCUS'
	| 'BRUSH_SIZE_INC'
	| 'BRUSH_SIZE_DEC'
	| 'TOGGLE_PATTERN_BRUSH'
	| 'TOGGLE_BRUSH_SHAPE'
	| 'TOGGLE_HAND_TOOL'
	| 'CYCLE_SYMMETRY'
	| 'TOGGLE_TILING'
	| 'TOGGLE_AIRBRUSH'
	| 'TOGGLE_ALPHA_LOCK'
	| 'TOGGLE_COLOR_LOCK'
	| 'SHADE_LIGHTEN'
	| 'SHADE_DARKEN'
	| 'SHADE_DITHER'
	| 'TOGGLE_SHADE_LIGHTEN'
	| 'TOGGLE_SHADE_DARKEN'
	| 'TOGGLE_SHADE_DITHER'
	| 'TOOL_BRUSH'
	| 'TOOL_ERASER'
	| 'TOOL_RECT_SELECT'
	| 'TOOL_LASSO_SELECT'
	| 'TOOL_POLY_SELECT'
	| 'SELECT_ALL'
	| 'MAGIC_WAND'
	| 'TOGGLE_PIXEL_PERFECT'
	| 'TOOL_RECTANGLE'
	| 'TOOL_ELLIPSE'
	| 'TOOL_POLYGON'
	| 'POLY_SIDES_INC'
	| 'POLY_SIDES_DEC'
	| 'POLY_INDENT_INC'
	| 'POLY_INDENT_DEC'
	| 'SET_SIDES_3'
	| 'SET_SIDES_4'
	| 'SET_SIDES_5'
	| 'SET_SIDES_6'
	| 'SET_SIDES_7'
	| 'SET_SIDES_8'
	| 'SET_SIDES_9'
	| 'SET_SIDES_10'
	| 'TOGGLE_UNDERLAY'
	| 'OPEN_UNDERLAY_MENU'
	| 'TOOL_TRANSFORM'
	| 'TOGGLE_DITHER_BLEND'
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
				const label = __(`common:labels.${intent}`);
				const groupKey = group.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
				const translatedGroup = __(`shortcuts:groups.${groupKey}`);

				keys.forEach((keyCombo) => {
					const lowerCombo = keyCombo.toLowerCase();
					let key = '';
					let ctrl = false;
					let shift = false;
					let alt = false;

					if (lowerCombo === '+') {
						key = '+';
					} else {
						const parts = lowerCombo.split('+');
						key = parts[parts.length - 1].trim();
						if (key === '' && lowerCombo.endsWith('++')) {
							key = '+';
						}
						ctrl = parts.includes('ctrl') || parts.includes('control');
						shift = parts.includes('shift');
						alt = parts.includes('alt');
					}

					if (key === 'space') key = ' ';
					if (key === 'ctrl' || key === 'control') key = 'control';

					this.patterns.push({
						intent: intent as ActionIntent,
						key,
						ctrl,
						shift,
						alt,
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
					const cleanLabel = __(`shortcuts:groups.${custom}`);
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

		// PREDEFINED ORDER (For aesthetic sorting)
		const predefinedOrder = [
			__('shortcuts:groups.rhythms'),
			__('shortcuts:groups.navigation'),
			__('shortcuts:groups.tools'),
			__('shortcuts:groups.magic'),
			__('shortcuts:groups.etching'),
			__('shortcuts:groups.flow'),
			__('shortcuts:groups.selection'),
			__('shortcuts:groups.transform'),
			__('shortcuts:groups.geometry'),
			__('shortcuts:groups.timeline'),
			__('shortcuts:groups.layers'),
			__('shortcuts:groups.edit'),
			__('shortcuts:groups.view'),
			__('shortcuts:groups.menu'),
			__('shortcuts:groups.colors'),
			__('shortcuts:groups.system')
		];

		// Collect all existing groups in the data
		const allGroups = Object.keys(groups);

		// Sort: Use predefined order if exists, otherwise push to the end
		allGroups.sort((a, b) => {
			const idxA = predefinedOrder.indexOf(a);
			const idxB = predefinedOrder.indexOf(b);
			const posA = idxA === -1 ? 999 : idxA;
			const posB = idxB === -1 ? 999 : idxB;
			return posA - posB;
		});

		return allGroups.map((name) => ({
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
