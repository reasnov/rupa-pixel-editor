<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';

	const studio = editor.studio;
</script>

<div class="flex items-center gap-3 font-serif text-[10px] tracking-wide text-charcoal/60">
	<!-- Brush Size & Shape -->
	<div class="flex items-center gap-1" title={__({ key: 'shortcut_labels.BRUSH_SIZE_INC' })}>
		<span class="text-[8px] uppercase opacity-40">{__({ key: 'shortcut_groups.etching' })}</span>
		<span class="font-bold text-brand">{studio.brushSize}px</span>
		<span class="opacity-40">{studio.brushShape === 'SQUARE' ? '■' : '●'}</span>
	</div>

	<!-- Symmetry -->
	{#if studio.symmetryMode !== 'OFF'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-brand/5 px-1.5 py-0.5 text-brand"
			title={__({ key: 'shortcut_labels.CYCLE_SYMMETRY' })}
		>
			<span class="text-[8px] font-bold">SYM:</span>
			<span class="font-black">
				{#if studio.symmetryMode === 'HORIZONTAL'}—{:else if studio.symmetryMode === 'VERTICAL'}|{:else}
					+
				{/if}
			</span>
		</div>
	{/if}

	<!-- Locks -->
	{#if studio.isAlphaLocked || studio.isColorLocked}
		<div transition:fade class="flex items-center gap-1 text-brand">
			{#if studio.isAlphaLocked}
				<span title={__({ key: 'shortcut_labels.TOGGLE_ALPHA_LOCK' })}>🔒A</span>
			{/if}
			{#if studio.isColorLocked}
				<span title={__({ key: 'shortcut_labels.TOGGLE_COLOR_LOCK' })}>🔒C</span>
			{/if}
		</div>
	{/if}

	<!-- Tiling -->
	{#if studio.isTilingEnabled}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-brand/10 px-1.5 py-0.5 font-bold text-brand"
			title={__({ key: 'shortcut_labels.TOGGLE_TILING' })}
		>
			∞
		</div>
	{/if}

	<!-- Pixel-Perfect -->
	{#if studio.isPixelPerfect}
		<div
			transition:fade
			class="bg-green-leaves/10 text-green-leaves flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-bold"
			title={__({ key: 'shortcut_labels.TOGGLE_PIXEL_PERFECT' })}
		>
			✨ PURE
		</div>
	{/if}

	<!-- Transform -->
	{#if studio.isTransforming}
		<div
			transition:fade
			class="flex animate-pulse items-center gap-1 rounded-sm bg-brand/20 px-1.5 py-0.5 font-bold text-brand"
			title={__({ key: 'shortcut_labels.TOOL_TRANSFORM' })}
		>
			🚚 MOVING
		</div>
	{/if}

	<!-- Pattern Brush -->
	{#if studio.isPatternBrushActive}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-brand/10 px-1.5 py-0.5 font-bold text-brand"
			title={__({ key: 'shortcut_labels.TOGGLE_PATTERN_BRUSH' })}
		>
			🎨 STENCIL
		</div>
	{/if}

	<!-- Gradient -->
	{#if studio.activeTool === 'GRADIENT'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-brand/10 px-1.5 py-0.5 font-bold text-brand"
			title={__({ key: 'shortcut_labels.TOOL_GRADIENT' })}
		>
			🌈 GRADIENT
		</div>
	{/if}

	<!-- Geometric Tools -->
	{#if studio.activeTool === 'RECTANGLE'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-brand/10 px-1.5 py-0.5 font-bold text-brand"
			title={__({ key: 'shortcut_labels.TOOL_RECTANGLE' })}
		>
			📦 BOX
		</div>
	{/if}

	{#if studio.activeTool === 'ELLIPSE'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-brand/10 px-1.5 py-0.5 font-bold text-brand"
			title={__({ key: 'shortcut_labels.TOOL_ELLIPSE' })}
		>
			⭕ ROUND
		</div>
	{/if}
</div>
