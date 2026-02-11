<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

<div class="cursor-container absolute inset-0">
	<!-- The main inverted body -->
	<div class="cursor-invert"></div>
	
	<!-- Fine-line artisan brackets -->
	<div class="bracket tl"></div>
	<div class="bracket tr"></div>
	<div class="bracket bl"></div>
	<div class="bracket br"></div>

	<!-- Picking Feedback (Dye Bloom) -->
	{#if editor.isPicking}
		<div 
			transition:fade={{ duration: 400 }}
			class="absolute inset-[-8px] border-4 border-white rounded-lg animate-ping opacity-20 z-0"
			style="background-color: {editor.activeColor};"
		></div>
		
		<div 
			in:fly={{ y: -20, duration: 500 }}
			out:fade={{ duration: 500 }}
			class="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[110]"
		>
			<div class="h-8 w-8 rounded-full border-4 border-white shadow-xl p-0.5 bg-white ring-1 ring-black/5">
				<div class="h-full w-full rounded-full" style="background-color: {editor.activeColor};"></div>
			</div>
			<span class="font-mono text-[8px] bg-[#fdf6e3] px-2 py-0.5 rounded-full border border-white shadow-sm text-studio-text whitespace-nowrap uppercase tracking-tighter">
				{editor.activeColor}
			</span >
		</div>
	{/if}
</div>

<style>
	.cursor-container {
		position: absolute;
		inset: 0;
		z-index: 100;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cursor-invert {
		position: absolute;
		inset: 0;
		backdrop-filter: invert(100%);
		background: rgba(255, 255, 255, 0.05);
	}

	.bracket {
		position: absolute;
		width: 4px;
		height: 4px;
		border-color: var(--color-studio-warm);
		opacity: 0.8;
	}

	.tl { top: 0; left: 0; border-top: 1px solid; border-left: 1px solid; }
	.tr { top: 0; right: 0; border-top: 1px solid; border-right: 1px solid; }
	.bl { bottom: 0; left: 0; border-bottom: 1px solid; border-left: 1px solid; }
	.br { bottom: 0; right: 0; border-bottom: 1px solid; border-right: 1px solid; }
</style>