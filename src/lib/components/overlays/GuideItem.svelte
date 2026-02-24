<script lang="ts">
	import { keyboard } from '../../engine/keyboard.svelte.js';

	let { intent, label, customKey } = $props<{
		intent: string;
		label: string;
		customKey?: string;
	}>();
</script>

<div class="flex items-center justify-between">
	<span class="font-serif text-sm text-text-main/80">{label}</span>
	<kbd
		class="rounded border border-ui-structural/20 bg-canvas-bg px-2 py-1 font-mono text-[10px] font-bold text-ui-structural shadow-sm ring-1 ring-ui-structural/10"
	>
		{customKey || keyboard.getLabel(intent as any)}
	</kbd>
</div>
