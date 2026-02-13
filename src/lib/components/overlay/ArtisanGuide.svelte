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
	title="Artisan’s Guide"
	subtitle="The Lexicon of Chords & Flows"
	icon="🪡"
	{onClose}
	width="1000px"
>
	<div class="flex flex-col gap-12">
		<header class="flex flex-col gap-2 rounded-2xl bg-brand/5 p-6 ring-1 ring-brand/10">
			<h3 class="font-tiny5 text-xl text-brand uppercase">Mastering the Chords</h3>
			<p class="font-serif text-xs leading-relaxed opacity-60">
				In Rupa, we do not simply press buttons; we play chords. These combinations of keys create a
				flow state, allowing your needle to dance across the linen with professional precision.
			</p>
		</header>

		<div class="grid grid-cols-2 gap-x-16 gap-y-12">
			{#each groups as group}
				<GuideGroup {group} />
			{/each}
		</div>

		<footer class="mt-4 border-t border-black/5 pt-8 text-center">
			<p class="font-serif text-[10px] italic opacity-40">
				"A master weaver knows every thread by heart."
			</p>
		</footer>
	</div>
</Modal>
