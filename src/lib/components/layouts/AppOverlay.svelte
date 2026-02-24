<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="app-overlay contents-interactive pointer-events-none absolute inset-0">
	{@render children()}
</div>

<style>
	/* Make all direct children interactive by default */
	.contents-interactive :global(> *) {
		pointer-events: auto;
	}
</style>
