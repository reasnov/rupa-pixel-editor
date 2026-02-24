<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';

	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		ariaLabel: string;
		disabled?: boolean;
		onchange?: (value: number) => void;
		oninput?: (value: number) => void;
		class?: string;
	}

	let {
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		label,
		ariaLabel,
		disabled = false,
		onchange,
		oninput,
		class: className = ''
	}: Props = $props();

	let percentage = $derived(((value - min) / (max - min)) * 100);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = Number(target.value);
		value = newValue;
		if (oninput) oninput(newValue);
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = Number(target.value);
		if (onchange) onchange(newValue);
	}
</script>

<div class="flex flex-col gap-1.5 w-full {className}">
	{#if label}
		<div class="flex justify-between items-center px-1">
			<label class="text-[10px] font-bold uppercase tracking-widest text-evergreen/70">
				{__(label)}
			</label>
			<span class="text-[10px] font-mono text-evergreen/90">{value}</span>
		</div>
	{/if}

	<div class="relative w-full h-8 flex items-center">
		<div
			class="absolute w-full h-1.5 bg-stone-path border border-dark-walnut rounded-full overflow-hidden"
		>
			<div
				class="h-full bg-lantern-gold border-r border-dark-walnut"
				style="width: {percentage}%"
			></div>
		</div>

		<input
			type="range"
			{min}
			{max}
			{step}
			{disabled}
			aria-label={__(ariaLabel)}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			bind:value
			oninput={handleInput}
			onchange={handleChange}
			class="
                absolute inset-0 w-full h-full opacity-0 cursor-pointer
                disabled:cursor-not-allowed
            "
		/>

		<div
			class="
                absolute w-4 h-4 bg-washi-white border-2 border-dark-walnut rounded-sm
                pointer-events-none shadow-[2px_2px_0px_var(--color-dark-walnut)]
                flex items-center justify-center
            "
			style="left: calc({percentage}% - 8px)"
		>
			<div class="w-1.5 h-1.5 bg-dark-walnut rounded-full opacity-20"></div>
		</div>
	</div>
</div>
