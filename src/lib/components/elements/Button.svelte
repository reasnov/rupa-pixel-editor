<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'tool' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		isActive?: boolean;
		disabled?: boolean;
		icon?: Snippet;
		children?: Snippet;
		ariaLabel: string;
		onclick?: (event: MouseEvent) => void;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
	}

	let {
		variant = 'secondary',
		size = 'md',
		isActive = false,
		disabled = false,
		icon,
		children,
		ariaLabel,
		onclick,
		type = 'button',
		class: className = ''
	}: Props = $props();

	const variantClasses = {
		primary: 'editor-primary-btn',
		secondary: 'editor-secondary-btn',
		tool: 'editor-tool-btn',
		ghost: 'bg-transparent border-none shadow-none hover:bg-black/5 active:bg-black/10',
		danger:
			'bg-ui-danger text-white border-2 border-ui-structural shadow-[4px_4px_0px_var(--color-ui-structural)] hover:brightness-110 active:shadow-none active:translate-x-0.5 active:translate-y-0.5'
	};

	const sizeClasses = {
		sm: 'px-2 py-1 text-[10px]',
		md: 'px-4 py-2 text-xs',
		lg: 'px-6 py-3 text-sm'
	};
</script>

<button
	{type}
	{disabled}
	aria-label={__(ariaLabel)}
	title={__(ariaLabel)}
	class="
        relative flex cursor-pointer flex-nowrap items-center justify-center gap-2
        whitespace-nowrap select-none focus:ring-2 focus:ring-ui-accent
        focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
        {variantClasses[variant]}
        {variant !== 'ghost' && sizeClasses[size]}
        {isActive ? 'is-active tool-button' : ''}
        {className}
    "
	{onclick}
>
	{#if icon}
		{@render icon()}
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>
