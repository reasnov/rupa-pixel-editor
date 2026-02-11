<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let visible = $state(true);

	onMount(() => {
		// Simulate artisan workshop setup
		const timer = setTimeout(() => {
			visible = false;
			// Give extra time for the fade out before letting the app show
			setTimeout(() => {
				editor.isAppReady = true;
			}, 800);
		}, 2000);

		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div 
		out:fade={{ duration: 800 }}
		class="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#fdf6e3] background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');"
	>
		<div class="flex flex-col items-center gap-2 animate-pulse">
			<div class="h-16 w-16 rounded-full border-4 border-studio-warm/20 flex items-center justify-center bg-white shadow-sm mb-4">
				<span class="text-3xl font-serif italic text-studio-warm">R</span>
			</div>
			<h1 class="text-5xl font-serif italic text-studio-warm tracking-tighter">Rupa</h1>
			<p class="text-[10px] uppercase tracking-[0.4em] font-serif font-bold opacity-30">The Weaver's Studio</p>
		</div>

		<div class="absolute bottom-16 flex flex-col items-center gap-4">
			<div class="w-32 h-0.5 bg-studio-text/5 rounded-full overflow-hidden">
				<div class="h-full bg-studio-warm/40 animate-[loading_2s_ease-in-out_infinite]"></div>
			</div>
			<span class="text-[9px] font-serif italic opacity-20 italic">Preparing the linen...</span>
		</div>
	</div>
{/if}

<style>
	@keyframes loading {
		0% { width: 0%; transform: translateX(-100%); }
		50% { width: 50%; transform: translateX(50%); }
		100% { width: 0%; transform: translateX(200%); }
	}
</style>
