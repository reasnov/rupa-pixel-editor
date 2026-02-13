<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import { slide } from 'svelte/transition';
</script>

<div class="artisan-panel flex w-full flex-col gap-4 px-3 py-4 shadow-sm">
	<!-- Section 1: Active Dye -->
	<div class="flex flex-col items-center gap-2">
		<span class="font-serif text-[7px] font-bold uppercase opacity-30">Active Dye</span>
		<div
			class="artisan-checker-small h-8 w-8 rounded-lg border-2 border-white shadow-md transition-colors"
			style="background-color: {atelier.paletteState.activeDye};"
		></div>
		<span class="font-mono text-[8px] font-bold tracking-tighter uppercase opacity-40">
			{atelier.paletteState.activeDye}
		</span>
	</div>

	<div class="h-px w-full bg-studio-text/10"></div>

	<!-- Section 2: Used Dyes -->
	<div class="flex flex-col gap-3">
		<span class="text-center font-serif text-[7px] font-bold uppercase opacity-30">Used Dyes</span>

		<div class="no-scrollbar flex max-h-[150px] flex-row flex-wrap gap-1.5 overflow-y-auto">
			{#each atelier.usedColors as color (color)}
				<button
					transition:slide={{ duration: 200 }}
					class="group artisan-checker-small relative h-5 w-5 shrink-0 rounded-md border-2 border-white shadow-sm transition-all hover:scale-110 active:scale-95"
					style="background-color: {color};"
					onclick={() => shuttle.dye.setDye(color)}
					title={color}
				>
					<div
						class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
					>
						<span class="text-[6px] drop-shadow-sm">📍</span>
					</div>
				</button>
			{:else}
				<div
					class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-dashed border-studio-text/10"
				>
					<span class="text-[6px] opacity-20">🧵</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
