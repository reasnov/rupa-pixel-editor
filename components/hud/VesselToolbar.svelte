<script lang="ts">
	import { __ } from '../../state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { editor as engine } from '../../engine/editor.svelte.js';
	import { fade, scale } from 'svelte/transition';

	const studio = editor.studio;

	// Tool Definitions
	const tools = [
		{ id: 'BRUSH', icon: '🖋️', intent: 'TOOL_BRUSH' as const, label: 'TOOL_BRUSH' },
		{ id: 'ERASER', icon: '🧹', intent: 'TOOL_ERASER' as const, label: 'TOOL_ERASER' },
		{ id: 'SELECT', icon: '✨', intent: 'TOOL_SELECT' as const, label: 'TOOL_SELECT' },
		{ id: 'RECTANGLE', icon: '📦', intent: 'TOOL_RECTANGLE' as const, label: 'TOOL_RECTANGLE' },
		{ id: 'ELLIPSE', icon: '⭕', intent: 'TOOL_ELLIPSE' as const, label: 'TOOL_ELLIPSE' },
		{ id: 'POLYGON', icon: '⭐', intent: 'TOOL_POLYGON' as const, label: 'TOOL_POLYGON' },
		{ id: 'GRADIENT', icon: '🌈', intent: 'TOOL_GRADIENT' as const, label: 'TOOL_GRADIENT' },
		{ id: 'HAND', icon: '🤚', intent: 'TOGGLE_HAND_TOOL' as const, label: 'TOGGLE_HAND_TOOL' }
	];

	const shading = [
		{
			id: 'lighten',
			icon: '☀️',
			intent: 'SHADE_LIGHTEN' as const,
			active: () => studio.isShadingLighten,
			label: 'SHADE_LIGHTEN'
		},
		{
			id: 'darken',
			icon: '🌙',
			intent: 'SHADE_DARKEN' as const,
			active: () => studio.isShadingDarken,
			label: 'SHADE_DARKEN'
		},
		{
			id: 'dither',
			icon: '🏁',
			intent: 'SHADE_DITHER' as const,
			active: () => studio.isShadingDither,
			label: 'SHADE_DITHER'
		}
	];

	// Toggle Definitions
	const toggles = [
		{
			id: 'symmetry',
			icon: '🪞',
			intent: 'CYCLE_SYMMETRY' as const,
			active: () => studio.symmetryMode !== 'OFF',
			label: 'CYCLE_SYMMETRY'
		},
		{
			id: 'tiling',
			icon: '∞',
			intent: 'TOGGLE_TILING' as const,
			active: () => studio.isTilingEnabled,
			label: 'TOGGLE_TILING'
		},
		{
			id: 'perfect',
			icon: '✨',
			intent: 'TOGGLE_PIXEL_PERFECT' as const,
			active: () => studio.isPixelPerfect,
			label: 'TOGGLE_PIXEL_PERFECT'
		},
		{
			id: 'stencil',
			icon: '🎨',
			intent: 'TOGGLE_PATTERN_BRUSH' as const,
			active: () => studio.isPatternBrushActive,
			label: 'TOGGLE_PATTERN_BRUSH',
			disabled: () => !editor.project.clipboard
		}
	];

	const locks = [
		{
			id: 'alpha',
			icon: 'A',
			intent: 'TOGGLE_ALPHA_LOCK' as const,
			active: () => studio.isAlphaLocked,
			label: 'TOGGLE_ALPHA_LOCK'
		},
		{
			id: 'color',
			icon: 'C',
			intent: 'TOGGLE_COLOR_LOCK' as const,
			active: () => studio.isColorLocked,
			label: 'TOGGLE_COLOR_LOCK'
		}
	];
</script>

<div
	class="vessel-toolbar custom-scrollbar flex h-full flex-col items-center gap-4 overflow-y-auto py-4"
