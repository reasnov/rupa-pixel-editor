<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import type { Snippet } from 'svelte';

	interface Tab {
		id: string;
		label: string;
		icon?: Snippet;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		ariaLabel: string;
		onchange?: (id: string) => void;
		class?: string;
		variant?: 'horizontal' | 'vertical';
	}

	let {
		tabs = [],
		activeTab = $bindable(),
		ariaLabel,
		onchange,
		class: className = '',
		variant = 'horizontal'
	}: Props = $props();

	function select(id: string) {
		activeTab = id;
		if (onchange) onchange(id);
	}
</script>

<div
	role="tablist"
	aria-label={__(ariaLabel)}
	class="
    flex {variant === 'horizontal' ? 'flex-row border-b-2' : 'flex-col border-r-2'}
    border-dark-walnut bg-bamboo-shoot/10 w-full {className}
"
>
	{#each tabs as tab}
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === tab.id}
			onclick={() => select(tab.id)}
			class="
                relative flex items-center gap-3 px-6 py-3
                text-[10px] font-bold uppercase tracking-widest transition-all
                {activeTab === tab.id
                    ? 'bg-washi-white text-evergreen border-dark-walnut'
                    : 'text-evergreen/40 hover:bg-black/5 hover:text-evergreen/70'}
                {variant === 'horizontal'
                    ? 'border-x-2 -mb-0.5 border-t-2 first:border-l-0 last:border-r-0'
                    : 'border-y-2 -mr-0.5 border-l-2 first:border-t-0 last:border-b-0'}
            "
		>
			{#if tab.icon}
				{@render tab.icon()}
			{/if}
			{__(tab.label)}

			{#if activeTab === tab.id}
				<div
					class="
                        absolute bg-lantern-gold
                        {variant === 'horizontal' ? 'bottom-0 left-0 w-full h-1' : 'right-0 top-0 h-full w-1'}
                    "
				></div>
			{/if}
		</button>
	{/each}
</div>
