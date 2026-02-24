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

<div class="flex flex-col gap-2 {className}" role="radiogroup" aria-label={label ? __(label) : undefined}>
	{#if label}
		<span class="text-[10px] font-bold uppercase tracking-widest text-evergreen/70 px-1">
			{__(label)}
		</span>
	{/if}

	<div class="flex flex-col gap-2">
		{#each options as option}
			<label
				class="
                    flex items-center gap-3 cursor-pointer group
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
			>
				<div class="relative w-5 h-5 flex items-center justify-center">
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
                            w-5 h-5 bg-washi-white border-2 border-dark-walnut rounded-full
                            shadow-[2px_2px_0px_var(--color-dark-walnut)]
                            transition-all group-active:shadow-none group-active:translate-x-0.5 group-active:translate-y-0.5
                            {value === option.value ? 'bg-lantern-gold' : ''}
                        "
					></div>
					{#if value === option.value}
						<div
							class="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
						></div>
					{/if}
				</div>
				<span class="text-xs font-bold uppercase tracking-widest text-evergreen/90">
					{__(option.label)}
				</span>
			</label>
		{/each}
	</div>
</div>
