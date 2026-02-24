<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	type BrandSize = 'sm' | 'md' | 'lg';
	let { size = 'md' } = $props<{ size?: BrandSize }>();

	const sizes: Record<BrandSize, { h1: string; p: string; gap: string }> = {
		sm: { h1: 'text-2xl', p: 'text-[9px]', gap: 'gap-3' },
		md: { h1: 'text-4xl', p: 'text-[11px]', gap: 'gap-2' },
		lg: { h1: 'text-7xl', p: 'text-[14px]', gap: 'gap-4' }
	};

	let current = $derived(sizes[size as BrandSize]);
	// sm: horizontal (row), others: vertical (col)
	let direction = $derived(size === 'sm' ? 'flex-row items-center' : 'flex-col items-center');
</script>

<div class="relative flex {direction} {current.gap} justify-center text-center select-none">
	<!-- VFX: Subtle Steam -->
	<div class="absolute -top-4 left-1/2 -translate-x-1/2">
		{#each Array.from({ length: 3 }) as _, i}
			<div
				class="pixel-steam"
				style="
					animation: steam-drift {2 + i}s infinite ease-out; 
					animation-delay: {i * 0.8}s;
					left: {i * 10 - 10}px;
				"
			></div>
		{/each}
	</div>

	<h1 class="font-tiny5 leading-none text-text-main {current.h1} tracking-tighter">
		{__('common:app.name')}
	</h1>

	{#if size === 'sm'}
		<div class="h-3 w-px bg-text-main/20" aria-hidden="true"></div>
	{/if}

	<p class="font-serif font-bold tracking-[0.4em] text-text-main/40 uppercase {current.p}">
		{__('common:app.tagline')}
	</p>
</div>
