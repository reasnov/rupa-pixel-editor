<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';

	interface Props {
		activeLayerIndex: number;
		onSelect: (index: number) => void;
	}

	let { activeLayerIndex, onSelect }: Props = $props();
</script>

<div
	class="sticky left-0 z-30 flex w-32 shrink-0 flex-col border-r border-text-main/10 bg-canvas-bg/95 shadow-sm"
>
	{#each editor.project.activeFrame.layers as layer, i}
		<button
			onclick={() => onSelect(i)}
			class="flex h-6 w-full items-center px-2 text-left transition-colors {i === activeLayerIndex
				? 'bg-ui-accent/5 text-ui-accent'
				: 'text-text-main/60 hover:bg-text-main/5'}"
		>
			<span class="truncate font-serif text-[9px] font-bold uppercase">{layer.name}</span>
		</button>
	{/each}
</div>
