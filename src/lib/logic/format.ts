import { __ } from '../state/i18n.svelte.js';

/**
 * FormatLogic: Centralized unit and number formatting for the UI.
 * Ensures consistent technical and artisan labeling.
 */
export class FormatLogic {
	static pixels(value: number): string {
		return `${value} ${__('ui:units.pixels')}`;
	}

	static percentage(value: number): string {
		return `${Math.round(value * 100)}%`;
	}

	static framesPerSecond(value: number): string {
		return `${value} ${__('ui:units.fps')}`;
	}

	static milliseconds(value: number): string {
		return `${value}${__('ui:units.ms')}`;
	}
}
