import shortcutsData from '../config/shortcuts.json';

/**
 * LoomPad Action: Semantic identifier for what the user wants to achieve.
 */
export type LoomIntent = 
    | 'MOVE_UP' | 'MOVE_DOWN' | 'MOVE_LEFT' | 'MOVE_RIGHT'
    | 'STITCH' | 'UNSTITCH' | 'PICK_DYE'
    | 'SAVE' | 'OPEN'
    | 'FLOW_STITCH' | 'FLOW_UNSTITCH' | 'FLOW_SELECT'
    | 'UNDO' | 'REDO' | 'ZOOM_IN' | 'ZOOM_OUT' | 'RESET_ZOOM'
    | 'OPEN_PALETTE' | 'OPEN_DYES' | 'OPEN_EXPORT' | 'OPEN_HELP'
    | 'CLEAR_LINEN' | 'TOGGLE_MUTE' | 'ESCAPE'
    | 'COPY' | 'CUT' | 'PASTE'
    | 'FLIP_H' | 'FLIP_V' | 'ROTATE'
    | 'SELECT_DYE_1' | 'SELECT_DYE_2' | 'SELECT_DYE_3' | 'SELECT_DYE_4' | 'SELECT_DYE_5'
    | 'SELECT_DYE_6' | 'SELECT_DYE_7' | 'SELECT_DYE_8' | 'SELECT_DYE_9' | 'SELECT_DYE_0';

interface LoomPattern {
    intent: LoomIntent;
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}

export class LoomPadEngine {
    private patterns: LoomPattern[] = [];
    private activeKeys = new Set<string>();

    constructor() {
        this.loadPatterns();
    }

    /**
     * Map the legacy shortcuts.json to LoomPad Patterns
     */
    private loadPatterns() {
        // This maps our current JSON structure to the advanced Pattern engine
        const mapping: Record<string, LoomIntent> = {
            'UP': 'MOVE_UP', 'DOWN': 'MOVE_DOWN', 'LEFT': 'MOVE_LEFT', 'RIGHT': 'MOVE_RIGHT',
            'STITCH': 'STITCH', 'UNSTITCH': 'UNSTITCH', 'EYEDROPPER': 'PICK_DYE',
            'SAVE': 'SAVE', 'OPEN': 'OPEN',
            'FLOW_STITCH': 'FLOW_STITCH', 'FLOW_UNSTITCH': 'FLOW_UNSTITCH', 'FLOW_SELECT': 'FLOW_SELECT',
            'UNDO': 'UNDO', 'REDO': 'REDO', 'ZOOM_IN': 'ZOOM_IN', 'ZOOM_OUT': 'ZOOM_OUT', 'RESET_ZOOM': 'RESET_ZOOM',
            'COMMAND_PALETTE': 'OPEN_PALETTE', 'COLOR_PICKER': 'OPEN_DYES', 'EXPORT': 'OPEN_EXPORT',
            'CLEAR_LINEN': 'CLEAR_LINEN', 'TOGGLE_MUTE': 'TOGGLE_MUTE', 'ESCAPE': 'ESCAPE',
            'COPY': 'COPY', 'CUT': 'CUT', 'PASTE': 'PASTE',
            'FLIP_H': 'FLIP_H', 'FLIP_V': 'FLIP_V', 'ROTATE': 'ROTATE',
            'SELECT_1': 'SELECT_DYE_1', 'SELECT_2': 'SELECT_DYE_2', 'SELECT_3': 'SELECT_DYE_3',
            'SELECT_4': 'SELECT_DYE_4', 'SELECT_5': 'SELECT_DYE_5', 'SELECT_6': 'SELECT_DYE_6',
            'SELECT_7': 'SELECT_DYE_7', 'SELECT_8': 'SELECT_DYE_8', 'SELECT_9': 'SELECT_DYE_9', 'SELECT_0': 'SELECT_DYE_0'
        };

        Object.values(shortcutsData).forEach(category => {
            Object.entries(category).forEach(([action, keys]) => {
                const intent = mapping[action];
                if (!intent) return;

                (keys as string[]).forEach(keyCombo => {
                    const parts = keyCombo.toLowerCase().split('+');
                    let key = parts[parts.length - 1];
                    
                    // Normalize modifier keys to their e.key values
                    if (key === 'ctrl') key = 'control';
                    if (key === 'meta') key = 'meta';
                    if (key === 'shift') key = 'shift';
                    if (key === 'alt') key = 'alt';

                    this.patterns.push({
                        intent,
                        key: key === ' ' ? ' ' : key,
                        ctrl: parts.includes('ctrl') || parts.includes('control'),
                        shift: parts.includes('shift'),
                        alt: parts.includes('alt'),
                        meta: parts.includes('meta') || parts.includes('cmd')
                    });
                });
            });
        });

        // Sort patterns by complexity (more modifiers = higher priority)
        this.patterns.sort((a, b) => {
            const getScore = (p: LoomPattern) => (p.ctrl ? 1 : 0) + (p.shift ? 1 : 0) + (p.alt ? 1 : 0);
            return getScore(b) - getScore(a);
        });
    }

    /**
     * Process a keyboard event and return the matching Intent.
     */
    getIntent(e: KeyboardEvent, type: 'down' | 'up'): LoomIntent | null {
        const key = e.key.toLowerCase();
        
        if (type === 'down') this.activeKeys.add(key);
        else this.activeKeys.delete(key);

        // Normalize modifiers, but IF the key itself is a modifier, 
        // we treat its contribution to the state as 'false' for matching purposes
        // to allow it to match its own pattern.
        const isCtrl = (e.ctrlKey || e.metaKey) && key !== 'control' && key !== 'meta';
        const isShift = e.shiftKey && key !== 'shift';
        const isAlt = e.altKey && key !== 'alt';

        // Navigation check (special handling to allow flow states)
        const navKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
        const isNav = navKeys.includes(key);

        for (const pattern of this.patterns) {
            // Precise matching for regular actions
            const keyMatch = key === pattern.key || e.code.toLowerCase() === `key${pattern.key}`;
            
            // If it's navigation, we only match the key, modifiers are handled by the consumer
            if (isNav && ['MOVE_UP', 'MOVE_DOWN', 'MOVE_LEFT', 'MOVE_RIGHT'].includes(pattern.intent)) {
                if (key === pattern.key) return pattern.intent;
                continue;
            }

            if (
                keyMatch &&
                isCtrl === !!pattern.ctrl &&
                isShift === !!pattern.shift &&
                isAlt === !!pattern.alt
            ) {
                return pattern.intent;
            }
        }

        return null;
    }

    /**
     * Helper to get visual label for an intent
     */
    getLabel(intent: LoomIntent): string {
        const p = this.patterns.find(p => p.intent === intent);
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
