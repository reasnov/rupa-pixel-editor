import { __ } from '$lib/state/i18n.svelte.js';
import { editor } from '../state/editor.svelte';
import { keyboard } from './keyboard.svelte.js';
import { sequence } from './sequence.svelte.js';

export type ModeType = 'READY' | 'PAINT' | 'ERASE' | 'SELECT' | 'PICK' | 'FLOW' | 'PAN';

interface ModeDescriptor {
	type: ModeType;
	label: string;
	icon: string;
	color: string;
	isPulse: boolean;
}

export class ModeEngine {
	current = $derived.by((): ModeDescriptor => {
		if (editor.studio.isHandToolActive || keyboard.activeKeys.includes('q')) {
			return {
				type: 'PAN',
				label: __({ key: 'labels.PAN_VIEWPORT' }),
				icon: '🤚',
				color: 'var(--color-brand)',
				isPulse: false
			};
		}

		if (sequence.isActive) {
			return {
				type: 'FLOW',
				label: __({ key: 'timeline.mode_labels.brewing' }),
				icon: '📑',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (editor.isPicking) {
			return {
				type: 'PICK',
				label: __({ key: 'timeline.mode_labels.tasting' }),
				icon: '📍',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (
			(keyboard.isCtrlActive && keyboard.isShiftActive) ||
			editor.studio.activeTool === 'ERASER'
		) {
			return {
				type: 'ERASE',
				label: __({ key: 'timeline.mode_labels.clearing' }),
				icon: '🧹',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (keyboard.isShiftActive || editor.studio.activeTool === 'SELECT') {
			return {
				type: 'SELECT',
				label: __({ key: 'timeline.mode_labels.selecting' }),
				icon: '✨',
				color: 'var(--color-brand)',
				isPulse: true
			};
		}

		if (
			keyboard.isCtrlActive ||
			editor.studio.isShadingLighten ||
			editor.studio.isShadingDarken ||
			editor.studio.isShadingDither
		) {
			return {
				type: 'PAINT',
				label: __({ key: 'timeline.mode_labels.pouring' }),
				icon: '☕',
				color: 'var(--color-green-leaves)',
				isPulse: true
			};
		}

		return {
			type: 'READY',
			label: __({ key: 'timeline.mode_labels.ready' }),
			icon: '',
			color: 'var(--color-studio-text)',
			isPulse: false
		};
	});
}

export const mode = new ModeEngine();
