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

<label
	class="
    flex items-center gap-3 cursor-pointer select-none group
    disabled:opacity-50 disabled:cursor-not-allowed
    {className}
"
>
	<div class="relative w-5 h-5">
		<input
			type="checkbox"
			class="sr-only"
			{checked}
			{disabled}
			aria-label={__(ariaLabel)}
			aria-checked={checked}
			onchange={toggle}
		/>
		<div
			class="
            w-5 h-5 bg-washi-white border-2 border-dark-walnut rounded-sm
            shadow-[2px_2px_0px_var(--color-dark-walnut)]
            transition-all group-active:shadow-none group-active:translate-x-0.5 group-active:translate-y-0.5
            {checked ? 'bg-lantern-gold' : ''}
        "
		></div>
		{#if checked}
			<div
				class="absolute inset-0 flex items-center justify-center pointer-events-none"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="4"
					stroke-linecap="square"
					stroke-linejoin="miter"
					class="w-3 h-3"
				>
					<path d="M20 6L9 17L4 12" />
				</svg>
			</div>
		{/if}
	</div>
	{#if label}
		<span class="text-xs font-bold uppercase tracking-widest text-evergreen/90">
			{__(label)}
		</span>
	{/if}
</label>
