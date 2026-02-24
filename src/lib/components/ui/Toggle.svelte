<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';

	interface Props {
		checked: boolean;
		label?: string;
		disabled?: boolean;
		ariaLabel: string;
		onchange?: (checked: boolean) => void;
		class?: string;
	}

	let {
		checked = $bindable(),
		label,
		disabled = false,
		ariaLabel,
		onchange,
		class: className = ''
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		if (onchange) onchange(checked);
	}
</script>

<div class="flex items-center gap-3 {className}">
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={__(ariaLabel)}
		title={__(ariaLabel)}
		{disabled}
		onclick={toggle}
		class="
            relative w-10 h-6 flex items-center bg-stone-path border-2 border-dark-walnut
            rounded-full transition-all cursor-pointer select-none
            disabled:opacity-50 disabled:cursor-not-allowed
            {checked ? 'bg-lantern-gold' : ''}
        "
	>
		<div
			class="
                absolute left-1 w-4 h-4 bg-washi-white border border-dark-walnut
                rounded-full transition-transform duration-100 ease-in-out
                shadow-[1px_1px_0px_var(--color-dark-walnut)]
                {checked ? 'translate-x-4 bg-white' : ''}
            "
		></div>
	</button>
	{#if label}
		<span class="text-xs font-bold uppercase tracking-widest text-evergreen/90">
			{__(label)}
		</span>
	{/if}
</div>
