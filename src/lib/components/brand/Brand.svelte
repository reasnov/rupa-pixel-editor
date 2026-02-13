<script lang="ts">
	type BrandSize = 'sm' | 'md' | 'lg';
	let { size = 'md' } = $props<{ size?: BrandSize }>();

	const sizes: Record<BrandSize, { h1: string; p: string }> = {
		sm: { h1: 'text-xl', p: 'text-[6px]' },
		md: { h1: 'text-3xl', p: 'text-[8px]' },
		lg: { h1: 'text-6xl', p: 'text-[12px]' }
	};

	let current = $derived(sizes[size as BrandSize]);
</script>

<div class="flex flex-col items-center justify-center text-center">
	<h1 class="font-tiny5 leading-none text-brand {current.h1} tracking-tighter">Rupa</h1>
	<p class="font-serif font-bold tracking-[0.3em] uppercase opacity-40 {current.p}">
		The Weaver's Studio
	</p>
</div>
