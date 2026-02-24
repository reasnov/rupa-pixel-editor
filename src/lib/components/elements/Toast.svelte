<script lang="ts">
	import { editor } from '$lib/state/editor.svelte.js';
	import { fade, fly } from 'svelte/transition';

	const studio = editor.studio;
</script>

{#if studio.showToast}
	<div
		transition:fly={{ y: 20, duration: 300 }}
		class="pointer-events-none fixed bottom-24 left-1/2 z-[2000] -translate-x-1/2 rounded-full border border-ui-accent/20 bg-white/90 px-6 py-2 shadow-2xl backdrop-blur-md"
	>
		<div class="flex items-center gap-3">
			<span class="font-tiny5 text-lg tracking-widest text-ui-accent uppercase">
				{studio.toastMessage}
			</span>
		</div>
	</div>
{/if}
