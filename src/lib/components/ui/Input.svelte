<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';

	interface Props {
		value: string | number;
		label?: string;
		placeholder?: string;
		type?: 'text' | 'number' | 'password' | 'email' | 'url';
		ariaLabel: string;
		disabled?: boolean;
		readonly?: boolean;
		onchange?: (event: Event) => void;
		oninput?: (event: Event) => void;
		onblur?: (event: FocusEvent) => void;
		class?: string;
	}

	let {
		value = $bindable(),
		label,
		placeholder = '',
		type = 'text',
		ariaLabel,
		disabled = false,
		readonly = false,
		onchange,
		oninput,
		onblur,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
	{#if label}
		<label class="text-[10px] font-bold uppercase tracking-widest text-evergreen/70 px-1" for={label}>
			{__(label)}
		</label>
	{/if}
	<input
		id={label}
		{type}
		{disabled}
		{readonly}
		placeholder={__(placeholder)}
		aria-label={__(ariaLabel)}
		bind:value
		class="
            bg-washi-white border-2 border-dark-walnut px-3 py-2 text-xs
            text-evergreen placeholder-evergreen/30 rounded-sm
            shadow-[2px_2px_0px_var(--color-dark-walnut)]
            focus:outline-none focus:ring-2 focus:ring-lantern-gold focus:ring-offset-1
            transition-all disabled:opacity-50 disabled:cursor-not-allowed
        "
		{onchange}
		{oninput}
		{onblur}
	/>
</div>
