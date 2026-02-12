<script lang="ts">
	import { loompad } from '../../engine/loompad.svelte.js';

	let { intent, label } = $props<{
		intent: string;
		label: string;
	}>();
</script>

<div class="flex items-center justify-between">
	<span class="font-serif text-sm opacity-60">{label}</span>
	<kbd
		class="rounded border border-black/10 bg-white/50 px-2 py-1 font-mono text-[10px] font-bold shadow-sm"
	>
		{loompad.getLabel(intent as any)}
	</kbd>
</div>
