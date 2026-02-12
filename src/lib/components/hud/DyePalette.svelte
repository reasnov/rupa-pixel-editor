<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
</script>

<div class="artisan-panel flex flex-col gap-2 rounded-xl border-l-2 border-white p-2 shadow-sm">
	<span class="mb-1 text-center font-serif text-[7px] font-bold uppercase opacity-30">Dyes</span>
	{#each atelier.palette as color, i}
		<button
			class="h-7 w-7 rounded-xl border-2 transition-all artisan-checker-small {atelier.activeDye === color
				? 'scale-110 border-brand shadow-md ring-2 ring-white'
				: 'border-white opacity-70 hover:scale-105 hover:opacity-100'}"
			style="background-color: {color};"
			onclick={() => shuttle.dye.select(i)}
			aria-label="Select dye {i + 1}"
		></button>
	{/each}

	<div class="mx-auto my-1 h-px w-4 bg-studio-text/10"></div>

	<button
		class="h-7 w-7 rounded-xl border-2 border-dashed border-brand/40 bg-gradient-to-tr from-rose-200 to-sky-200 shadow-sm transition-all hover:scale-110 hover:border-brand"
		onclick={() => (atelier.studio.showDyeBasin = true)}
		title="Natural Dye Basin"
	></button>
</div>
