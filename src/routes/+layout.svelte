<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="stitching-bg flex min-h-screen w-screen flex-col bg-canvas-bg selection:bg-none">
	{@render children()}
</div>
