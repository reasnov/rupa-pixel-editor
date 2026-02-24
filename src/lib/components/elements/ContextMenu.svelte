<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	interface MenuItem {
		label: string;
		icon?: string;
		action: () => void;
		danger?: boolean;
		disabled?: boolean;
	}

	let { x, y, items, onClose } = $props<{
		x: number;
		y: number;
		items: MenuItem[];
		onClose: () => void;
	}>();

	let menuEl = $state<HTMLElement | null>(null);

	// Ensure menu stays within viewport
	let menuWidth = $state(160);
	let menuHeight = $state(100);

	let adjustedX = $derived(
		x + menuWidth > (typeof window !== 'undefined' ? window.innerWidth : 1000) ? x - menuWidth : x
	);
	let adjustedY = $derived(
		y + menuHeight > (typeof window !== 'undefined' ? window.innerHeight : 1000)
			? y - menuHeight
			: y
	);

	onMount(() => {
		if (menuEl) {
			menuWidth = menuEl.offsetWidth;
			menuHeight = menuEl.offsetHeight;
		}
	});
</script>

<svelte:window onmousedown={(e) => !menuEl?.contains(e.target as Node) && onClose()} />

<div
	bind:this={menuEl}
	transition:scale={{ duration: 100, start: 0.95, opacity: 0 }}
	class="fixed z-[2000] min-w-[160px] overflow-hidden rounded-lg border border-text-main/10 bg-canvas-bg/95 p-1 shadow-xl backdrop-blur-md"
	style="left: {adjustedX}px; top: {adjustedY}px;"
	oncontextmenu={(e) => e.preventDefault()}
	role="menu"
	tabindex="-1"
>
	<div class="flex flex-col gap-0.5">
		{#each items as item}
			<button
				onclick={() => {
					if (!item.disabled) {
						item.action();
						onClose();
					}
				}}
				disabled={item.disabled}
				class="flex w-full items-center justify-between rounded px-3 py-2 text-left transition-colors {item.danger
					? 'text-red-600 hover:bg-red-50'
					: 'text-text-main hover:bg-ui-accent/5'} {item.disabled
					? 'cursor-not-allowed opacity-30 grayscale'
					: ''}"
			>
				<div class="flex items-center gap-3">
					{#if item.icon}
						<span class="text-xs opacity-60">{item.icon}</span>
					{/if}
					<span class="font-serif text-xs font-medium">{item.label}</span>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	/* Minimalist styling matching the Café vibe */
</style>
