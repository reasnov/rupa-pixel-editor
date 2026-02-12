import { atelier } from '../state/atelier.svelte';

export type StanceType = 'RESTING' | 'THREADING' | 'UNRAVELLING' | 'LOOMING' | 'PICKING';

interface StanceDescriptor {
    type: StanceType;
    label: string;
    icon: string;
    color: string;
    isPulse: boolean;
}

export class StanceEngine {
    // Current stance is derived automatically from the Atelier's raw flags
    current = $derived.by((): StanceDescriptor => {
        if (atelier.isPicking) {
            return {
                type: 'PICKING',
                label: 'Picking Dye',
                icon: '📍',
                color: 'var(--color-brand)',
                isPulse: true
            };
        }

        if (atelier.isSelecting) {
            return {
                type: 'LOOMING',
                label: 'Block Looming',
                icon: '✨',
                color: 'var(--color-brand)',
                isPulse: true
            };
        }

        if (atelier.isAltPressed) {
            return {
                type: 'UNRAVELLING',
                label: 'Unravelling',
                icon: '🧶',
                color: 'var(--color-studio-warm)',
                isPulse: true
            };
        }

        if (atelier.isCtrlPressed) {
            return {
                type: 'THREADING',
                label: 'Threading',
                icon: '🧵',
                color: 'var(--color-studio-teal)',
                isPulse: true
            };
        }

        return {
            type: 'RESTING',
            label: 'Studio Ready',
            icon: '',
            color: 'var(--color-studio-text)',
            isPulse: false
        };
    });
}

export const stance = new StanceEngine();
