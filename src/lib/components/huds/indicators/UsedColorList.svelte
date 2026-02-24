<script lang="ts">
	import { slide } from 'svelte/transition';
	import { services } from '../../../engine/services.js';

	interface Props {
		colors: string[];
	}

	let { colors }: Props = $props();
</script>

<div class="custom-scrollbar flex max-h-[120px] flex-row flex-wrap gap-1.5 overflow-y-auto px-1">
	{#each colors as color (color)}
		<button
			transition:slide={{ duration: 200 }}
			class="group editor-checker-small relative h-5 w-5 shrink-0 rounded border border-text-main/10 shadow-sm transition-all hover:scale-110 active:scale-95"
			style="background-color: {color};"
			onclick={() => services.color.setColor(color)}
			title={color}
		>
			<div
				class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span class="text-[8px]">📍</span>
			</div>
		</button>
	{:else}
		<div
			class="flex h-5 w-5 items-center justify-center rounded border border-dashed border-text-main/10"
		>
			<span class="text-[8px] opacity-20">🎨</span>
		</div>
	{/each}
</div>
