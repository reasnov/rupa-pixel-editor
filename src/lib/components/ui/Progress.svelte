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

	let {
		value = 0,
		max = 100,
		label,
		class: className = ''
	}: Props = $props();

	const percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));
</script>

<div class="flex flex-col gap-1.5 w-full {className}">
	{#if label}
		<div class="flex justify-between items-center px-1">
			<span class="text-[10px] font-bold uppercase tracking-widest text-evergreen/70">
				{label}
			</span>
			<span class="text-[10px] font-mono text-evergreen/90">{Math.round(percentage)}%</span>
		</div>
	{/if}

	<div
		class="
            w-full h-3 bg-stone-path border-2 border-dark-walnut rounded-sm
            shadow-[2px_2px_0px_var(--color-dark-walnut)] overflow-hidden
        "
	>
		<div
			class="
                h-full bg-lantern-gold border-r-2 border-dark-walnut
                transition-all duration-300 ease-in-out
            "
			style="width: {percentage}%"
		></div>
	</div>
</div>
