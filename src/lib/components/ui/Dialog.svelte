<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { sfx } from '../../engine/audio.js';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		isOpen: boolean;
		onClose: () => void;
		children?: Snippet;
		footer?: Snippet;
		width?: string;
		maxWidth?: string;
		class?: string;
	}

	let {
		title = '',
		subtitle = '',
		isOpen = false,
		onClose,
		children,
		footer,
		width = 'auto',
		maxWidth = '450px',
		class: className = ''
	}: Props = $props();

	// Register to the global Escape handler when open
	$effect(() => {
		if (isOpen) {
			editor.pushEscapeAction(onClose);
			return () => editor.popEscapeAction(onClose);
		}
	});

	onMount(() => {
		if (isOpen) sfx.playCeramicSlide();
	});

	$effect(() => {
		if (isOpen) sfx.playCeramicSlide();
	});
</script>

{#if isOpen}
	<div
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-[1500] flex items-center justify-center bg-deep-forest/40 backdrop-blur-[2px] p-6"
		onmousedown={(e) => {
			e.stopPropagation();
			if (e.target === e.currentTarget) onClose();
		}}
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut, start: 0.9 }}
			class="
                flex flex-col overflow-hidden bg-washi-white border-2 border-dark-walnut
                shadow-[8px_8px_0px_var(--color-dark-walnut)] rounded-sm
                {className}
            "
			style="width: {width}; max-width: {maxWidth};"
			onmousedown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
		>
			<!-- Header -->
			<div class="px-6 py-5 border-b-2 border-dark-walnut bg-bamboo-shoot/30 flex items-center justify-between">
				<div class="flex flex-col">
					<h2 class="font-tiny5 text-2xl leading-none text-evergreen tracking-wider">{title}</h2>
					{#if subtitle}
						<span class="mt-1 font-serif text-[9px] font-black tracking-[0.2em] text-evergreen/40 uppercase">
							{subtitle}
						</span>
					{/if}
				</div>
				<Button variant="ghost" size="sm" onclick={onClose} ariaLabel="Close">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" class="w-4 h-4 text-evergreen/40">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</Button>
			</div>

			<!-- Content -->
			<div class="px-6 py-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
				{#if children}
					{@render children()}
				{/if}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="px-6 py-4 border-t-2 border-dark-walnut bg-stone-path/20 flex items-center justify-end gap-3">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(52, 78, 65, 0.15);
		border-radius: 0px;
	}
</style>
