<script lang="ts">
	import { editor } from '$lib/state/editor.svelte.js';
	import { onMount } from 'svelte';

	// The weather becomes rainy after 45 minutes of focus
	let isRainy = $derived(editor.usageMinutes >= 45);
	let rainCount = $derived(isRainy ? 40 : 0);

	// Pre-calculate positions to avoid layout shifts during reactivity
	const particles = Array.from({ length: 60 }).map(() => ({
		left: Math.random() * 100,
		delay: Math.random() * 2,
		duration: 0.5 + Math.random() * 0.5,
		opacity: 0.1 + Math.random() * 0.2
	}));
</script>

{#if isRainy}
	<div class="pointer-events-none fixed inset-0 z-[5]">
		{#each particles.slice(0, rainCount) as p}
			<div
				class="rain-particle"
				style="
							left: {p.left}%; 
							animation: rain-fall {p.duration}s linear infinite; 
							animation-delay: {p.delay}s;
							opacity: {p.opacity};
							box-shadow: 0 0 2px var(--color-text-main);
						"
			></div>
		{/each}
	</div>
{/if}
