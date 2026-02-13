<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Modal from '../ui/Modal.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (atelier.studio.showArtisanGuide = false) } = $props<{
		onClose: () => void;
	}>();

	const guides = [
		{
			group: 'Basic Rhythms (Navigation)',
			items: [
				{ intent: 'MOVE_UP', label: 'Step the Needle (Arrow Keys)' },
				{ intent: 'GOTO', label: 'Jump to a Memory (Coordinate)' },
				{ intent: 'JUMP_HOME', label: 'Return to Center' },
				{ intent: 'ESCAPE', label: 'Clear Focus / Dismiss Overlays' }
			]
		},
		{
			group: 'The Weaver’s Hand (Drawing)',
			items: [
				{ intent: 'STITCH', label: 'Stitch (Apply Active Dye)' },
				{ intent: 'UNSTITCH', label: 'Unstitch (Clear Fiber)' },
				{ intent: 'FLOW_STITCH', label: 'Continuous Threading (Hold)' },
				{ intent: 'FLOW_UNSTITCH', label: 'Continuous Unravelling (Hold)' },
				{ intent: 'PICK_DYE', label: 'Sample Fiber (Eyedropper)' }
			]
		},
		{
			group: 'Artisan Magic (Automation)',
			items: [
				{ intent: 'SOAK', label: 'Dye Soak (Flood Fill)' },
				{ intent: 'BLEACH', label: 'Fiber Bleach (Recolor All)' },
				{ intent: 'SPIRIT_PICK', label: 'Spirit Pick (Magic Selection)' }
			]
		},
		{
			group: 'The Folio & Spindle (Timeline)',
			items: [
				{ intent: 'NEW_FRAME', label: 'Add New Thread of Time (Frame)' },
				{ intent: 'DUPLICATE_FRAME', label: 'Clone Current Thread' },
				{ intent: 'DELETE_FRAME', label: 'Dissolve Thread' },
				{ intent: 'TAB_FRAMES', label: 'Focus the Spindle (Alt+1)' },
				{ intent: 'PLAY_PULSE', label: 'Feel the Pulse (Playback)' },
				{ intent: 'TOGGLE_GHOST_THREADS', label: 'See Ghost Threads (Onion Skin)' }
			]
		},
		{
			group: 'Layering the Veils',
			items: [
				{ intent: 'NEW_VEIL', label: 'Add a New Veil (Layer)' },
				{ intent: 'DUPLICATE_VEIL', label: 'Duplicate Active Veil' },
				{ intent: 'TAB_VEILS', label: 'Focus the Veils (Alt+2)' },
				{ intent: 'TOGGLE_VEIL_VISIBILITY', label: 'Reveal/Hide Veil' },
				{ intent: 'TOGGLE_VEIL_LOCK', label: 'Seal/Unseal Veil' }
			]
		},
		{
			group: 'Studio Environment',
			items: [
				{ intent: 'UNDO', label: 'Rewind the Weave' },
				{ intent: 'REDO', label: 'Fast-Forward the Weave' },
				{ intent: 'OPEN_PALETTE', label: 'Consult the Pattern Catalog' },
				{ intent: 'OPEN_EXPORT', label: 'Open the Artifact Crate' },
				{ intent: 'OPEN_AUDIO', label: 'Tune Harmony & Atmosphere' },
				{ intent: 'TOGGLE_MUTE', label: 'Silence the Studio' }
			]
		}
	];
</script>

<Modal
	title="Artisan’s Guide"
	subtitle="The Lexicon of Chords & Flows"
	icon="🪡"
	{onClose}
	width="900px"
>
	<div class="flex flex-col gap-12">
		<header class="flex flex-col gap-2 rounded-2xl bg-brand/5 p-6 ring-1 ring-brand/10">
			<h3 class="font-tiny5 text-xl text-brand uppercase">Mastering the Chords</h3>
			<p class="font-serif text-xs leading-relaxed opacity-60">
				In Rupa, we do not simply press buttons; we play chords. These combinations of keys create a
				flow state, allowing your needle to dance across the linen with professional precision.
			</p>
		</header>

		<div class="grid grid-cols-2 gap-x-12 gap-y-10">
			{#each guides as group}
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
