<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

{#if editor.isCursorVisible}
	<div 
		transition:fade={{ duration: 1000 }}
		class="cursor-container absolute inset-0"
	>
		<!-- The main inverted body -->
		<div class="cursor-invert"></div>
		
		<!-- Fine-line artisan brackets with Focus Animation -->
		<div class="bracket tl animate-focus-tl"></div>
		<div class="bracket tr animate-focus-tr"></div>
		<div class="bracket bl animate-focus-bl"></div>
		<div class="bracket br animate-focus-br"></div>

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
				<div 
					class="relative h-7 w-7 rounded-full rounded-br-none border-4 border-white shadow-xl bg-white ring-1 ring-black/5 overflow-hidden"
					style="transform: rotate(45deg);"
				>
					<div class="h-full w-full -rotate-45" style="background-color: {editor.activeColor};"></div>
				</div>
				<div class="w-0.5 h-2 bg-white -mt-0.5 shadow-sm rounded-full opacity-80"></div>
			</div>
		{/if}
	</div>
{/if}

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
		transition: transform 0.2s ease;
	}

	.tl { top: 0; left: 0; border-top: 1.5px solid; border-left: 1.5px solid; }
	.tr { top: 0; right: 0; border-top: 1.5px solid; border-right: 1.5px solid; }
	.bl { bottom: 0; left: 0; border-bottom: 1.5px solid; border-left: 1.5px solid; }
	.br { bottom: 0; right: 0; border-bottom: 1.5px solid; border-right: 1.5px solid; }

	/* Subtle "Breathing" Focus Animation */
	@keyframes focus-tl { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-2px, -2px); } }
	@keyframes focus-tr { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, -2px); } }
	@keyframes focus-bl { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-2px, 2px); } }
	@keyframes focus-br { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, 2px); } }

	.animate-focus-tl { animation: focus-tl 2s ease-in-out infinite; }
	.animate-focus-tr { animation: focus-tr 2s ease-in-out infinite; }
	.animate-focus-bl { animation: focus-bl 2s ease-in-out infinite; }
	.animate-focus-br { animation: focus-br 2s ease-in-out infinite; }
</style>