<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		children?: Snippet;
		class?: string;
	}

	let {
		variant = 'secondary',
		size = 'md',
		children,
		class: className = ''
	}: Props = $props();

	const variantClasses = {
		primary: 'bg-lantern-gold text-white border border-dark-walnut shadow-[2px_2px_0px_var(--color-dark-walnut)]',
		secondary: 'bg-washi-white text-evergreen border border-dark-walnut shadow-[2px_2px_0px_var(--color-dark-walnut)]',
		accent: 'bg-sakura-pink text-white border border-dark-walnut shadow-[2px_2px_0px_var(--color-dark-walnut)]',
		danger: 'bg-rust-clay text-white border border-dark-walnut shadow-[2px_2px_0px_var(--color-dark-walnut)]',
		ghost: 'bg-transparent text-evergreen border border-dark-walnut'
	};

	const sizeClasses = {
		sm: 'px-1.5 py-0.5 text-[8px] tracking-widest',
		md: 'px-2 py-0.5 text-[10px] tracking-wider',
		lg: 'px-3 py-1 text-[12px] tracking-normal'
	};
</script>

<span
	class="
        inline-flex items-center justify-center font-bold uppercase
        rounded-sm select-none
        {variantClasses[variant]}
        {sizeClasses[size]}
        {className}
    "
>
	{#if children}
		{@render children()}
	{/if}
</span>
