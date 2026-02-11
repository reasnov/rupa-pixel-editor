<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

{#if editor.isCursorVisible}
	<div 
		transition:fade={{ duration: 800 }}
		class="cursor-container absolute inset-0"
	>
		<!-- The Inverted Target (Crosshair) -->
		<div class="target-crosshair">
			<!-- Horizontal Line -->
			<div class="line horizontal"></div>
			<!-- Vertical Line -->
			<div class="line vertical"></div>
			
			<!-- Small Target Arrows (Brackets) -->
			<div class="arrow top"></div>
			<div class="arrow bottom"></div>
			<div class="arrow left"></div>
			<div class="arrow right"></div>
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

	.target-crosshair {
		position: absolute;
		inset: -4px; /* Spread slightly outside for awareness */
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: invert(100%);
	}

	.line {
		position: absolute;
		background: white; /* Basis for inversion */
		opacity: 0.5;
	}

	.horizontal { width: 100%; height: 1px; }
	.vertical { width: 1px; height: 100%; }

	.arrow {
		position: absolute;
		width: 0;
		height: 0;
		border-style: solid;
		opacity: 0.8;
	}

	/* Micro-arrows pointing to the center */
	.top { 
		top: 0; 
		border-width: 4px 3px 0 3px; 
		border-color: white transparent transparent transparent; 
	}
	.bottom { 
		bottom: 0; 
		border-width: 0 3px 4px 3px; 
		border-color: transparent transparent white transparent; 
	}
	.left { 
		left: 0; 
		border-width: 3px 0 3px 4px; 
		border-color: transparent transparent transparent white; 
	}
	.right { 
		right: 0; 
		border-width: 3px 4px 3px 0; 
		border-color: transparent white transparent transparent;
	}
</style>
