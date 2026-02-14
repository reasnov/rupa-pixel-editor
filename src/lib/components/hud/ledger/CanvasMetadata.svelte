<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="flex items-center gap-4 text-studio-text/40" role="status">
	{#if atelier.project.lastSaved}
		<div transition:fade class="flex items-center gap-1.5">
			<span class="text-[10px]" aria-hidden="true">💾</span>
			<span class="font-mono text-[8px] font-bold tracking-tighter text-brand uppercase">
				{__({
					key: 'project.archived',
					replace: {
						time: atelier.project.lastSaved.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						})
					}
				})}
			</span>
		</div>
		<div class="h-3 w-px bg-brand/20" aria-hidden="true"></div>
	{/if}

	<div class="flex gap-3 font-mono text-[8px] font-bold tracking-tighter uppercase">
		<span>Pos: {atelier.needle.pos.x},{atelier.needle.pos.y}</span>
		<span>Size: {atelier.linen.width}x{atelier.linen.height}</span>
		<span>Zoom: {Math.round(atelier.studio.zoomLevel * 100)}%</span>
	</div>
	<div class="h-3 w-px bg-brand/20" aria-hidden="true"></div>
	<span class="font-mono text-[9px] font-black tracking-widest text-brand/60 uppercase">
		{__({ key: 'stats.technical_ledger' })}
	</span>
</div>
