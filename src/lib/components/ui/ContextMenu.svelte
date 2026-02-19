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
	let adjustedX = $state(x);
	let adjustedY = $state(y);

	onMount(() => {
		if (menuEl) {
			const rect = menuEl.getBoundingClientRect();
			if (x + rect.width > window.innerWidth) adjustedX = x - rect.width;
			if (y + rect.height > window.innerHeight) adjustedY = y - rect.height;
		}
	});
</script>

<svelte:window onmousedown={(e) => !menuEl?.contains(e.target as Node) && onClose()} />

<div
	bind:this={menuEl}
	transition:scale={{ duration: 100, start: 0.95, opacity: 0 }}
	class="fixed z-[2000] min-w-[160px] overflow-hidden rounded-lg border border-charcoal/10 bg-foam-white/95 p-1 shadow-xl backdrop-blur-md"
	style="left: {adjustedX}px; top: {adjustedY}px;"
	oncontextmenu={(e) => e.preventDefault()}
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
					: 'text-charcoal hover:bg-brand/5'} {item.disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''}"
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
