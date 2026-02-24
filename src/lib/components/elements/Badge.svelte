<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		children?: Snippet;
		class?: string;
	}

	let { variant = 'secondary', size = 'md', children, class: className = '' }: Props = $props();

	const variantClasses = {
		primary:
			'bg-ui-accent text-white border border-ui-structural shadow-[2px_2px_0px_var(--color-ui-structural)]',
		secondary:
			'bg-canvas-bg text-text-main border border-ui-structural shadow-[2px_2px_0px_var(--color-ui-structural)]',
		accent:
			'bg-ui-highlight text-text-main border border-ui-structural shadow-[2px_2px_0px_var(--color-ui-structural)]',
		danger:
			'bg-ui-danger text-white border border-ui-structural shadow-[2px_2px_0px_var(--color-ui-structural)]',
		ghost: 'bg-transparent text-text-main border border-ui-structural'
	};

	const sizeClasses = {
		sm: 'px-1.5 py-0.5 text-[8px] tracking-widest',
		md: 'px-2 py-0.5 text-[10px] tracking-wider',
		lg: 'px-3 py-1 text-[12px] tracking-normal'
	};
</script>

<span
	class="
        inline-flex flex-nowrap items-center justify-center rounded-sm font-bold
        whitespace-nowrap uppercase select-none
        {variantClasses[variant]}
        {sizeClasses[size]}
        {className}
    "
>
	{#if children}
		{@render children()}
	{/if}
</span>
