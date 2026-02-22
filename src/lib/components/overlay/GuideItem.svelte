<script lang="ts">
	import { keyboard } from '../../engine/keyboard.svelte.js';

	let { intent, label, customKey } = $props<{
		intent: string;
		label: string;
		customKey?: string;
	}>();
</script>

<div class="flex items-center justify-between">
	<span class="font-serif text-sm text-evergreen/80">{label}</span>
	<kbd
		class="rounded border border-dark-walnut/20 bg-washi-white px-2 py-1 font-mono text-[10px] font-bold text-dark-walnut shadow-sm ring-1 ring-dark-walnut/10"
	>
		{customKey || keyboard.getLabel(intent as any)}
	</kbd>
</div>
