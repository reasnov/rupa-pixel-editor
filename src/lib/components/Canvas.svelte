<script lang="ts">
	import { editor } from '../state/editor.svelte';
</script>

<!-- The Canvas (The Linen) -->
<div
	class="relative stitch-grid-pattern transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center shrink-0"
	style="
		display: grid;
		grid-template-columns: repeat({editor.gridWidth}, 1fr); 
		grid-template-rows: repeat({editor.gridHeight}, 1fr);
		width: min(65vh, 65vw); 
		height: min(65vh, 65vw);
		--grid-cols: {editor.gridWidth}; 
		--grid-rows: {editor.gridHeight}; 
		transform: {editor.cameraTransform};
	"
>
	{#each editor.pixelData as color, i (i)}
		{@const x = i % editor.gridWidth}
		{@const y = Math.floor(i / editor.gridWidth)}
		{@const isActive = editor.cursorPos.x === x && editor.cursorPos.y === y}
		{@const isEmpty = color === '#eee8d5'}
		<div
			class="relative h-full w-full cell-stitch {isActive ? 'z-30' : 'z-10'}"
			style="background-color: {isEmpty ? 'transparent' : color};"
		>
															{#if isActive}
																<div class="absolute inset-0 cursor-spirit animate-needle">
																	<div class="cursor-invert"></div>
																	<div class="cursor-border"></div>
																</div>
															{/if}		</div>
	{/each}
</div>
