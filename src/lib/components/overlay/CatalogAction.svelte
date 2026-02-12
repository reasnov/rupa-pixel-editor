<script lang="ts">
	let { action, isSelected, onSelect } = $props<{
		action: { label: string; shortcut: string; action: () => void };
		isSelected: boolean;
		onSelect: () => void;
	}>();
</script>

<button
	class="artisan-action-btn flex items-center justify-between rounded-xl px-6 py-4 transition-all {isSelected
		? 'active bg-brand text-white shadow-lg'
		: 'hover:bg-black/5'}"
	onclick={() => {
		action.action();
		onSelect();
	}}
	onmouseenter={onSelect}
>
	<span class="font-serif text-sm font-bold tracking-tight">{action.label}</span>
	{#if action.shortcut}
		<span
			class="font-mono text-[10px] font-bold uppercase {isSelected
				? 'text-white/60'
				: 'opacity-20'}"
		>
			{action.shortcut}
		</span>
	{/if}
</button>
