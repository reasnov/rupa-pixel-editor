import { atelier } from '../state/atelier.svelte';
import { loompad } from './loompad.svelte';
import { weaving } from './weaving.svelte.js';

export type StanceType =
	| 'RESTING'
	| 'THREADING'
	| 'UNRAVELLING'
	| 'LOOMING'
	| 'PICKING'
	| 'ORGANIZING';

interface StanceDescriptor {
	type: StanceType;
	label: string;
	icon: string;
	color: string;
	isPulse: boolean;
}

export class StanceEngine {
	current = $derived.by((): StanceDescriptor => {
		if (weaving.isActive) {
			return {
				type: 'ORGANIZING',
				label: 'Weaving...',
				icon: '📑',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (atelier.isPicking) {
			return {
				type: 'PICKING',
				label: 'Picking Dye',
				icon: '📍',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		// Truth comes directly from the physical chord held on the LoomPad
		if (loompad.isCtrlActive && loompad.isShiftActive) {
			return {
				type: 'UNRAVELLING',
				label: 'Unravelling',
				icon: '🧶',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (loompad.isShiftActive) {
			return {
				type: 'LOOMING',
				label: 'Block Looming',
				icon: '✨',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (loompad.isCtrlActive) {
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
