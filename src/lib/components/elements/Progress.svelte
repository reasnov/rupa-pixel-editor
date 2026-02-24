<script lang="ts">
	interface Props {
		/** Current progress value (0 to 100) */
		value: number;
		/** Maximum progress value */
		max?: number;
		/** Label for the progress bar */
		label?: string;
		/** Additional CSS classes */
		class?: string;
	}

	let { value = 0, max = 100, label, class: className = '' }: Props = $props();

	const percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));
</script>

<div class="flex w-full flex-col gap-1.5 {className}">
	{#if label}
		<div class="flex items-center justify-between px-1">
			<span class="text-[10px] font-bold tracking-widest text-text-main/70 uppercase">
				{label}
			</span>
			<span class="font-mono text-[10px] text-text-main/90">{Math.round(percentage)}%</span>
		</div>
	{/if}

	<div
		class="
            h-3 w-full overflow-hidden rounded-sm border-2 border-ui-structural
            bg-grid-border shadow-[2px_2px_0px_var(--color-ui-structural)]
        "
	>
		<div
			class="
                h-full border-r-2 border-ui-structural bg-ui-accent
                transition-all duration-300 ease-in-out
            "
			style="width: {percentage}%"
		></div>
	</div>
</div>
