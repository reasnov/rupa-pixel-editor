<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="flex items-center gap-4 opacity-40">
	{#if atelier.lastSaved}
		<div transition:fade class="flex items-center gap-1.5">
			<span class="text-[10px]">💾</span>
			<span class="font-mono text-[8px] font-bold tracking-tighter text-brand uppercase">
				Backed up: {atelier.lastSaved.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				})}
			</span>
		</div>
		<div class="h-3 w-px bg-brand/20"></div>
	{/if}

	<div class="flex gap-3 font-mono text-[8px] font-bold tracking-tighter uppercase">
		<span>Pos: {atelier.needlePos.x},{atelier.needlePos.y}</span>
		<span>Size: {atelier.linenWidth}x{atelier.linenHeight}</span>
		<span>Zoom: {Math.round(atelier.zoomLevel * 100)}%</span>
	</div>
	<div class="h-3 w-px bg-brand/20"></div>
	<span class="font-mono text-[9px] font-black tracking-widest text-brand/60 uppercase">
		Technical Ledger
	</span>
</div>
