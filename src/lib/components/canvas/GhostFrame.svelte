<script lang="ts">
	import { type ColorHex } from '../../types/index.js';

	let {
		stitches,
		width,
		height,
		opacity = 0.2
	} = $props<{
		stitches: (ColorHex | null)[];
		width: number;
		height: number;
		opacity?: number;
	}>();
</script>

<div
	class="ghost-frame pointer-events-none absolute inset-0 z-0"
	style="
        display: grid;
        grid-template-columns: repeat({width}, 1fr); 
        grid-template-rows: repeat({height}, 1fr);
        opacity: {opacity};
    "
>
	{#each stitches as color, i (i)}
		{#if color}
			<div
				style="grid-column: {(i % width) + 1}; grid-row: {Math.floor(i / width) +
					1}; background-color: {color};"
			></div>
		{/if}
	{/each}
</div>

<style>
	.ghost-frame {
		/* Optimized rendering for pixel art ghosts */
		image-rendering: pixelated;
	}
</style>
