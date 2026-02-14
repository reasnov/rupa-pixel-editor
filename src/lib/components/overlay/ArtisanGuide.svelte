<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { loompad } from '../../engine/loompad.svelte.js';
	import Modal from '../ui/Modal.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (atelier.studio.showArtisanGuide = false) } = $props<{
		onClose: () => void;
	}>();

	// Dynamically fetch all grouped actions from the Engine (SSoT)
	const groups = $derived(loompad.getGroupedActions());
</script>

<Modal
	title={__({ key: 'guide.title' })}
	subtitle={__({ key: 'guide.subtitle' })}
	icon="🪡"
	{onClose}
	width="1000px"
>
	<div class="flex flex-col gap-12" role="document">
		<header
			class="flex flex-col gap-2 rounded-2xl bg-brand/5 p-6 ring-1 ring-brand/10"
			aria-labelledby="guide-header-title"
		>
			<h3 id="guide-header-title" class="font-tiny5 text-xl text-brand uppercase">
				{__({ key: 'guide.header_title' })}
			</h3>
			<p class="font-serif text-xs leading-relaxed text-studio-text/60">
				{__({ key: 'guide.header_desc' })}
			</p>
		</header>

		<div class="grid grid-cols-2 gap-x-16 gap-y-12">
			{#each groups as group}
				<GuideGroup {group} />
			{/each}
		</div>

		<footer class="mt-4 border-t border-black/5 pt-8 text-center">
			<p class="font-serif text-[10px] text-studio-text/40 italic">
				"{__({ key: 'guide.footer_quote' })}"
			</p>
		</footer>
	</div>
</Modal>
