<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
</script>

<div class="artisan-panel flex w-full flex-col gap-3 rounded-xl p-3 shadow-sm">
	<span class="text-center font-serif text-[7px] font-bold uppercase opacity-30">Dye Palette</span>

	<div class="grid grid-cols-4 gap-2">
		{#each atelier.palette as color, i}
			<button
				class="artisan-checker-small h-8 w-8 rounded-lg border-2 transition-all {atelier.activeDye ===
				color
					? 'scale-110 border-brand shadow-md ring-2 ring-white'
					: 'border-white opacity-70 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => shuttle.dye.select(i)}
				aria-label="Select dye {i + 1}"
			></button>
		{/each}

		<button
			class="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-brand/40 bg-gradient-to-tr from-rose-200 to-sky-200 shadow-sm transition-all hover:scale-110 hover:border-brand"
			onclick={() => (atelier.studio.showDyeBasin = true)}
			title="Natural Dye Basin"
		>
			<span class="text-xs">＋</span>
		</button>
	</div>
</div>
