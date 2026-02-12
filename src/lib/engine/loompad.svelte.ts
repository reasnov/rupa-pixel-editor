import shortcutsData from '../config/shortcuts.json';

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
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
}

export class LoomPadEngine {
    private patterns: LoomPattern[] = [];
    
    // Reactive tracking for UI debugging
    activeKeys = $state<Set<string>>(new Set());
    
    // The "Resolved State" based on current physical grip
    isCtrlActive = $state(false);
    isShiftActive = $state(false);
    isAltActive = $state(false);

    constructor() {
        this.loadPatterns();
    }

    private loadPatterns() {
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
                    if (key === 'ctrl' || key === 'control') key = 'control';
                    this.patterns.push({
                        intent,
                        key: key === ' ' ? ' ' : key,
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
     * It updates the "Grip" (the set of keys currently touching the loom).
     */
    updatePhysicalState(e: KeyboardEvent, type: 'down' | 'up') {
        const key = e.key.toLowerCase();
        if (type === 'down') {
            this.activeKeys.add(key);
        } else {
            this.activeKeys.delete(key);
        }

        // Sync modifier states immediately
        this.isCtrlActive = e.ctrlKey || e.metaKey;
        this.isShiftActive = e.shiftKey;
        this.isAltActive = e.altKey;
    }

    /**
     * Intent Resolution: Decides what action to take based on current grip.
     */
    getIntent(e: KeyboardEvent): LoomIntent | null {
        const key = e.key.toLowerCase();
        
        // Navigation is prioritized
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            if (key === 'arrowup') return 'MOVE_UP';
            if (key === 'arrowdown') return 'MOVE_DOWN';
            if (key === 'arrowleft') return 'MOVE_LEFT';
            if (key === 'arrowright') return 'MOVE_RIGHT';
        }

        // Search for the best pattern match given current modifiers
        for (const pattern of this.patterns) {
            const keyMatch = key === pattern.key;
            
            if (keyMatch && 
                this.isCtrlActive === pattern.ctrl && 
                this.isShiftActive === pattern.shift && 
                this.isAltActive === pattern.alt) {
                return pattern.intent;
            }
        }
        return null;
    }

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
