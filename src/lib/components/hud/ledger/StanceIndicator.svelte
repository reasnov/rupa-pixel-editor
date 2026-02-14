<script lang="ts">
	import { stance } from '../../../engine/stance.svelte';
</script>

<div class="flex items-center gap-2">
	<span class="font-serif text-[8px] font-black tracking-widest text-brand/40 uppercase italic"
		>{__({ key: 'ledger.stance' })}:</span
	>
	<span class="font-mono text-[9px] font-bold text-brand uppercase">
		{stance.current.type}
	</span>
</div>
