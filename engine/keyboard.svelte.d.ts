export type ActionIntent = 'MOVE_UP' | 'MOVE_DOWN' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'JUMP_HOME' | 'SET_POSITION' | 'GOTO' | 'RESET_PAN' | 'PAINT' | 'ERASE' | 'FLOOD_FILL' | 'BIND_VERTEX' | 'SEAL_BINDING' | 'PICK_COLOR' | 'SAVE' | 'OPEN' | 'OPEN_SETTINGS' | 'OPEN_MENU' | 'FLOW_PAINT' | 'FLOW_ERASE' | 'FLOW_SELECT' | 'SELECT_SAME' | 'UNDO' | 'REDO' | 'ZOOM_IN' | 'ZOOM_OUT' | 'RESET_ZOOM' | 'RESET_VIEWPORT' | 'OPEN_PALETTE' | 'OPEN_AUDIO' | 'OPEN_EXPORT' | 'OPEN_HELP' | 'OPEN_MANUAL' | 'PLAY_PAUSE' | 'TOGGLE_GHOST_LAYERS' | 'CLEAR_CANVAS' | 'TOGGLE_MUTE' | 'TOGGLE_MINIMAP' | 'ESCAPE' | 'COPY' | 'CUT' | 'PASTE' | 'RECOLOR' | 'FLIP_H' | 'FLIP_V' | 'ROTATE' | 'NEXT_FRAME' | 'PREV_FRAME' | 'TAB_TIMELINE' | 'TAB_LAYERS' | 'NEW_ITEM' | 'NEW_LAYER_GROUP' | 'DUPLICATE_ITEM' | 'DELETE_ITEM' | 'MOVE_ITEM_UP' | 'MOVE_ITEM_DOWN' | 'MOVE_ITEM_TOP' | 'MOVE_ITEM_BOTTOM' | 'TOGGLE_LAYER_LOCK' | 'TOGGLE_LAYER_VISIBILITY' | 'MERGE_LAYERS' | 'SWITCH_FOCUS' | 'BRUSH_SIZE_INC' | 'BRUSH_SIZE_DEC' | 'TOGGLE_PATTERN_BRUSH' | 'TOGGLE_BRUSH_SHAPE' | 'TOGGLE_HAND_TOOL' | 'CYCLE_SYMMETRY' | 'TOGGLE_TILING' | 'TOGGLE_AIRBRUSH' | 'TOGGLE_ALPHA_LOCK' | 'TOGGLE_COLOR_LOCK' | 'SHADE_LIGHTEN' | 'SHADE_DARKEN' | 'SHADE_DITHER' | 'TOGGLE_SHADE_LIGHTEN' | 'TOGGLE_SHADE_DARKEN' | 'TOGGLE_SHADE_DITHER' | 'TOOL_BRUSH' | 'TOOL_ERASER' | 'TOOL_SELECT' | 'TOGGLE_PIXEL_PERFECT' | 'TOOL_RECTANGLE' | 'TOOL_ELLIPSE' | 'TOOL_POLYGON' | 'POLY_SIDES_INC' | 'POLY_SIDES_DEC' | 'POLY_INDENT_INC' | 'POLY_INDENT_DEC' | 'SET_SIDES_3' | 'SET_SIDES_4' | 'SET_SIDES_5' | 'SET_SIDES_6' | 'SET_SIDES_7' | 'SET_SIDES_8' | 'SET_SIDES_9' | 'SET_SIDES_10' | 'TOGGLE_UNDERLAY' | 'OPEN_UNDERLAY_MENU' | 'TOOL_TRANSFORM' | 'TOOL_GRADIENT' | 'SELECT_COLOR_1' | 'SELECT_COLOR_2' | 'SELECT_COLOR_3' | 'SELECT_COLOR_4' | 'SELECT_COLOR_5' | 'SELECT_COLOR_6' | 'SELECT_COLOR_7' | 'SELECT_COLOR_8' | 'SELECT_COLOR_9' | 'SELECT_COLOR_0';
export declare class KeyboardEngine {
    private patterns;
    activeKeys: string[];
    isCtrlActive: boolean;
    isShiftActive: boolean;
    isAltActive: boolean;
    constructor();
    private loadPatterns;
    getActions(): {
        intent: ActionIntent;
        label: string;
        group: string;
        shortcut: string;
    }[];
    getGroupedActions(): {
        group: string;
        items: {
            intent: ActionIntent;
            label: string;
            group: string;
            shortcut: string;
        }[];
    }[];
    updatePhysicalState(e: KeyboardEvent, type: 'down' | 'up'): void;
    getIntent(e: KeyboardEvent): ActionIntent | null;
    getLabel(intent: ActionIntent): string;
}
export declare const keyboard: KeyboardEngine;
