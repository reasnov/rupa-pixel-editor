<script lang="ts">
	import { editor } from '../state/editor.svelte';
</script>

<!-- The Canvas (The Linen) -->

<div
	class="stitch-grid-pattern relative shrink-0 origin-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	style="

		display: grid;

		grid-template-columns: repeat({editor.gridWidth}, 1fr); 

		grid-template-rows: repeat({editor.gridHeight}, 1fr);

		width: min(75vh, 75vw); 

		height: min(75vh, 75vw);

		--grid-cols: {editor.gridWidth}; 

		--grid-rows: {editor.gridHeight}; 

		transform: {editor.cameraTransform};

	"
>
	<!-- Center Axis Guides -->

	<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
		<!-- Vertical Center -->

		<div class="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-studio-text/30"></div>

		<!-- Horizontal Center -->

		<div class="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-studio-text/30"></div>

		<!-- 8-Tile Intervals (Vertical) -->

		{#each [-24, -16, -8, 8, 16, 24] as offset}
			{@const pos = 50 + (offset / editor.gridWidth) * 100}

			{#if pos > 0 && pos < 100}
				<div
					class="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-studio-text/10"
					style="left: {pos}%"
				></div>
			{/if}
		{/each}

		<!-- 8-Tile Intervals (Horizontal) -->

		{#each [-24, -16, -8, 8, 16, 24] as offset}
			{@const pos = 50 + (offset / editor.gridHeight) * 100}

			{#if pos > 0 && pos < 100}
				<div
					class="absolute right-0 left-0 h-px -translate-y-1/2 bg-studio-text/10"
					style="top: {pos}%"
				></div>
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
				<div class="cursor-spirit animate-needle absolute inset-0">
					<div class="cursor-invert"></div>

					<div class="cursor-border"></div>
				</div>
			{/if}
		</div>
	{/each}
</div>
