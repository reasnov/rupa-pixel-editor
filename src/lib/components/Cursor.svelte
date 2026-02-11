<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

{#if editor.isCursorVisible}
	<div 
		transition:fade={{ duration: 800 }}
		class="cursor-container absolute inset-0"
	>
		<!-- The Artisan Bloom (4-Petal Inverter) -->
		<div class="bloom-wrapper">
			<!-- Only the petals invert the background -->
			<div class="petal p-top"></div>
			<div class="petal p-bottom"></div>
			<div class="petal p-left"></div>
			<div class="petal p-right"></div>
			
			<!-- Delicate center dot -->
			<div class="center-dot"></div>
		</div>

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

	.bloom-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.petal {
		position: absolute;
		background: white;
		mix-blend-mode: difference;
		border-radius: 50%;
		z-index: 10;
	}

	/* Smaller, more delicate petals */
	.p-top, .p-bottom { width: 4px; height: 8px; }
	.p-left, .p-right { width: 8px; height: 4px; }

	/* Positioning within the cell */
	.p-top { top: 10%; }
	.p-bottom { bottom: 10%; }
	.p-left { left: 10%; }
	.p-right { right: 10%; }

	.center-dot {
		width: 2px;
		height: 2px;
		background: white;
		mix-blend-mode: difference;
		border-radius: 50%;
		z-index: 11;
	}
</style>
