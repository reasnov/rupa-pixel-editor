<script lang="ts">
	import './layout.css';
	import '$lib/state/i18n.svelte.js';

	let { children } = $props();
</script>

<div class="stitching-bg flex min-h-screen w-screen flex-col bg-canvas-bg selection:bg-none">
	{@render children()}
</div>
