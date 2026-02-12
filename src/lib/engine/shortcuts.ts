import shortcutsData from '../config/shortcuts.json';

export type ShortcutAction =
	| 'UP'
	| 'DOWN'
	| 'LEFT'
	| 'RIGHT'
	| 'STITCH'
	| 'UNSTITCH'
	| 'UNSTITCH_MOD'
	| 'EYEDROPPER'
	| 'UNDO'
	| 'REDO'
	| 'ZOOM_IN'
	| 'ZOOM_OUT'
	| 'RESET_ZOOM'
	| 'COMMAND_PALETTE'
	| 'EXPORT'
	| 'COLOR_PICKER'
	| 'CLEAR_LINEN'
	| 'TOGGLE_MUTE'
	| 'ESCAPE'
	| 'SELECT_1'
	| 'SELECT_2'
	| 'SELECT_3'
	| 'SELECT_4'
	| 'SELECT_5'
	| 'SELECT_6'
	| 'SELECT_7'
	| 'SELECT_8'
	| 'SELECT_9'
	| 'SELECT_0';

interface ShortcutDefinition {
	action: ShortcutAction;
	key: string;
	modifiers: {
		ctrl: boolean;
		shift: boolean;
		alt: boolean;
	};
	modifierCount: number;
}

export class ShortcutManager {
	private definitions: ShortcutDefinition[] = [];

	constructor() {
		// Parse and flat the JSON into a searchable list with priority
		Object.values(shortcutsData).forEach((category) => {
			Object.entries(category).forEach(([action, keys]) => {
				(keys as string[]).forEach((keyCombo) => {
					const parts = keyCombo.toLowerCase().split('+');
					const targetKey = parts[parts.length - 1];

					const ctrl = parts.includes('ctrl');
					const shift = parts.includes('shift');
					const alt = parts.includes('alt');

					this.definitions.push({
						action: action as ShortcutAction,
						key: targetKey,
						modifiers: { ctrl, shift, alt },
						modifierCount: (ctrl ? 1 : 0) + (shift ? 1 : 0) + (alt ? 1 : 0)
					});
				});
			});
		});

		// Sort by modifier count descending (most specific first)
		this.definitions.sort((a, b) => b.modifierCount - a.modifierCount);
	}

	/**
	 * Finds the BEST matching action for a keyboard event.
	 * Returns null if no match found.
	 */
	getBestMatch(e: KeyboardEvent): ShortcutAction | null {
		const eventKey = e.key.toLowerCase();
		const isCtrl = e.ctrlKey || e.metaKey;
		const isShift = e.shiftKey;
		const isAlt = e.altKey;

		for (const def of this.definitions) {
			const keyMatch = eventKey === def.key || e.code.toLowerCase() === `key${def.key}`;

			// Navigation is a special case: we allow extra modifiers
			// because they trigger "modes" (Flow, Block) rather than different actions.
			const isNav = ['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(def.action);

			if (isNav) {
				if (eventKey === def.key || e.key === def.key) return def.action;
				continue;
			}

			// Strict matching for everything else
			if (
				keyMatch &&
				isCtrl === def.modifiers.ctrl &&
				isShift === def.modifiers.shift &&
				isAlt === def.modifiers.alt
			) {
				return def.action;
			}
		}

		return null;
	}

	getLabel(action: ShortcutAction): string {
		const def = this.definitions.find((d) => d.action === action);
		return def ? def.key.toUpperCase() : '';
	}
}

export const shortcuts = new ShortcutManager();
