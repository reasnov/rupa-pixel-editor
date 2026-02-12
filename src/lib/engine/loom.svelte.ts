import { atelier } from '../state/atelier.svelte';
import { loompad, type LoomIntent } from './loompad';
import { stance } from './stance.svelte';
import { shuttle } from './shuttle';

export class TheLoom {
    
    handleInput(e: KeyboardEvent, type: 'down' | 'up') {
        if (!atelier.isAppReady) return;
        
        // 1. Precise Protection Shield
        const target = e.target as HTMLElement;
        const isWriting = target instanceof HTMLInputElement || 
                          target instanceof HTMLTextAreaElement || 
                          target.isContentEditable;

        if (isWriting) {
            if (type === 'down' && e.key === 'Escape') atelier.handleEscape();
            return;
        }

        atelier.resetInactivityTimer();

        // 2. Identify Intent
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

        // Prevent browser defaults for matched intents
        // CRITICAL: NEVER prevent default on pure modifiers or navigation
        const isModifier = ['control', 'shift', 'alt', 'meta'].includes(e.key.toLowerCase());
        const isNav = intent.startsWith('MOVE_');
        
        if (!isModifier && !isNav) {
            e.preventDefault();
        }

        switch (intent) {
            case 'MOVE_UP':    return this.executeMove(0, -1);
            case 'MOVE_DOWN':  return this.executeMove(0, 1);
            case 'MOVE_LEFT':  return this.executeMove(-1, 0);
            case 'MOVE_RIGHT': return this.executeMove(1, 0);

            case 'FLOW_STITCH':   return (atelier.isFlowStitch = true);
            case 'FLOW_UNSTITCH': 
                atelier.isFlowUnstitch = true;
                atelier.isFlowSelect = false; // Priority: Erasing overrides Selecting
                return;
            case 'FLOW_SELECT':
                // Only start selecting if we are NOT currently unravelling
                if (!atelier.isFlowUnstitch) {
                    atelier.isFlowSelect = true;
                    if (!atelier.selectionStart) shuttle.startSelection();
                }
                return;

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
            atelier.isFlowUnstitch = false; // Break chord
        } 
        
        if (intent === 'FLOW_SELECT' || key === 'shift') {
            atelier.isFlowSelect = false;
            atelier.isFlowUnstitch = false; // Break chord
            atelier.selectionStart = null;
            atelier.selectionEnd = null;
        }

        if (key === 'alt') {
            // Keep state clean even if alt is not a flow trigger yet
        }
    }

    private executeMove(dx: number, dy: number) {
        if (shuttle.moveNeedle(dx, dy)) {
            // Check flags directly from AtelierState
            if (atelier.isFlowSelect) shuttle.updateSelection();
            if (atelier.isFlowStitch) shuttle.stitch();
            if (atelier.isFlowUnstitch) shuttle.unstitch();
        }
    }
}

export const loom = new TheLoom();
