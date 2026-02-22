<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { sfx } from '../../engine/audio.js';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

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

	onMount(() => {
		sfx.playCeramicSlide();
	});

	/**
	 * Shoji Slide Transition: A horizontal slide mimicking a wooden sliding door.
	 */
	function shojiTransition(node: HTMLElement, { duration = 400 }) {
		return {
			duration,
			css: (t: number) => {
				const eased = quintOut(t);
				const x = (1 - eased) * 100;
				return `
					opacity: ${t};
					transform: translateX(${x}%);
				`;
			}
		};
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	transition:fade={{ duration: 200 }}
	class="fixed inset-0 z-[1100] flex items-center justify-end bg-deep-forest/20 backdrop-blur-sm"
	onmousedown={(e) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) onClose();
	}}
>
	<div
		in:shojiTransition={{ duration: 500 }}
		out:shojiTransition={{ duration: 300 }}
		class="flex h-full flex-col gap-6 overflow-hidden border-l-4 border-dark-walnut bg-washi-white p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
		style="width: {width}; max-height: 100vh;"
		onmousedown={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Minimalist Header -->
		<div class="flex items-center justify-between border-b border-evergreen/5 pb-4">
			<div class="flex items-center gap-4">
				{#if icon}<span class="text-2xl opacity-40">{icon}</span>{/if}
				<div class="flex flex-col">
					<h2 class="font-tiny5 text-2xl leading-none text-evergreen">{title}</h2>
					{#if subtitle}
						<span
							class="mt-1 font-serif text-[9px] font-black tracking-[0.2em] text-evergreen/30 uppercase"
							>{subtitle}</span
						>
					{/if}
				</div>
			</div>
			<button
				onclick={onClose}
				class="rounded-lg border border-evergreen/10 bg-bamboo-shoot/50 px-4 py-1.5 text-[9px] font-bold tracking-widest text-evergreen/40 uppercase transition-all hover:border-lantern-gold hover:bg-lantern-gold hover:text-white"
			>
				{__('common:labels.ESCAPE')}
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
		background: rgba(52, 78, 65, 0.1);
		border-radius: 10px;
	}
</style>
