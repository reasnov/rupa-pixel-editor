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
	const listboxId = `listbox-${Math.random().toString(36).slice(2, 9)}`;

	const translatedLabel = $derived(label && label.includes(':') ? __(label) : label);
	const translatedAria = $derived(ariaLabel && ariaLabel.includes(':') ? __(ariaLabel) : ariaLabel);

	const selectedLabel = $derived.by(() => {
		const opt = options.find((o) => o.value === value);
		if (!opt) return __('ui:labels.select_option');
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

<div class="flex w-full flex-col gap-1.5 {className}">
	{#if label}
		<label
			class="px-1 text-[10px] font-bold tracking-widest text-text-main/70 uppercase"
			for={listboxId}
		>
			{__(label)}
		</label>
	{/if}

	<div class="relative w-full" onblur={handleBlur} tabindex="-1">
		<button
			id={listboxId}
			type="button"
			role="combobox"
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			aria-controls="{listboxId}-list"
			aria-label={__(ariaLabel)}
			{disabled}
			onclick={toggle}
			class="
                flex w-full items-center justify-between gap-3 rounded-sm border-2
                border-ui-structural bg-canvas-bg px-3 py-2
                shadow-[2px_2px_0px_var(--color-ui-structural)]
                transition-all focus:ring-2 focus:ring-ui-accent focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
                {isOpen ? 'ring-2 ring-ui-accent' : ''}
            "
		>
			<span class="truncate text-xs font-bold tracking-wider text-text-main uppercase">
				{selectedLabel}
			</span>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="square"
				class="h-3 w-3 text-text-main/40 transition-transform {isOpen ? 'rotate-180' : ''}"
			>
				<path d="M6 9l6 6 6-6" />
			</svg>
		</button>

		{#if isOpen}
			<div
				id="{listboxId}-list"
				class="
                    custom-scrollbar absolute top-full left-0 z-[5000] mt-1 max-h-60
                    w-full overflow-y-auto rounded-sm border-2
                    border-ui-structural
                    bg-canvas-bg py-1 shadow-[4px_4px_0px_var(--color-ui-structural)]
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
                            w-full px-3 py-2 text-left text-[10px] font-bold tracking-wider
                            uppercase hover:bg-ui-accent hover:text-canvas-bg
                            {value === option.value
							? 'bg-sidebar-bg text-text-main'
							: 'text-text-main/70'}
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
