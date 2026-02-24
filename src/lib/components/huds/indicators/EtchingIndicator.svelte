<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';
	import Badge from '../../elements/Badge.svelte';
	import Tooltip from '../../elements/Tooltip.svelte';

	const studio = editor.studio;
</script>

<div class="flex items-center gap-3 font-serif text-[10px] tracking-wide text-text-main/60">
	<!-- Brush Size & Shape -->
	<Tooltip text="actions:brush_size_inc">
		<div class="flex items-center gap-1">
			<span class="text-[8px] uppercase opacity-40">{__('shortcuts:groups.etching')}</span>
			<span class="font-bold text-ui-accent">{studio.brushSize}px</span>
			<span class="opacity-40">{studio.brushShape === 'SQUARE' ? '■' : '●'}</span>
		</div>
	</Tooltip>

	<!-- Symmetry -->
	{#if studio.symmetryMode !== 'OFF'}
		<Tooltip text="actions:cycle_symmetry">
			<div transition:fade>
				<Badge variant="primary" size="sm">
					{__('actions:cycle_symmetry')}: {#if studio.symmetryMode === 'HORIZONTAL'}—{:else if studio.symmetryMode === 'VERTICAL'}|{:else}+{/if}
				</Badge>
			</div>
		</Tooltip>
	{/if}

	<!-- Locks -->
	{#if studio.isAlphaLocked || studio.isColorLocked}
		<div transition:fade class="flex items-center gap-1 text-ui-accent">
			{#if studio.isAlphaLocked}
				<Tooltip text="actions:toggle_alpha_lock">
					<span>🔒A</span>
				</Tooltip>
			{/if}
			{#if studio.isColorLocked}
				<Tooltip text="actions:toggle_color_lock">
					<span>🔒C</span>
				</Tooltip>
			{/if}
		</div>
	{/if}

	<!-- Tiling -->
	{#if studio.isTilingEnabled}
		<Tooltip text="actions:toggle_tiling">
			<div transition:fade>
				<Badge variant="primary" size="sm">∞</Badge>
			</div>
		</Tooltip>
	{/if}

	<!-- Airbrush (The Mist) -->
	{#if studio.isAirbrushActive}
		<Tooltip text="actions:toggle_airbrush">
			<div transition:fade>
				<Badge variant="primary" size="sm">☁️ {__('tools:status.mist')}</Badge>
			</div>
		</Tooltip>
	{/if}

	<!-- Pixel-Perfect -->
	{#if studio.isPixelPerfect}
		<Tooltip text="actions:toggle_pixel_perfect">
			<div transition:fade>
				<Badge variant="accent" size="sm">✨ {__('tools:status.pure')}</Badge>
			</div>
		</Tooltip>
	{/if}

	<!-- Transform -->
	{#if studio.isTransforming}
		<Tooltip text="actions:tool_transform">
			<div transition:fade class="animate-pulse">
				<Badge variant="primary" size="sm">🧺 {__('tools:status.moving')}</Badge>
			</div>
		</Tooltip>
	{/if}

	<!-- Pattern Brush -->
	{#if studio.isPatternBrushActive}
		<Tooltip text="actions:toggle_pattern_brush">
			<div transition:fade>
				<Badge variant="primary" size="sm">🎨 {__('tools:status.stencil')}</Badge>
			</div>
		</Tooltip>
	{/if}

	<!-- Aroma Blend (Dither) -->
	{#if studio.isDitherBlendActive}
		<Tooltip text="actions:toggle_dither_blend">
			<div transition:fade>
				<Badge variant="primary" size="sm"
					>🌿 {__('tools:status.dither')} ({studio.brushHardness}%)</Badge
				>
			</div>
		</Tooltip>
	{/if}

	<!-- Geometric Tools -->
	{#if studio.activeTool === 'RECTANGLE'}
		<Tooltip text="actions:tool_rectangle">
			<div transition:fade>
				<Badge variant="primary" size="sm">📦 {__('tools:status.box')}</Badge>
			</div>
		</Tooltip>
	{/if}

	{#if studio.activeTool === 'ELLIPSE'}
		<Tooltip text="actions:tool_ellipse">
			<div transition:fade>
				<Badge variant="primary" size="sm">⭕ {__('tools:status.round')}</Badge>
			</div>
		</Tooltip>
	{/if}

	{#if studio.activeTool === 'POLYGON'}
		<Tooltip text="actions:tool_polygon">
			<div transition:fade>
				<Badge variant="primary" size="sm"
					>⭐ {__('tools:status.poly')} ({studio.polygonSides})</Badge
				>
			</div>
		</Tooltip>
	{/if}

	<!-- Shading Status -->
	{#if studio.isShadingLighten}
		<Tooltip text="actions:toggle_shade_lighten">
			<div transition:fade>
				<Badge variant="primary" size="sm">☀️ {__('tools:status.light')}</Badge>
			</div>
		</Tooltip>
	{/if}
	{#if studio.isShadingDarken}
		<Tooltip text="actions:toggle_shade_darken">
			<div transition:fade>
				<Badge variant="primary" size="sm">🌙 {__('tools:status.dark')}</Badge>
			</div>
		</Tooltip>
	{/if}
	{#if studio.isShadingDither}
		<Tooltip text="actions:toggle_shade_dither">
			<div transition:fade>
				<Badge variant="primary" size="sm">🏁 {__('tools:status.dither')}</Badge>
			</div>
		</Tooltip>
	{/if}
</div>
