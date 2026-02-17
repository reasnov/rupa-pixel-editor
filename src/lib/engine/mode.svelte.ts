import { editor } from '../state/editor.svelte';
import { keyboard } from './keyboard.svelte.js';
import { flow } from './flow.svelte.js';

export type ModeType = 'READY' | 'PAINT' | 'ERASE' | 'SELECT' | 'PICK' | 'FLOW';

interface ModeDescriptor {
	type: ModeType;
	label: string;
	icon: string;
	color: string;
	isPulse: boolean;
}

export class ModeEngine {
	current = $derived.by((): ModeDescriptor => {
		if (flow.isActive) {
			return {
				type: 'FLOW',
				label: 'Brewing...',
				icon: '📑',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (editor.isPicking) {
			return {
				type: 'PICK',
				label: 'Tasting...',
				icon: '📍',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (keyboard.isCtrlActive && keyboard.isShiftActive) {
			return {
				type: 'ERASE',
				label: 'Clearing',
				icon: '🧹',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (keyboard.isShiftActive) {
			return {
				type: 'SELECT',
				label: 'Selecting',
				icon: '✨',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (keyboard.isCtrlActive) {
			return {
				type: 'PAINT',
				label: 'Pouring',
				icon: '☕',
				color: 'var(--color-green-leaves)',
				isPulse: true
			};
		}

		return {
			type: 'READY',
			label: 'Café Ready',
			icon: '',
			color: 'var(--color-studio-text)',
			isPulse: false
		};
	});
}

export const mode = new ModeEngine();
