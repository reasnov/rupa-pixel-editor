<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
</script>

<div class="fixed top-1/2 right-0 z-50 -translate-y-1/2 p-2">
	<div class="artisan-panel side-panel-right flex w-32 flex-col items-end gap-5 p-4">
		<!-- Needle Tracking -->
		<div class="flex w-full flex-col items-end">
			<span class="mb-1 font-serif text-[8px] font-bold uppercase opacity-40">Needle</span>
			<div class="flex w-full flex-col items-end rounded-lg border border-white/50 bg-black/5 p-1.5">
				<span class="font-mono text-[10px] text-studio-text">X:{atelier.displayCoords.x} Y:{atelier.displayCoords.y}</span>
				<span class="mt-0.5 font-mono text-[9px] opacity-40">Z: {Math.round(atelier.zoomLevel * 100)}%</span>
			</div>
		</div>

		<!-- Used Dyes History -->
		{#if atelier.usedColors.length > 0}
			<div class="flex w-full flex-col items-end">
				<span class="mb-1.5 font-serif text-[8px] font-bold uppercase opacity-40">Canvas Dyes</span>
				<div class="grid grid-cols-3 gap-1.5 rounded-lg border border-white bg-white/30 p-1.5">
					{#each atelier.usedColors as color}
						<button
							class="h-4 w-4 rounded border transition-all hover:scale-110 {atelier.activeDye === color
								? 'border-brand ring-1 ring-brand/30'
								: 'border-black/5 opacity-60'}"
							style="background-color: {color};"
							onclick={() => (atelier.activeDye = color)}
							aria-label="Select used dye"
						></button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Active Dye Preview -->
		<div class="flex w-full flex-col items-end">
			<span class="mb-1 font-serif text-[8px] font-bold uppercase opacity-40">Dye</span>
			<div class="h-10 w-10 overflow-hidden rounded-xl border-4 border-white bg-white p-0.5 shadow-lg ring-1 ring-brand/10">
				<div class="h-full w-full rounded-lg" style="background-color: {atelier.activeDye};"></div>
			</div>
		</div>
	</div>
</div>