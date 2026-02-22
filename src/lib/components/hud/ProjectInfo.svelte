<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';
</script>

<div class="flex items-center gap-4 px-4">
	{#if editor.project.lastSaved}
		<div
			transition:fade
			class="flex items-center gap-2 rounded-full border border-evergreen/10 bg-washi-white/50 px-3 py-1"
		>
			<div class="h-1.5 w-1.5 rounded-full bg-fern-green/40" aria-hidden="true"></div>
			<span class="font-mono text-[9px] font-bold tracking-widest text-evergreen/40 uppercase">
				{__('common:project.saved', {
					replace: {
						time: editor.project.lastSaved.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})
					}
				})}
			</span>
		</div>
	{/if}
</div>
