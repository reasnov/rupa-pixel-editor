<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-full w-full items-center px-4">
	{@render children()}
</div>
