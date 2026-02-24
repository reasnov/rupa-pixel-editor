<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children, side = 'left' }: { children: Snippet; side?: 'left' | 'right' } = $props();
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	{@render children()}
</div>
