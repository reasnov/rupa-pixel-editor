<script lang="ts">
	import { __ } from "$lib/state/i18n.svelte.js";
	import { editor } from '../../state/editor.svelte.js';
	import { keyboard } from '../../engine/keyboard.svelte.js';
	import Modal from '../ui/Modal.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (editor.showGuideMenu = false) } = $props<{
		onClose: () => void;
	}>();

	// Dynamically fetch all grouped actions from the Engine (SSoT)
	const groups = $derived(keyboard.getGroupedActions());
</script>

<Modal
	title={__({ key: 'shortcuts.title' })}
	subtitle={__({ key: 'shortcuts.subtitle' })}
	icon="☕"
	{onClose}
	width="1000px"
>
	<div class="flex flex-col gap-12" role="document">
		<!-- Minimalist Header -->
		<header
			class="flex flex-col gap-2 rounded-xl bg-charcoal/5 p-6 ring-1 ring-charcoal/10"
			aria-labelledby="guide-header-title"
		>
			<h3 id="guide-header-title" class="font-tiny5 text-xl text-charcoal uppercase">
				{__({ key: 'shortcuts.header_title' })}
			</h3>
			<p class="font-serif text-xs leading-relaxed text-charcoal/60">
				{__({ key: 'shortcuts.header_desc' })}
			</p>
		</header>

		<!-- Shortcut Groups Grid -->
		<div class="grid grid-cols-2 gap-x-16 gap-y-12">
			{#each groups as group}
				<GuideGroup {group} />
			{/each}
		</div>

		<!-- Neutral Footer -->
		<footer class="mt-4 border-t border-charcoal/5 pt-8 text-center">
			<p class="font-serif text-[11px] text-charcoal/40 italic">
				"{__({ key: 'shortcuts.footer_quote' })}"
			</p>
		</footer>
	</div>
</Modal>
