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

	<!-- Picking Feedback (Artisan Pin) -->
	{#if editor.isPicking}
		<div 
			transition:fade={{ duration: 400 }}
			class="absolute inset-[-4px] border-2 border-white rounded-sm animate-ping opacity-20 z-0"
			style="background-color: {editor.activeColor};"
		></div>
		
		<div 
			in:fly={{ y: -10, duration: 400 }}
			out:fade={{ duration: 400 }}
			class="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-[110]"
		>
			<!-- The Pin Shape -->
			<div class="relative h-7 w-7 rounded-full rounded-bl-none rotate-45 border-4 border-white shadow-xl bg-white ring-1 ring-black/5 overflow-hidden">
				<div class="h-full w-full -rotate-45" style="background-color: {editor.activeColor};"></div>
			</div>
			<!-- Pin Stem (Tip) -->
			<div class="w-1 h-2 bg-white -mt-1 shadow-sm rounded-full"></div>
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
