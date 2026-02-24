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
		min?: number | string;
		max?: number | string;
		step?: number | string;
		id?: string;
		onchange?: (event: Event) => void;
		oninput?: (event: Event) => void;
		onblur?: (event: FocusEvent) => void;
		onkeydown?: (event: KeyboardEvent) => void;
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
		min,
		max,
		step,
		id,
		onchange,
		oninput,
		onblur,
		onkeydown,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
	{#if label}
		<label
			class="px-1 text-[10px] font-bold tracking-widest text-text-main/70 uppercase"
			for={id || label}
		>
			{__(label)}
		</label>
	{/if}
	<input
		{id}
		{type}
		{disabled}
		{readonly}
		{min}
		{max}
		{step}
		placeholder={__(placeholder)}
		aria-label={__(ariaLabel)}
		bind:value
		class="
            rounded-sm border-2 border-ui-structural bg-canvas-bg px-2 py-1
            text-[10px] text-text-main placeholder-text-main/30
            shadow-[2px_2px_0px_var(--color-ui-structural)]
            transition-all focus:ring-2 focus:ring-ui-accent focus:ring-offset-1
            focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
        "
		{onchange}
		{oninput}
		{onblur}
		{onkeydown}
	/>
</div>
