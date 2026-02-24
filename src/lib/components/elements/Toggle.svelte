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
            relative flex h-6 w-10 cursor-pointer items-center rounded-full border-2
            border-ui-structural bg-grid-border transition-all select-none
            disabled:cursor-not-allowed disabled:opacity-50
            {checked ? 'bg-ui-accent' : ''}
        "
	>
		<div
			class="
                absolute left-1 h-4 w-4 rounded-full border border-ui-structural
                bg-canvas-bg shadow-[1px_1px_0px_var(--color-ui-structural)] transition-transform duration-100
                ease-in-out
                {checked ? 'translate-x-4 bg-white' : ''}
            "
		></div>
	</button>
	{#if label}
		<span class="text-xs font-bold tracking-widest text-text-main/90 uppercase">
			{__(label)}
		</span>
	{/if}
</div>
