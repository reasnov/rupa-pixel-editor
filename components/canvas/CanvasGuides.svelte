<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { Geometry } from '../../logic/geometry.js';
	import { fade } from 'svelte/transition';

	const studio = editor.studio;
</script>

<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
	<!-- Vertical Center (Modern Neutral) -->
	<div class="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-charcoal/40"></div>
	<!-- Horizontal Center (Modern Neutral) -->
	<div class="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-charcoal/40"></div>

	<!-- Symmetry Guides (Barista Magenta) -->
	{#if studio.symmetryMode === 'HORIZONTAL' || studio.symmetryMode === 'QUADRANT'}
		<div
			transition:fade
			class="absolute top-0 bottom-0 left-1/2 z-30 w-px -translate-x-1/2 border-l border-dashed border-brand shadow-sm"
		></div>
	{/if}
	{#if studio.symmetryMode === 'VERTICAL' || studio.symmetryMode === 'QUADRANT'}
		<div
			transition:fade
			class="absolute top-1/2 right-0 left-0 z-30 h-px -translate-y-1/2 border-t border-dashed border-brand shadow-sm"
		></div>
	{/if}

	<!-- 8-Bit Rhythmic Guides (Subtle Stone) -->
	{#each [-24, -16, -8, 8, 16, 24] as offset}
		{@const pos = Geometry.getGuidePosition(offset, editor.canvas.width)}
		{#if pos > 0 && pos < 100}
			<div
				class="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-charcoal/20"
				style="left: {pos}%"
			></div>
		{/if}
	{/each}
	{#each [-24, -16, -8, 8, 16, 24] as offset}
		{@const pos = Geometry.getGuidePosition(offset, editor.canvas.height)}
		{#if pos > 0 && pos < 100}
			<div
				class="absolute right-0 left-0 h-px -translate-y-1/2 bg-charcoal/20"
				style="top: {pos}%"
			></div>
		{/if}
	{/each}
</div>
