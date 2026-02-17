<script lang="ts">
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

<div class="flex {direction} {current.gap} justify-center text-center select-none">
	<h1 class="font-tiny5 leading-none text-brand {current.h1} tracking-tighter">Rupa</h1>

	{#if size === 'sm'}
		<div class="h-3 w-px bg-brand/20" aria-hidden="true"></div>
	{/if}

	<p class="font-serif font-bold tracking-[0.4em] text-charcoal/40 uppercase {current.p}">
		The Barista's Café
	</p>
</div>
