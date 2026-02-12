<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
</script>

<div class="fixed top-1/2 left-0 z-50 -translate-y-1/2 p-2">
	<div class="artisan-panel side-panel-left flex flex-col gap-2 p-2">
		<span class="mb-1 text-center font-serif text-[7px] font-bold uppercase opacity-30">Dyes</span>
		{#each atelier.palette as color, i}
			<button
				class="h-7 w-7 rounded-full border-2 transition-all {atelier.activeDye === color
					? 'scale-110 border-brand shadow-md ring-2 ring-white'
					: 'border-white opacity-70 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => atelier.selectPalette(i)}
				aria-label="Select dye {i + 1}"
			></button>
		{/each}

		<div class="mx-auto my-1 h-px w-4 bg-studio-text/10"></div>

		<button
			class="via-sage-300 via-sage-300 h-7 w-7 rounded-full border-2 border-dashed border-brand/40 bg-gradient-to-tr from-rose-300 to-sky-300 shadow-sm transition-all hover:scale-110 hover:border-brand"
			onclick={() => (atelier.showDyeBasin = true)}
			title="Natural Dye Basin"
		></button>
	</div>
</div>