<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';

	const studio = editor.studio;
</script>

<div class="flex items-center gap-3 font-serif text-[10px] tracking-wide text-evergreen/60">
	<!-- Brush Size & Shape -->
	<div class="flex items-center gap-1" title={__('common:labels.BRUSH_SIZE_INC')}>
		<span class="text-[8px] uppercase opacity-40">{__('shortcuts:groups.etching')}</span>
		<span class="font-bold text-lantern-gold">{studio.brushSize}px</span>
		<span class="opacity-40">{studio.brushShape === 'SQUARE' ? '■' : '●'}</span>
	</div>

	<!-- Symmetry -->
	{#if studio.symmetryMode !== 'OFF'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/5 px-1.5 py-0.5 text-lantern-gold"
			title={__('common:labels.CYCLE_SYMMETRY')}
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
		<div transition:fade class="flex items-center gap-1 text-lantern-gold">
			{#if studio.isAlphaLocked}
				<span title={__('common:labels.TOGGLE_ALPHA_LOCK')}>🔒A</span>
			{/if}
			{#if studio.isColorLocked}
				<span title={__('common:labels.TOGGLE_COLOR_LOCK')}>🔒C</span>
			{/if}
		</div>
	{/if}

	<!-- Tiling -->
	{#if studio.isTilingEnabled}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_TILING')}
		>
			∞
		</div>
	{/if}

	<!-- Airbrush (The Mist) -->
	{#if studio.isAirbrushActive}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_AIRBRUSH')}
		>
			☁️ MIST
		</div>
	{/if}

	<!-- Pixel-Perfect -->
	{#if studio.isPixelPerfect}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-fern-green/10 px-1.5 py-0.5 font-bold text-fern-green"
			title={__('common:labels.TOGGLE_PIXEL_PERFECT')}
		>
			✨ PURE
		</div>
	{/if}

	<!-- Transform -->
	{#if studio.isTransforming}
		<div
			transition:fade
			class="flex animate-pulse items-center gap-1 rounded-sm bg-lantern-gold/20 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOOL_TRANSFORM')}
		>
			🧺 MOVING
		</div>
	{/if}

	<!-- Pattern Brush -->
	{#if studio.isPatternBrushActive}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_PATTERN_BRUSH')}
		>
			🎨 STENCIL
		</div>
	{/if}

	<!-- Aroma Blend (Dither) -->
	{#if studio.isDitherBlendActive}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_DITHER_BLEND')}
		>
			🌿 BLEND ({studio.brushHardness}%)
		</div>
	{/if}

	<!-- Geometric Tools -->
	{#if studio.activeTool === 'RECTANGLE'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOOL_RECTANGLE')}
		>
			📦 BOX
		</div>
	{/if}

	{#if studio.activeTool === 'ELLIPSE'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOOL_ELLIPSE')}
		>
			⭕ ROUND
		</div>
	{/if}

	{#if studio.activeTool === 'POLYGON'}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOOL_POLYGON')}
		>
			⭐ POLY ({studio.polygonSides})
		</div>
	{/if}

	<!-- Shading Status -->
	{#if studio.isShadingLighten}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_SHADE_LIGHTEN')}
		>
			☀️ LIGHT
		</div>
	{/if}
	{#if studio.isShadingDarken}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_SHADE_DARKEN')}
		>
			🌙 DARK
		</div>
	{/if}
	{#if studio.isShadingDither}
		<div
			transition:fade
			class="flex items-center gap-1 rounded-sm bg-lantern-gold/10 px-1.5 py-0.5 font-bold text-lantern-gold"
			title={__('common:labels.TOGGLE_SHADE_DITHER')}
		>
			🏁 DITHER
		</div>
	{/if}
</div>
