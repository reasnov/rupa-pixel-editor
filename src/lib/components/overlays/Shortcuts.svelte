<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { keyboard } from '../../engine/keyboard.svelte.js';
	import Drawer from '../elements/Drawer.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (editor.showShortcuts = false) } = $props<{
		onClose: () => void;
	}>();

	// Dynamically fetch all grouped actions from the Engine (SSoT)
	const groups = $derived(keyboard.getGroupedActions());
</script>

<Drawer title="shortcuts:title" isOpen={true} {onClose} width="1000px">
	<div class="flex flex-col gap-12">
		<!-- Minimalist Header -->
		<header
			class="flex flex-col gap-2 rounded-xl bg-ui-structural/5 p-6 ring-1 ring-ui-structural/10"
			aria-labelledby="guide-header-title"
		>
			<h3 id="guide-header-title" class="font-tiny5 text-xl text-text-main uppercase">
				{__('shortcuts:header_title')}
			</h3>
			<p class="font-serif text-xs leading-relaxed text-text-main/60">
				{__('shortcuts:header_desc')}
			</p>

			<!-- Technical Glossary -->
			<div class="mt-4 grid grid-cols-3 gap-4 border-t border-text-main/5 pt-4">
				{#each [['Frame', 'Frame'], ['Layer', 'Layer'], ['Color', 'Color'], ['Tool', 'Tool'], ['Paint', 'Paint'], ['Delete', 'Delete']] as [term, tech]}
					<div class="flex flex-col">
						<span class="font-tiny5 text-[10px] text-ui-accent uppercase">{term}</span>
						<span class="font-serif text-[10px] text-text-main/40 italic">
							{__('shortcuts:glossary_meaning', { replace: { tech } })}
						</span>
					</div>
				{/each}
			</div>
		</header>

		<!-- Shortcut Groups Grid -->
		<div class="grid grid-cols-2 gap-x-16 gap-y-12 px-2">
			{#each groups as group}
				<GuideGroup {group} />
			{/each}
		</div>

		<!-- Neutral Footer -->
		<footer class="mt-4 border-t border-text-main/5 pt-8 text-center">
			<p class="font-serif text-[11px] text-text-main/40 italic">
				"{__('shortcuts:footer_quote')}"
			</p>
		</footer>
	</div>
</Drawer>
