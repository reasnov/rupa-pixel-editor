<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';
</script>

<div class="flex items-center gap-3 text-evergreen/40" role="status">
	{#if editor.project.lastSaved}
		<div transition:fade class="flex items-center gap-1.5">
			<span class="text-[10px]" aria-hidden="true">📦</span>
			<span class="font-mono text-[8px] font-bold tracking-tighter text-lantern-gold/80 uppercase">
				{__('common:project.saved', {
					replace: {
						time: editor.project.lastSaved.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						})
					}
				})}
			</span>
		</div>
		<div class="h-3 w-px bg-evergreen/20" aria-hidden="true"></div>
	{/if}

	<div class="flex gap-3 font-mono text-[9px] font-bold tracking-tight text-evergreen/60 uppercase">
		<span>POS: {editor.cursor.pos.x},{editor.cursor.pos.y}</span>
		<span>SIZE: {editor.canvas.width}x{editor.canvas.height}</span>
		<span>ZOOM: {Math.round(editor.studio.zoomLevel * 100)}%</span>
	</div>
	<div class="h-3 w-px bg-evergreen/20" aria-hidden="true"></div>
	<span class="font-mono text-[10px] font-black tracking-widest text-lantern-gold/60 uppercase">
		{__('common:stats.technical_details')}
	</span>
</div>
