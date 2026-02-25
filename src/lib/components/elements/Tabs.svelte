<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import type { Snippet } from 'svelte';

	interface Tab {
		id: string;
		label: string;
		icon?: Snippet;
		disabled?: boolean;
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

	function select(tab: Tab) {
		if (tab.disabled) return;
		activeTab = tab.id;
		if (onchange) onchange(tab.id);
	}
</script>

<div
	role="tablist"
	aria-label={__(ariaLabel)}
	class="
    flex {variant === 'horizontal' ? 'flex-row border-b-2' : 'flex-col border-r-2'}
    w-full border-ui-structural bg-sidebar-bg/10 {className}
"
>
	{#each tabs as tab}
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === tab.id}
			aria-disabled={tab.disabled}
			disabled={tab.disabled}
			onclick={() => select(tab)}
			class="
                relative flex flex-1 items-center justify-center gap-3 px-6 py-3
                text-[10px] font-bold tracking-widest uppercase transition-all
                				{activeTab === tab.id
				? 'border-ui-structural bg-canvas-bg text-text-main'
				: tab.disabled
					? 'text-text-main/20'
					: 'text-text-main/40 hover:bg-text-main/5 hover:text-text-main/70'}                {variant ===
			'horizontal'
				? '-mb-0.5 border-x-2 border-t-2 first:border-l-0 last:border-r-0'
				: '-mr-0.5 border-y-2 border-l-2 first:border-t-0 last:border-b-0'}
				{tab.disabled ? 'cursor-not-allowed opacity-30 grayscale' : ''}
            "
		>
			{#if tab.icon}
				{@render tab.icon()}
			{/if}
			{__(tab.label)}

			{#if activeTab === tab.id}
				<div
					class="
                        absolute bg-ui-accent
                        {variant === 'horizontal'
						? 'bottom-0 left-0 h-1 w-full'
						: 'top-0 right-0 h-full w-1'}
                    "
				></div>
			{/if}
		</button>
	{/each}
</div>
