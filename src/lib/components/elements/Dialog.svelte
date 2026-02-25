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
		zIndex?: number;
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
		maxWidth = '95vw',
		zIndex = 1500,
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
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 flex items-center justify-center bg-ui-structural/40 p-4 backdrop-blur-[2px] md:p-8"
		style="z-index: {zIndex};"
		onmousedown={(e) => {
			e.stopPropagation();
			if (e.target === e.currentTarget) onClose();
		}}
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut, start: 0.9 }}
			class="
                flex max-h-[90vh] flex-col overflow-hidden rounded-sm border-2
                border-ui-structural bg-canvas-bg shadow-[8px_8px_0px_var(--color-ui-structural)]
                {className}
            "
			style="width: {width}; max-width: {maxWidth};"
			onmousedown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- Header -->
			<div
				class="flex shrink-0 items-center justify-between border-b-2 border-ui-structural bg-sidebar-bg/30 px-6 py-5"
			>
				<div class="flex flex-col">
					<h2 class="font-tiny5 text-2xl leading-none tracking-wider text-text-main">
						{title ? __(title) : ''}
					</h2>
					{#if subtitle}
						<span
							class="mt-1 font-serif text-[9px] font-black tracking-[0.2em] text-text-main/40 uppercase"
						>
							{subtitle ? __(subtitle) : ''}
						</span>
					{/if}
				</div>
				<Button variant="ghost" size="sm" onclick={onClose} ariaLabel="ui:labels.close">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="square"
						class="h-4 w-4 text-text-main/40"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</Button>
			</div>

			<!-- Content -->
			<div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
				{#if children}
					{@render children()}
				{/if}
			</div>

			<!-- Footer -->
			{#if footer}
				<div
					class="flex shrink-0 items-center justify-end gap-3 border-t-2 border-ui-structural bg-grid-border/20 px-6 py-4"
				>
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
</style>
