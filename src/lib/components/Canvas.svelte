<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import Cursor from './Cursor.svelte';
</script>

<!-- The Canvas (The Linen) -->
<div
	class="stitch-grid-pattern artisan-checker-small relative shrink-0 origin-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	style="
		display: grid;
		grid-template-columns: repeat({editor.gridWidth}, 1fr); 
		grid-template-rows: repeat({editor.gridHeight}, 1fr);
		width: min(75vh, 75vw); 
		height: min(75vh, 75vw);
		--grid-cols: {editor.gridWidth}; 
		--grid-rows: {editor.gridHeight}; 
		transform: {editor.cameraTransform};
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
			{@const pos = 50 + (offset / editor.gridWidth) * 100}
			{#if pos > 0 && pos < 100}
				<div class="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-studio-text/10" style="left: {pos}%"></div>
			{/if}
		{/each}
		{#each [-24, -16, -8, 8, 16, 24] as offset}
			{@const pos = 50 + (offset / editor.gridHeight) * 100}
			{#if pos > 0 && pos < 100}
				<div class="absolute right-0 left-0 h-px -translate-y-1/2 bg-studio-text/10" style="top: {pos}%"></div>
			{/if}
		{/each}
	</div>

	{#each editor.pixelData as color, i (i)}
		{@const x = i % editor.gridWidth}
		{@const y = Math.floor(i / editor.gridWidth)}
		{@const isActive = editor.cursorPos.x === x && editor.cursorPos.y === y}
		{@const isEmpty = color === '#eee8d5'}
		<div
			class="cell-stitch relative h-full w-full {isActive ? 'z-30' : 'z-10'}"
			style="background-color: {isEmpty ? 'transparent' : color};"
		>
			{#if isActive}
				<Cursor />
			{/if}
		</div>
	{/each}

	<!-- Block Selection Overlay -->
	{#if editor.isBlockMode && editor.selectionStart && editor.selectionEnd}
		{@const x1 = Math.min(editor.selectionStart.x, editor.selectionEnd.x)}
		{@const x2 = Math.max(editor.selectionStart.x, editor.selectionEnd.x)}
		{@const y1 = Math.min(editor.selectionStart.y, editor.selectionEnd.y)}
		{@const y2 = Math.max(editor.selectionStart.y, editor.selectionEnd.y)}
		{@const width = x2 - x1 + 1}
		{@const height = y2 - y1 + 1}
		<div
			class="absolute z-40 border-2 border-dashed border-studio-warm bg-studio-warm/10 pointer-events-none"
			style="
				left: {(x1 / editor.gridWidth) * 100}%; 
				top: {(y1 / editor.gridHeight) * 100}%; 
				width: {(width / editor.gridWidth) * 100}%; 
				height: {(height / editor.gridHeight) * 100}%;
			"
		>
			<div 
				class="absolute h-2 w-2 bg-studio-warm border border-white shadow-sm -translate-x-1/2 -translate-y-1/2"
				style="
					left: {((editor.selectionStart.x - x1 + 0.5) / width) * 100}%;
					top: {((editor.selectionStart.y - y1 + 0.5) / height) * 100}%;
				"
			></div>
		</div>
	{/if}
</div>
