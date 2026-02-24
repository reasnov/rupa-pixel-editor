<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';

	interface Option {
		label: string;
		value: string | number;
	}

	interface Props {
		options: Option[];
		value: string | number;
		label?: string;
		disabled?: boolean;
		onchange?: (value: string | number) => void;
		class?: string;
	}

	let {
		options = [],
		value = $bindable(),
		label,
		disabled = false,
		onchange,
		class: className = ''
	}: Props = $props();

	function select(option: Option) {
		if (disabled) return;
		value = option.value;
		if (onchange) onchange(value);
	}
</script>

<div
	class="flex flex-col gap-2 {className}"
	role="radiogroup"
	aria-label={label ? __(label) : undefined}
>
	{#if label}
		<span class="px-1 text-[10px] font-bold tracking-widest text-text-main/70 uppercase">
			{__(label)}
		</span>
	{/if}

	<div class="flex flex-col gap-2">
		{#each options as option}
			<label
				class="
                    group flex cursor-pointer items-center gap-3
                    disabled:cursor-not-allowed disabled:opacity-50
                "
			>
				<div class="relative flex h-5 w-5 items-center justify-center">
					<input
						type="radio"
						class="sr-only"
						name={label}
						{disabled}
						checked={value === option.value}
						onchange={() => select(option)}
					/>
					<div
						class="
                            h-5 w-5 rounded-full border-2 border-ui-structural bg-canvas-bg
                            shadow-[2px_2px_0px_var(--color-ui-structural)]
                            transition-all group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-none
                            {value === option.value ? 'bg-ui-accent' : ''}
                        "
					></div>
					{#if value === option.value}
						<div class="pointer-events-none absolute h-2 w-2 rounded-full bg-white"></div>
					{/if}
				</div>
				<span class="text-xs font-bold tracking-widest text-text-main/90 uppercase">
					{__(option.label)}
				</span>
			</label>
		{/each}
	</div>
</div>
