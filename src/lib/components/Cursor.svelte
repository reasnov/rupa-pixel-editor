<script lang="ts">
	import { editor } from '../state/editor.svelte';
</script>

<div class="cursor-needle animate-needle absolute inset-0"></div>

<style>
	.cursor-needle {
		z-index: 100;
		pointer-events: none;
		/* This creates the inversion without needing a background color */
		backdrop-filter: invert(100%);
		background: transparent;
	}

	@keyframes needle-dance {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.03);
		}
		100% {
			transform: scale(1);
		}
	}

	.animate-needle {
		animation: needle-dance 1s ease-in-out infinite;
	}
</style>
