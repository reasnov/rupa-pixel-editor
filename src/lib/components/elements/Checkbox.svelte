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
    group flex cursor-pointer items-center gap-3 select-none
    disabled:cursor-not-allowed disabled:opacity-50
    {className}
"
>
	<div class="relative h-5 w-5">
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
            h-5 w-5 rounded-sm border-2 border-ui-structural bg-canvas-bg
            shadow-[2px_2px_0px_var(--color-ui-structural)]
            transition-all group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-none
            {checked ? 'bg-ui-accent' : ''}
        "
		></div>
		{#if checked}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="4"
					stroke-linecap="square"
					stroke-linejoin="miter"
					class="h-3 w-3"
				>
					<path d="M20 6L9 17L4 12" />
				</svg>
			</div>
		{/if}
	</div>
	{#if label}
		<span class="text-xs font-bold tracking-widest text-text-main/90 uppercase">
			{__(label)}
		</span>
	{/if}
</label>
