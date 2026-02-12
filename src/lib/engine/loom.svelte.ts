import { atelier } from '../state/atelier.svelte';
import { loompad, type LoomIntent } from './loompad.svelte';
import { stance } from './stance.svelte';
import { shuttle } from './shuttle';

export class TheLoom {
    
    handleInput(e: KeyboardEvent, type: 'down' | 'up') {
        if (!atelier.isAppReady) return;
        
        // 1. Update physical key ledger in LoomPad
        loompad.updatePhysicalState(e, type);

        // 2. Shield Check
        const target = e.target as HTMLElement;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable) {
            if (type === 'down' && e.key === 'Escape') atelier.handleEscape();
            return;
        }

        atelier.resetInactivityTimer();

        // 3. Contextual Flow Management (Holding modifiers)
        // We sync Atelier flags with LoomPad's resolved modifier state
        this.syncFlowStates();

        // 4. Momentary Action Resolution
        if (type === 'down') {
            const intent = loompad.getIntent(e);
            if (intent) this.executeIntent(intent, e);
        } else {
            this.handleKeyRelease(e);
        }
    }

    private syncFlowStates() {
        // High priority: Unravelling (Ctrl + Shift)
        if (loompad.isCtrlActive && loompad.isShiftActive) {
            atelier.isFlowUnstitch = true;
            atelier.isFlowSelect = false;
            atelier.isFlowStitch = false;
        } 
        // Medium priority: Looming (Shift only)
        else if (loompad.isShiftActive && !loompad.isCtrlActive) {
            atelier.isFlowSelect = true;
            atelier.isFlowUnstitch = false;
            atelier.isFlowStitch = false;
            if (!atelier.selectionStart) shuttle.startSelection();
        } 
        // Medium priority: Threading (Ctrl only)
        else if (loompad.isCtrlActive && !loompad.isShiftActive) {
            atelier.isFlowStitch = true;
            atelier.isFlowUnstitch = false;
            atelier.isFlowSelect = false;
        } 
        // Default: Resting
        else {
            atelier.isFlowStitch = false;
            atelier.isFlowUnstitch = false;
            atelier.isFlowSelect = false;
            atelier.selectionStart = null;
            atelier.selectionEnd = null;
        }
    }

    private executeIntent(intent: LoomIntent, e: KeyboardEvent) {
        const isNav = intent.startsWith('MOVE_');
        if (!isNav) e.preventDefault();

        switch (intent) {
            case 'MOVE_UP':    return this.executeMove(0, -1);
            case 'MOVE_DOWN':  return this.executeMove(0, 1);
            case 'MOVE_LEFT':  return this.executeMove(-1, 0);
            case 'MOVE_RIGHT': return this.executeMove(1, 0);

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

    private handleKeyRelease(e: KeyboardEvent) {
        // Handled by syncFlowStates on the next event cycle or via loompad update
    }

    private executeMove(dx: number, dy: number) {
        if (shuttle.moveNeedle(dx, dy)) {
            if (atelier.isFlowSelect) shuttle.updateSelection();
            if (atelier.isFlowStitch) shuttle.stitch();
            if (atelier.isFlowUnstitch) shuttle.unstitch();
        }
    }
}

export const loom = new TheLoom();
