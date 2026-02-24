<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { sfx } from '../../engine/audio.js';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { type Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Props {
		title?: string;
		isOpen: boolean;
		onClose: () => void;
		children?: Snippet;
		width?: string;
		class?: string;
	}

	let {
		title = '',
		isOpen = false,
		onClose,
		children,
		width = '320px',
		class: className = ''
	}: Props = $props();

	// Global Escape Handler registration
	$effect(() => {
		if (isOpen) {
			editor.pushEscapeAction(onClose);
			return () => editor.popEscapeAction(onClose);
		}
	});

	// Sound effect on open
	$effect(() => {
		if (isOpen) sfx.playPaperFlip();
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		transition:fade={{ duration: 200 }}
		class="bg-hud-shadow/20 fixed inset-0 z-[1000] backdrop-blur-[1px]"
		onclick={onClose}
	></div>

	<!-- Drawer Surface -->
	<div
		transition:fly={{ x: 400, duration: 400, easing: quintOut }}
		class="
            fixed top-0 right-0 z-[1001] flex
            h-full flex-col border-l-2 border-ui-structural
            bg-canvas-bg shadow-[-8px_0px_0px_rgba(0,0,0,0.05)]
            {className}
        "
		style="width: {width};"
		role="dialog"
		aria-modal="true"
		aria-label={title || __('ui:accessibility.drawer')}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-ui-structural/10 px-6 py-4">
			<h2 class="font-tiny5 text-xl tracking-wider text-text-main uppercase">
				{title ? __(title) : ''}
			</h2>
			<Button variant="ghost" size="sm" onclick={onClose} ariaLabel="ui:labels.close">
				<span class="text-lg opacity-40">✕</span>
			</Button>
		</div>

		<!-- Content -->
		<div class="custom-scrollbar flex-1 overflow-y-auto p-6">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}

<style>
</style>
