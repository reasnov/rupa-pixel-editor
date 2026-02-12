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

        if (atelier.isFlowSelect) {
            return {
                type: 'LOOMING',
                label: 'Block Looming',
                icon: '✨',
                color: 'var(--color-brand)',
                isPulse: true
            };
        }

        if (atelier.isFlowUnstitch) {
            return {
                type: 'UNRAVELLING',
                label: 'Unravelling',
                icon: '🧶',
                color: 'var(--color-brand)',
                isPulse: true
            };
        }

        if (atelier.isFlowStitch) {
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
