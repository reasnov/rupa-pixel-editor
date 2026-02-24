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
		ariaLabel: string;
		disabled?: boolean;
		onchange?: (value: string | number) => void;
		class?: string;
	}

	let {
		options = [],
		value = $bindable(),
		label,
		ariaLabel,
		disabled = false,
		onchange,
		class: className = ''
	}: Props = $props();

	let isOpen = $state(false);

	const selectedLabel = $derived.by(() => {
		const opt = options.find((o) => o.value === value);
		if (!opt) return __('ui:labels.SELECT_OPTION');
		return __(opt.label);
	});

	function toggle() {
		if (disabled) return;
		isOpen = !isOpen;
	}

	function select(option: Option) {
		value = option.value;
		isOpen = false;
		if (onchange) onchange(value);
	}

	function handleBlur() {
		setTimeout(() => {
			isOpen = false;
		}, 200);
	}
</script>

<div class="flex flex-col gap-1.5 w-full {className}">
	{#if label}
		<label class="text-[10px] font-bold uppercase tracking-widest text-evergreen/70 px-1">
			{__(label)}
		</label>
	{/if}

	<div class="relative w-full" onblur={handleBlur} tabindex="-1">
		<button
			type="button"
			role="combobox"
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			aria-label={__(ariaLabel)}
			{disabled}
			onclick={toggle}
			class="
                w-full flex items-center justify-between gap-3 px-3 py-2
                bg-washi-white border-2 border-dark-walnut rounded-sm
                shadow-[2px_2px_0px_var(--color-dark-walnut)]
                transition-all focus:outline-none focus:ring-2 focus:ring-lantern-gold
                disabled:opacity-50 disabled:cursor-not-allowed
                {isOpen ? 'ring-2 ring-lantern-gold' : ''}
            "
		>
			<span class="text-xs text-evergreen font-bold uppercase tracking-wider truncate">
				{selectedLabel}
			</span>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="square"
				class="w-3 h-3 text-evergreen/40 transition-transform {isOpen ? 'rotate-180' : ''}"
			>
				<path d="M6 9l6 6 6-6" />
			</svg>
		</button>

		{#if isOpen}
			<div
				class="
                    absolute z-[5000] top-full left-0 w-full mt-1 py-1
                    bg-washi-white border-2 border-dark-walnut rounded-sm
                    shadow-[4px_4px_0px_var(--color-dark-walnut)]
                    max-h-60 overflow-y-auto custom-scrollbar
                "
				role="listbox"
			>
				{#each options as option}
					<button
						type="button"
						role="option"
						aria-selected={value === option.value}
						onclick={() => select(option)}
						class="
                            w-full text-left px-3 py-2 text-[10px] font-bold uppercase
                            tracking-wider hover:bg-lantern-gold hover:text-white
                            {value === option.value ? 'bg-bamboo-shoot text-evergreen' : 'text-evergreen/70'}
                        "
					>
						{__(option.label)}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(52, 78, 65, 0.2);
		border-radius: 0px;
	}
</style>