>
	<!-- Main Vessels (Geometric Tools) -->
	<div class="flex flex-col gap-1.5">
		{#each tools as tool}
			<button
				class="tool-button {studio.activeTool === tool.id ? 'is-active' : ''}"
				title={__({ key: `labels.${tool.label}` })}
				onclick={() => engine.handleIntent(tool.intent)}
			>
				<span class="text-sm">{tool.icon}</span>
			</button>

			<!-- Polygon Sides Controller -->
			{#if tool.id === 'POLYGON' && studio.activeTool === 'POLYGON'}
				<div
					transition:fade
					class="absolute top-0 -left-12 flex flex-col items-center gap-1 rounded-md bg-white p-1 shadow-md ring-1 ring-black/5"
				>
					<button
						class="flex h-4 w-4 items-center justify-center text-[10px] hover:text-brand"
						onclick={() => engine.handleIntent('POLY_SIDES_INC')}
					>
						+
					</button>
					<span class="font-tiny5 text-[8px] text-brand">{studio.polygonSides}</span>
					<button
						class="flex h-4 w-4 items-center justify-center text-[10px] hover:text-brand"
						onclick={() => engine.handleIntent('POLY_SIDES_DEC')}
					>
						-
					</button>

					<div class="my-1 h-px w-2 bg-charcoal/10"></div>

					<!-- Indentation Control -->
					<div class="flex flex-col items-center gap-0.5">
						<button
							class="text-[8px] hover:text-brand"
							onclick={() =>
								(studio.polygonIndentation = Math.min(100, studio.polygonIndentation + 10))}
						>
							▴
						</button>
						<span class="text-[7px] font-bold text-brand/60">{studio.polygonIndentation}%</span>
						<button
							class="text-[8px] hover:text-brand"
							onclick={() =>
								(studio.polygonIndentation = Math.max(0, studio.polygonIndentation - 10))}
						>
							▾
						</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<div class="h-px w-4 bg-charcoal/10"></div>

	<!-- Shading & Toning -->
	<div class="flex flex-col gap-1.5">
		{#each shading as tool}
			<button
				class="tool-button {tool.active() ? 'is-active' : ''}"
				title={__({ key: `labels.${tool.label}` })}
				onclick={() => engine.handleIntent(tool.intent)}
			>
				<span class="text-sm">{tool.icon}</span>
			</button>
		{/each}
	</div>

	<div class="h-px w-4 bg-charcoal/10"></div>

	<!-- Stance Toggles -->
	<div class="flex flex-col gap-1.5">
		{#each toggles as toggle}
			<button
				class="tool-button {toggle.active() ? 'is-active' : ''} {toggle.disabled?.()
					? 'cursor-not-allowed opacity-20 grayscale'
					: ''}"
				title={__({ key: `labels.${toggle.label}` })}
				onclick={() => !toggle.disabled?.() && engine.handleIntent(toggle.intent)}
			>
				<span class="text-sm">{toggle.icon}</span>
			</button>
		{/each}
	</div>

	<div class="h-px w-4 bg-charcoal/10"></div>

	<!-- Seals (Locks) -->
	<div class="flex flex-col gap-1.5">
		{#each locks as lock}
			<button
				class="tool-button {lock.active() ? 'is-active' : ''} font-bold"
				title={__({ key: `labels.${lock.label}` })}
				onclick={() => engine.handleIntent(lock.intent)}
			>
				<span class="text-[10px]">{lock.icon}</span>
				{#if lock.active()}
					<div transition:scale class="absolute -top-1 -right-1 text-[8px]">🔒</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.vessel-toolbar {
		scrollbar-width: none; /* Firefox */
	}

	.vessel-toolbar::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}

	.tool-button {
		position: relative;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: var(--color-foam-white);
		border: 1px solid var(--color-stone-medium);
		color: var(--color-charcoal);
		transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.tool-button:hover {
		transform: translateY(-1px);
		border-color: var(--color-brand);
		box-shadow: 0 4px 12px rgba(211, 54, 130, 0.15);
	}

	.tool-button:active {
		transform: translateY(0);
	}

	.tool-button.is-active {
		background: var(--color-brand);
		color: white;
		border-color: var(--color-brand);
		box-shadow: 0 4px 15px rgba(211, 54, 130, 0.3);
	}
</style>
