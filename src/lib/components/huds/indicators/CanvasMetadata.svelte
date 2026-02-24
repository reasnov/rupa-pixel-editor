<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';
	import Badge from '../../elements/Badge.svelte';
</script>

<div class="flex items-center gap-3 text-text-main/40" role="status">
	{#if editor.project.lastSaved}
		<div transition:fade class="flex items-center gap-1.5">
			<span class="text-[10px]" aria-hidden="true">📦</span>
			<Badge variant="primary" size="sm" class="!bg-ui-accent/10 !text-ui-accent/80">
				{__('workspace:project.saved', {
					replace: {
						time: editor.project.lastSaved.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						})
					}
				})}
			</Badge>
		</div>
		<div class="h-3 w-px bg-text-main/20" aria-hidden="true"></div>
	{/if}

	<div class="flex gap-3 font-mono text-[9px] font-bold tracking-tight text-text-main/60 uppercase">
		<span>{__('workspace:stats.pos_label')}: {editor.cursor.pos.x},{editor.cursor.pos.y}</span>
		<span>{__('workspace:stats.size_label')}: {editor.canvas.width}x{editor.canvas.height}</span>
		<span>{__('workspace:stats.zoom_label')}: {Math.round(editor.studio.zoomLevel * 100)}%</span>
	</div>
	<div class="h-3 w-px bg-text-main/20" aria-hidden="true"></div>
	<Badge variant="secondary" size="sm">
		{__('workspace:stats.technical_details')}
	</Badge>
</div>
