<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children?: Snippet;
		class?: string;
	}

	let {
		text,
		position = 'top',
		children,
		class: className = ''
	}: Props = $props();

	let isVisible = $state(false);

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-dark-walnut border-x-transparent border-b-transparent',
		bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-dark-walnut border-x-transparent border-t-transparent',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-dark-walnut border-y-transparent border-r-transparent',
		right: 'right-full top-1/2 -translate-y-1/2 border-r-dark-walnut border-y-transparent border-l-transparent'
	};
</script>

<div
	class="relative inline-block {className}"
	onmouseenter={() => (isVisible = true)}
	onmouseleave={() => (isVisible = false)}
>
	{#if children}
		{@render children()}
	{/if}

	{#if isVisible && text}
		<div
			class="
                absolute z-[5000] px-3 py-1.5 whitespace-nowrap
                bg-dark-walnut text-washi-white text-[10px] font-bold uppercase tracking-wider
                rounded-sm shadow-xl pointer-events-none
                {positionClasses[position]}
            "
		>
			{text}
			<div
				class="absolute border-[6px] {arrowClasses[position]}"
			></div>
		</div>
	{/if}
</div>
