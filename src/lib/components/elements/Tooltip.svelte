<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children?: Snippet;
		class?: string;
	}

	let { text, position = 'top', children, class: className = '' }: Props = $props();

	let isVisible = $state(false);

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-ui-structural border-x-transparent border-b-transparent',
		bottom:
			'bottom-full left-1/2 -translate-x-1/2 border-b-ui-structural border-x-transparent border-t-transparent',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-ui-structural border-y-transparent border-r-transparent',
		right:
			'right-full top-1/2 -translate-y-1/2 border-r-ui-structural border-y-transparent border-l-transparent'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative inline-block {className}"
	onmouseenter={() => (isVisible = true)}
	onmouseleave={() => (isVisible = false)}
	onfocusin={() => (isVisible = true)}
	onfocusout={() => (isVisible = false)}
>
	{#if children}
		{@render children()}
	{/if}

	{#if isVisible && text}
		<div
			class="
                pointer-events-none absolute z-[5000] rounded-sm bg-ui-structural
                px-3 py-1.5 text-[10px] font-bold tracking-wider whitespace-nowrap
                text-canvas-bg uppercase shadow-xl
                {positionClasses[position]}
            "
			role="tooltip"
		>
			{__(text)}
			<div class="absolute border-[6px] {arrowClasses[position]}"></div>
		</div>
	{/if}
</div>
