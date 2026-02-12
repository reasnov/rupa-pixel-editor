<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
</script>

<div class="artisan-panel stats-panel px-4 py-3 shadow-sm border-r-2 border-white rounded-2xl">
	<div class="flex flex-col gap-2">
		<div class="flex flex-col">
			<span class="font-serif text-[7px] font-bold uppercase opacity-30">Needle Focus</span>
			<span class="font-mono text-[10px] font-bold tabular-nums">
				{atelier.displayCoords.x}, {atelier.displayCoords.y}
			</span>
		</div>
		
		<div class="h-px w-full bg-studio-text/10"></div>

		<div class="flex flex-col">
			<span class="font-serif text-[7px] font-bold uppercase opacity-30">Linen Size</span>
			<span class="font-mono text-[10px] font-bold tabular-nums">
				{atelier.linen.width}×{atelier.linen.height}
			</span>
		</div>
	</div>
</div>
