import { describe, it, expect, vi } from 'vitest';
import { FormatLogic } from '../../lib/logic/format.js';

// Mock i18n
vi.mock('../../lib/state/i18n.svelte.js', () => ({
	__: vi.fn((key) => {
		if (key === 'ui:units.pixels') return 'px';
		if (key === 'ui:units.fps') return 'fps';
		if (key === 'ui:units.ms') return 'ms';
		return key;
	})
}));

describe('FormatLogic', () => {
	it('pixels should format with px unit', () => {
		expect(FormatLogic.pixels(100)).toBe('100 px');
	});

	it('percentage should format with % symbol and round', () => {
		expect(FormatLogic.percentage(0.555)).toBe('56%');
		expect(FormatLogic.percentage(1)).toBe('100%');
	});

	it('framesPerSecond should format with fps unit', () => {
		expect(FormatLogic.framesPerSecond(24)).toBe('24 fps');
	});

	it('milliseconds should format with ms unit', () => {
		expect(FormatLogic.milliseconds(500)).toBe('500ms');
	});
});
