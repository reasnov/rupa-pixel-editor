<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		footer?: Snippet;
		sidebarLeft?: Snippet;
		sidebarRight?: Snippet;
		viewport?: Snippet;
		overlay?: Snippet;
	}

	let { header, footer, sidebarLeft, sidebarRight, viewport, overlay }: Props = $props();
</script>

<div class="app-shell h-screen w-screen overflow-hidden bg-canvas-bg font-serif text-text-main">
	<!-- Top: Header Area -->
	{#if header}
		<header
			class="app-header z-30 h-14 shrink-0 border-b border-text-main/10 bg-canvas-bg shadow-sm"
		>
			{@render header()}
		</header>
	{/if}

	<main class="app-main flex flex-1 overflow-hidden">
		<!-- Left: Sidebar Area -->
		{#if sidebarLeft}
			<aside
				class="app-sidebar-left z-20 w-72 shrink-0 border-r border-text-main/10 bg-canvas-bg/50 shadow-sm"
			>
				{@render sidebarLeft()}
			</aside>
		{/if}

		<!-- Center: Viewport Area -->
		<section class="app-viewport relative flex-1 overflow-hidden bg-grid-border/5">
			{#if viewport}
				{@render viewport()}
			{/if}
		</section>

		<!-- Right: Sidebar Area -->
		{#if sidebarRight}
			<aside
				class="app-sidebar-right z-20 w-80 shrink-0 border-l border-text-main/10 bg-canvas-bg/50 shadow-sm"
			>
				{@render sidebarRight()}
			</aside>
		{/if}
	</main>

	<!-- Bottom: Footer Area -->
	{#if footer}
		<footer
			class="app-footer z-30 h-auto shrink-0 border-t border-text-main/10 bg-canvas-bg shadow-sm"
		>
			{@render footer()}
		</footer>
	{/if}

	<!-- Floating: Overlay Layer -->
	{#if overlay}
		<div class="app-overlay-layer pointer-events-none fixed inset-0 z-[500] overflow-hidden">
			{@render overlay()}
		</div>
	{/if}
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
	}

	/* Ensure smooth layout transitions */
	aside,
	section,
	header,
	footer {
		transition:
			width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
