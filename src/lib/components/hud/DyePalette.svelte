<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
</script>

<div
	class="artisan-panel flex w-full flex-col gap-3 rounded-xl p-3 shadow-sm"
	role="region"
	aria-label={__({ key: 'shortcuts.groups.the_hand' })}
>
	<span class="text-center font-serif text-[7px] font-bold text-studio-text/30 uppercase"
		>{__({ key: 'shortcuts.groups.swatches' })}</span
	>

	<div class="grid grid-cols-4 gap-2" role="radiogroup">
		{#each atelier.palette as color, i}
			<button
				class="artisan-checker-small h-8 w-8 rounded-lg border-2 transition-all {atelier.activeDye ===
				color
					? 'scale-110 border-brand shadow-md ring-2 ring-white'
					: 'border-white opacity-70 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => shuttle.dye.select(i)}
				aria-label={__({ key: 'shortcuts.labels.SELECT_DYE', replace: { index: i + 1 } })}
				title={__({ key: 'shortcuts.labels.SELECT_DYE', replace: { index: i + 1 } }) +
					` (${(i + 1) % 10})`}
				role="radio"
				aria-checked={atelier.activeDye === color}
			></button>
		{/each}

		<button
			class="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-brand/40 bg-gradient-to-tr from-rose-200 to-sky-200 shadow-sm transition-all hover:scale-110 hover:border-brand"
			onclick={() => (atelier.studio.showDyeBasin = true)}
			title={__({ key: 'dye_basin.title' }) + ' (B)'}
			aria-label={__({ key: 'dye_basin.title' })}
		>
			<span class="text-xs" aria-hidden="true">＋</span>
		</button>
	</div>
</div>
