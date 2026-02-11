import shortcutsData from '../config/shortcuts.json';

export type ShortcutAction = 
	| 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
	| 'STITCH' | 'UNSTITCH' | 'UNSTITCH_MOD' | 'EYEDROPPER'
	| 'UNDO' | 'REDO'
	| 'ZOOM_IN' | 'ZOOM_OUT' | 'RESET_ZOOM'
	| 'COMMAND_PALETTE' | 'EXPORT' | 'COLOR_PICKER' | 'CLEAR_LINEN' | 'TOGGLE_MUTE' | 'ESCAPE'
	| 'SELECT_1' | 'SELECT_2' | 'SELECT_3' | 'SELECT_4' | 'SELECT_5' | 'SELECT_6' | 'SELECT_7' | 'SELECT_8' | 'SELECT_9' | 'SELECT_0';

export class ShortcutManager {
	private mappings: Record<string, string[]> = {};

	constructor() {
		// Flatten the JSON structure for easier lookups
		Object.values(shortcutsData).forEach(category => {
			Object.entries(category).forEach(([action, keys]) => {
				this.mappings[action] = keys as string[];
			});
		});
	}

	/**
	 * Checks if a keyboard event matches a specific action
	 */
	matches(e: KeyboardEvent, action: ShortcutAction): boolean {
		const keys = this.mappings[action];
		if (!keys) return false;

		const eventKey = e.key.toLowerCase();
		const isCtrl = e.ctrlKey || e.metaKey;
		const isShift = e.shiftKey;
		const isAlt = e.altKey;

		return keys.some(keyCombo => {
			const parts = keyCombo.toLowerCase().split('+');
			const targetKey = parts[parts.length - 1];
			
			const needsCtrl = parts.includes('ctrl');
			const needsShift = parts.includes('shift');
			const needsAlt = parts.includes('alt');

			// If it's a single key like 'Backspace' or 'ArrowUp', 
			// check if modifiers match (usually none if not specified)
			if (parts.length === 1) {
				return eventKey === targetKey.toLowerCase() && !isCtrl && !isAlt;
			}

			// For combos like 'Ctrl+z'
			return eventKey === targetKey.toLowerCase() && 
				   isCtrl === needsCtrl && 
				   isShift === needsShift && 
				   isAlt === needsAlt;
		});
	}

	/**
	 * Gets the first shortcut string for a given action (for display)
	 */
	getLabel(action: ShortcutAction): string {
		const keys = this.mappings[action];
		return keys ? keys[0] : '';
	}
}

export const shortcuts = new ShortcutManager();
