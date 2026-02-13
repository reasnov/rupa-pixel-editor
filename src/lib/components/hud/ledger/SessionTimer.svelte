<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
</script>

<div class="flex items-center gap-1.5" title="Working Time">
	<span class="text-[9px] opacity-40">⏳</span>
	<span class="font-mono text-[9px] font-bold text-brand/60 tabular-nums">
		{atelier.studio.sessionTimeLabel}
	</span>
</div>
