<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import Needle from './Needle.svelte';
</script>

<!-- The Linen (The Canvas) -->
<div
	class="stitch-grid-pattern artisan-checker-small relative shrink-0 origin-center shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	style="
		display: grid;
		grid-template-columns: repeat({atelier.linenWidth}, 1fr); 
		grid-template-rows: repeat({atelier.linenHeight}, 1fr);
		width: min(75vh, 75vw); 
		height: min(75vh, 75vw);
		--grid-cols: {atelier.linenWidth}; 
		--grid-rows: {atelier.linenHeight}; 
		transform: {atelier.cameraTransform};
		background-color: #eee8d5;
	"
>
	<!-- Center Axis Guides -->
	<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
		<!-- Vertical Center -->
		<div class="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-studio-text/30"></div>
		<!-- Horizontal Center -->
		<div class="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-studio-text/30"></div>

		<!-- 8-Bit Rhythmic Guides -->
		{#each [-24, -16, -8, 8, 16, 24] as offset}
			{@const pos = 50 + (offset / atelier.linenWidth) * 100}
			{#if pos > 0 && pos < 100}
				<div
					class="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-studio-text/10"
					style="left: {pos}%"
				></div>
			{/if}
		{/each}
		{#each [-24, -16, -8, 8, 16, 24] as offset}
			{@const pos = 50 + (offset / atelier.linenHeight) * 100}
			{#if pos > 0 && pos < 100}
				<div
					class="absolute right-0 left-0 h-px -translate-y-1/2 bg-studio-text/10"
					style="top: {pos}%"
				></div>
			{/if}
		{/each}
	</div>

	{#each atelier.stitches as color, i (i)}
		{@const x = i % atelier.linenWidth}
		{@const y = Math.floor(i / atelier.linenWidth)}
		{@const isActive = atelier.needlePos.x === x && atelier.needlePos.y === y}
		{@const isEmpty = color === '#eee8d5'}

		<div
			class="cell-stitch relative h-full w-full {isActive ? 'z-30' : 'z-10'}"
			style="background-color: {isEmpty ? 'rgba(238, 232, 213, 0.01)' : color};"
		>
			{#if isActive}
				<Needle />
			{/if}
		</div>
	{/each}

	<!-- Block Selection Overlay -->
	{#if atelier.isSelecting && atelier.selectionStart && atelier.needlePos}
		{@const x1 = Math.min(atelier.selectionStart.x, atelier.needlePos.x)}
		{@const x2 = Math.max(atelier.selectionStart.x, atelier.needlePos.x)}
		{@const y1 = Math.min(atelier.selectionStart.y, atelier.needlePos.y)}
		{@const y2 = Math.max(atelier.selectionStart.y, atelier.needlePos.y)}
		{@const width = x2 - x1 + 1}
		{@const height = y2 - y1 + 1}
		<div
			class="pointer-events-none absolute z-40 border-2 border-dashed border-brand bg-brand/10"
			style="
				left: {(x1 / atelier.linenWidth) * 100}%; 
				top: {(y1 / atelier.linenHeight) * 100}%; 
				width: {(width / atelier.linenWidth) * 100}%; 
				height: {(height / atelier.linenHeight) * 100}%;
			"
		>
			<div
				class="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-white bg-brand shadow-sm"
				style="
					left: {((atelier.selectionStart.x - x1 + 0.5) / width) * 100}%;
					top: {((atelier.selectionStart.y - y1 + 0.5) / height) * 100}%;
				"
			></div>
		</div>
	{/if}
</div>
