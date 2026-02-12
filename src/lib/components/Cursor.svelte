<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

{#if editor.isCursorVisible}
	<div transition:fade={{ duration: 800 }} class="cursor-container absolute inset-0">
		<!-- The Artisan Bloom (Transparent Inversion Petals) -->
		<div class="bloom-wrapper">
			<!-- Petals act as inversion lenses -->
			<div class="petal p-top"></div>
			<div class="petal p-bottom"></div>
			<div class="petal p-left"></div>
			<div class="petal p-right"></div>

			<!-- Delicate center dot lens -->
			<div class="center-dot"></div>
		</div>

		<!-- Picking Feedback (Artisan Pin) -->
		{#if editor.isPicking}
			<div
				transition:fade={{ duration: 400 }}
				class="absolute inset-[-4px] z-0 animate-ping rounded-sm border-2 border-white opacity-20"
				style="background-color: {editor.activeColor};"
			></div>

			<div
				in:fly={{ y: -10, duration: 400 }}
				out:fade={{ duration: 400 }}
				class="absolute -top-10 left-1/2 z-[110] flex -translate-x-1/2 flex-col items-center"
			>
				<div
					class="relative h-7 w-7 overflow-hidden rounded-full rounded-br-none border-4 border-white bg-white shadow-xl ring-1 ring-black/5"
					style="transform: rotate(45deg);"
				>
					<div
						class="h-full w-full -rotate-45"
						style="background-color: {editor.activeColor};"
					></div>
				</div>
				<div class="-mt-0.5 h-2 w-0.5 rounded-full bg-white opacity-80 shadow-sm"></div>
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
		background: transparent;
		/* Pure inversion lens without solid color */
		backdrop-filter: invert(100%);
		border-radius: 50%;
		z-index: 10;
	}

	/* Dimensions for the petals */
	.p-top,
	.p-bottom {
		width: 4px;
		height: 10px;
	}
	.p-left,
	.p-right {
		width: 100%;
		height: 4px;
	} /* Horizontal petals */

	/* Refined sizing */
	.p-left,
	.p-right {
		width: 10px;
		height: 4px;
	}

	/* Positioning within the cell */
	.p-top {
		top: 5%;
	}
	.p-bottom {
		bottom: 5%;
	}
	.p-left {
		left: 5%;
	}
	.p-right {
		right: 5%;
	}

	.center-dot {
		width: 3px;
		height: 3px;
		background: transparent;
		backdrop-filter: invert(100%);
		border-radius: 50%;
		z-index: 11;
	}
</style>
