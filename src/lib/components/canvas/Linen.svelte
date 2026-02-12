<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import LinenGuides from './LinenGuides.svelte';
	import Stitch from './Stitch.svelte';
	import SelectionLasso from './SelectionLasso.svelte';
</script>

<!-- The Linen (The Canvas) -->
<div
	class="stitch-grid-pattern artisan-checker-small relative shrink-0 origin-center shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	style="
		display: grid;
		grid-template-columns: repeat({atelier.linen.width}, 1fr); 
		grid-template-rows: repeat({atelier.linen.height}, 1fr);
		width: min(75vh, 75vw); 
		height: min(75vh, 75vw);
		--grid-cols: {atelier.linen.width}; 
		--grid-rows: {atelier.linen.height}; 
		transform: {atelier.cameraTransform};
		background-color: #eee8d5;
	"
>
	<LinenGuides />

	{#each atelier.stitches as color, i (i)}
		{@const x = i % atelier.linen.width}
		{@const y = Math.floor(i / atelier.linen.width)}
		
		<Stitch 
			{color} 
			{x} 
			{y} 
			activeX={atelier.needle.pos.x} 
			activeY={atelier.needle.pos.y} 
		/>
	{/each}

	<SelectionLasso />
</div>
