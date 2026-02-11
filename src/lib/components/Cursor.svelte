<script lang="ts">
	import { editor } from '../state/editor.svelte';
</script>

<div class="cursor-container">
	<!-- The main inverted body -->
	<div class="cursor-invert"></div>
	
	<!-- Fine-line artisan brackets -->
	<div class="bracket tl"></div>
	<div class="bracket tr"></div>
	<div class="bracket bl"></div>
	<div class="bracket br"></div>
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
		/* Using both for maximum compatibility and sharpness */
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

	/* Brackets exactly at the edges of the cell */
	.tl { top: 0; left: 0; border-top: 1px solid; border-left: 1px solid; }
	.tr { top: 0; right: 0; border-top: 1px solid; border-right: 1px solid; }
	.bl { bottom: 0; left: 0; border-bottom: 1px solid; border-left: 1px solid; }
	.br { bottom: 0; right: 0; border-bottom: 1px solid; border-right: 1px solid; }
</style>
