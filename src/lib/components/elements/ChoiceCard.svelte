<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		label: string;
		icon?: string | Snippet;
		isSelected: boolean;
		disabled?: boolean;
		onclick: (id: string) => void;
		class?: string;
	}

	let {
		id,
		label,
		icon,
		isSelected,
		disabled = false,
		onclick,
		class: className = ''
	}: Props = $props();
</script>

<button
	type="button"
	role="radio"
	aria-checked={isSelected}
	{disabled}
	class="
        flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all
        disabled:cursor-not-allowed disabled:opacity-20
        		{isSelected
		? 'border-ui-accent bg-ui-accent/5 text-ui-accent'
		: 'border-text-main/5 bg-text-main/[0.05] text-text-main/40 hover:bg-text-main/10 hover:text-text-main/70 hover:opacity-100'}        {className}
    "
	onclick={() => onclick(id)}
>
	{#if icon}
		<div class="text-2xl">
			{#if typeof icon === 'string'}
				{icon}
			{:else}
				{@render icon()}
			{/if}
		</div>
	{/if}
	<div class="text-center">
		<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
			{__(label)}
		</h3>
	</div>
</button>
