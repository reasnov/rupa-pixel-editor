<script lang="ts">
	import './layout.css';
	import '$lib/state/i18n.svelte.js';
	import AtmosphereOverlay from '$lib/components/elements/AtmosphereOverlay.svelte';

	let { children } = $props();
</script>

<div class="stitching-bg flex min-h-screen w-screen flex-col bg-canvas-bg selection:bg-none">
	<AtmosphereOverlay />
	<div class="crt-overlay"></div>
	<div class="vignette"></div>
	{@render children()}
</div>
