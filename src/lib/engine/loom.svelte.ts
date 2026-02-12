import { atelier } from '../state/atelier.svelte';
import { loompad, type LoomIntent } from './loompad';
import { stance } from './stance.svelte';
import { shuttle } from './shuttle';

/**
 * The Loom: The Master Orchestrator.
 * It weaves together Input (LoomPad), Stance (State), and Action (Shuttle).
 */
export class TheLoom {
    
    handleInput(e: KeyboardEvent, type: 'down' | 'up') {
        if (!atelier.isAppReady) return;
        atelier.resetInactivityTimer();

        // 1. Protection Shield (Inputs)
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
            if (e.key === 'Escape') atelier.handleEscape();
            return;
        }

        // 2. Identify Intent via LoomPad
        const intent = loompad.getIntent(e, type);
        const key = e.key.toLowerCase();

        if (type === 'down') {
            this.processKeyDown(intent, e);
        } else {
            this.processKeyUp(intent, key);
        }
    }

    private processKeyDown(intent: LoomIntent | null, e: KeyboardEvent) {
        if (!intent) return;

        // Prevent browser defaults for matched intents (except navigation)
        if (!intent.startsWith('MOVE_')) e.preventDefault();

        switch (intent) {
            // --- Navigation Intents ---
            case 'MOVE_UP':    return shuttle.moveNeedle(0, -1);
            case 'MOVE_DOWN':  return shuttle.moveNeedle(0, 1);
            case 'MOVE_LEFT':  return shuttle.moveNeedle(-1, 0);
            case 'MOVE_RIGHT': return shuttle.moveNeedle(1, 0);

            // --- Sustained Flow States (Flags) ---
            case 'FLOW_SELECT':
                atelier.isFlowSelect = true;
                if (!atelier.selectionStart) atelier.startSelection();
                return;
            
            case 'FLOW_STITCH':
                return (atelier.isFlowStitch = true);
            
            case 'FLOW_UNSTITCH':
                atelier.isFlowUnstitch = true;
                return (atelier.isFlowSelect = false); // Priority

            // --- Momentary Action Intents ---
            case 'STITCH':
                if (stance.current.type === 'LOOMING') return shuttle.commitSelection();
                return shuttle.stitch();
            
            case 'UNSTITCH': return shuttle.unstitch();
            case 'PICK_DYE': return shuttle.pickDye();
            
            case 'COPY':  return shuttle.copy();
            case 'CUT':   return shuttle.cut();
            case 'PASTE': return shuttle.paste();
            
            case 'UNDO': return atelier.undo();
            case 'REDO': return atelier.redo();
            
            case 'SAVE': return shuttle.save();
            case 'OPEN': return shuttle.load();
            
            case 'ESCAPE': return atelier.handleEscape();
            
            // --- UI & View Intents ---
            case 'OPEN_PALETTE': return (atelier.showPatternCatalog = !atelier.showPatternCatalog);
            case 'OPEN_DYES':    return (atelier.showDyeBasin = !atelier.showDyeBasin);
            case 'OPEN_EXPORT':  return (atelier.showArtifactCrate = true);
            case 'OPEN_HELP':    return (atelier.showArtisanGuide = true);
            
            case 'ZOOM_IN':    return atelier.setZoom(0.1);
            case 'ZOOM_OUT':   return atelier.setZoom(-0.1);
            case 'RESET_ZOOM': return atelier.resetZoom();
            
            case 'CLEAR_LINEN': return shuttle.clearLinen();
            case 'TOGGLE_MUTE': return atelier.toggleMute();

            default:
                if (intent.startsWith('SELECT_DYE_')) {
                    const num = parseInt(intent.split('_')[2]);
                    return atelier.selectPalette(num === 0 ? 9 : num - 1);
                }
        }
    }

    private processKeyUp(intent: LoomIntent | null, key: string) {
        if (intent === 'FLOW_STITCH' || key === 'control' || key === 'meta') {
            atelier.isFlowStitch = false;
        } 
        
        if (intent === 'FLOW_UNSTITCH' || key === 'alt') {
            atelier.isFlowUnstitch = false;
        } 
        
        if (intent === 'FLOW_SELECT' || key === 'shift') {
            atelier.isFlowSelect = false;
            atelier.selectionStart = null;
            atelier.selectionEnd = null;
        }
    }
}

export const loom = new TheLoom();
