<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let {
		title = '',
		subtitle = '',
		icon = '',
		onClose,
		children,
		width = '500px',
		maxHeight = '85vh',
		scrollable = true
	} = $props<{
		title?: string;
		subtitle?: string;
		icon?: string;
		onClose: () => void;
		children: any;
		width?: string;
		maxHeight?: string;
		scrollable?: boolean;
	}>();

	// Register this modal to the global Escape handler
	$effect(() => {
		editor.pushEscapeAction(onClose);
		return () => editor.popEscapeAction(onClose);
	});

	/**
	 * Minimalist Neutral Transition: A clean scale & fade combo.
	 */
	function modalTransition(node: HTMLElement, { duration = 300 }) {
		return {
			duration,
			css: (t: number) => {
				const eased = quintOut(t);
				return `
					opacity: ${t};
					transform: scale(${0.95 + eased * 0.05});
				`;
			}
		};
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	transition:fade={{ duration: 150 }}
	class="fixed inset-0 z-[1100] flex items-center justify-center bg-charcoal/20 backdrop-blur-md"
	onmousedown={(e) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) onClose();
	}}
>
	<div
		in:modalTransition={{ duration: 300 }}
		out:fade={{ duration: 150 }}
		class="flex flex-col gap-6 overflow-hidden rounded-xl border border-charcoal/10 bg-foam-white p-8 shadow-2xl"
		style="width: {width}; max-height: {maxHeight};"
		onmousedown={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Minimalist Header -->
		<div class="flex items-center justify-between border-b border-charcoal/5 pb-4">
			<div class="flex items-center gap-4">
				{#if icon}<span class="text-2xl opacity-40">{icon}</span>{/if}
				<div class="flex flex-col">
					<h2 class="font-tiny5 text-2xl leading-none text-charcoal">{title}</h2>
					{#if subtitle}
						<span
							class="mt-1 font-serif text-[9px] font-black tracking-[0.2em] uppercase text-charcoal/30"
							>{subtitle}</span
						>
					{/if}
				</div>
			</div>
			<button
				onclick={onClose}
				class="rounded-lg border border-charcoal/10 bg-stone-light/50 px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase text-charcoal/40 transition-all hover:bg-brand hover:text-white hover:border-brand"
			>
				Close
			</button>
		</div>

		<!-- Content -->
		<div
			class="custom-scrollbar flex-1 {scrollable
				? 'overflow-y-auto pr-2'
				: 'flex flex-col overflow-hidden'}"
		>
			{@render children()}
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 10px;
	}
</style>
