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

	const id = `slider-${Math.random().toString(36).slice(2, 9)}`;
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

<div class="flex w-full flex-col gap-1.5 {className}">
	{#if label}
		<div class="flex items-center justify-between px-1">
			<label class="text-[10px] font-bold tracking-widest text-text-main/70 uppercase" for={id}>
				{__(label)}
			</label>
			<span class="font-mono text-[10px] text-text-main/90">{value}</span>
		</div>
	{/if}

	<div class="relative flex h-8 w-full items-center">
		<div
			class="absolute h-1.5 w-full overflow-hidden rounded-full border border-ui-structural bg-grid-border"
		>
			<div
				class="h-full border-r border-ui-structural bg-ui-accent"
				style="width: {percentage}%"
			></div>
		</div>

		<input
			{id}
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
                absolute inset-0 h-full w-full cursor-pointer opacity-0
                disabled:cursor-not-allowed
            "
		/>

		<div
			class="
                pointer-events-none absolute flex h-4 w-4 items-center justify-center
                rounded-sm border-2 border-ui-structural
                bg-canvas-bg shadow-[2px_2px_0px_var(--color-ui-structural)]
            "
			style="left: calc({percentage}% - 8px)"
		>
			<div class="h-1.5 w-1.5 rounded-full bg-ui-structural opacity-20"></div>
		</div>
	</div>
</div>
