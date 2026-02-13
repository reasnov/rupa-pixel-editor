<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Modal from '../ui/Modal.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (atelier.studio.showArtisanGuide = false) } = $props<{
		onClose: () => void;
	}>();

	const guides = [
		{
			group: 'The Needle (Navigation)',
			items: [
				{ intent: 'MOVE_UP', label: 'Step the Needle', customKey: 'Arrows' },
				{ intent: 'GOTO', label: 'Jump to Coordinate' },
				{ intent: 'JUMP_HOME', label: 'Return to Center' },
				{ intent: 'ESCAPE', label: 'Clear Focus / Dismiss' }
			]
		},
		{
			group: 'The Hand (Basic Stitching)',
			items: [
				{ intent: 'STITCH', label: 'Apply Active Dye' },
				{ intent: 'UNSTITCH', label: 'Clear Fiber (Unstitch)' },
				{ intent: 'PICK_DYE', label: 'Sample Color (Picker)' },
				{ intent: 'SELECT_DYE_1', label: 'Select Dye Swatches', customKey: '1-0' }
			]
		},
		{
			group: 'Continuous Weaving (Flows)',
			items: [
				{ intent: 'FLOW_STITCH', label: 'Continuous Threading', customKey: 'Ctrl' },
				{ intent: 'FLOW_UNSTITCH', label: 'Continuous Unravelling', customKey: 'Ctrl+Shift' },
				{ intent: 'FLOW_SELECT', label: 'Define Selection (Loom)', customKey: 'Shift' },
				{ intent: 'SPIRIT_PICK', label: 'Magic Selection (Spirit)' }
			]
		},
		{
			group: 'The Loom (Manipulation)',
			items: [
				{ intent: 'COPY', label: 'Capture to Swatch (Copy)' },
				{ intent: 'CUT', label: 'Snip to Swatch (Cut)' },
				{ intent: 'PASTE', label: 'Weave from Clipboard' },
				{ intent: 'SOAK', label: 'Dye Soak (Flood Fill)' },
				{ intent: 'BLEACH', label: 'Fiber Bleach (Recolor All)' },
				{ intent: 'CLEAR_LINEN', label: 'Strip the Linen (Clear All)' }
			]
		},
		{
			group: 'Dimensions & Forms (Transform)',
			items: [
				{ intent: 'FLIP_H', label: 'Flip Horizontally' },
				{ intent: 'FLIP_V', label: 'Flip Vertically' },
				{ intent: 'ROTATE', label: 'Rotate 90° Clockwise' },
				{ intent: 'ZOOM_IN', label: 'Zoom In', customKey: '+ / =' },
				{ intent: 'ZOOM_OUT', label: 'Zoom Out', customKey: '-' },
				{ intent: 'RESET_ZOOM', label: 'Reset Zoom' }
			]
		},
		{
			group: 'The Spindle (Animation)',
			items: [
				{ intent: 'NEW_FRAME', label: 'New Time Thread (Frame)' },
				{ intent: 'DUPLICATE_FRAME', label: 'Clone Current Thread' },
				{ intent: 'DELETE_FRAME', label: 'Dissolve Thread' },
				{ intent: 'PLAY_PULSE', label: 'Toggle Playback' },
				{ intent: 'TOGGLE_GHOST_THREADS', label: 'Onion Skin (Ghosts)' },
				{ intent: 'TAB_FRAMES', label: 'Focus Spindle Tab' }
			]
		},
		{
			group: 'The Veils (Layering)',
			items: [
				{ intent: 'NEW_VEIL', label: 'Add New Veil (Layer)' },
				{ intent: 'DUPLICATE_VEIL', label: 'Clone Active Veil' },
				{ intent: 'DELETE_VEIL', label: 'Remove Active Veil' },
				{ intent: 'MOVE_VEIL_UP', label: 'Lift Veil Up', customKey: '[' },
				{ intent: 'MOVE_VEIL_DOWN', label: 'Lower Veil Down', customKey: ']' },
				{ intent: 'TAB_VEILS', label: 'Focus Veils Tab' },
				{ intent: 'TOGGLE_VEIL_VISIBILITY', label: 'Reveal/Hide Veil' },
				{ intent: 'TOGGLE_VEIL_LOCK', label: 'Seal/Unseal Veil' }
			]
		},
		{
			group: 'The Pattern Book (Persistence)',
			items: [
				{ intent: 'OPEN_ARCHIVE', label: 'Archive Pattern (Save)' },
				{ intent: 'OPEN', label: 'Open Pattern Book' },
				{ intent: 'OPEN_EXPORT', label: 'Create Artifact (Export)' },
				{ intent: 'OPEN_PALETTE', label: 'Pattern Catalog (Search)' },
				{ intent: 'OPEN_SETTINGS', label: 'Studio Settings' },
				{ intent: 'OPEN_CODEX', label: 'Open Artisan Codex' }
			]
		},
		{
			group: 'Atmosphere & Tuning',
			items: [
				{ intent: 'OPEN_AUDIO', label: 'Open Audio Basin' },
				{ intent: 'TOGGLE_MUTE', label: 'Silence the Studio' },
				{ intent: 'UNDO', label: 'Rewind Last Action' },
				{ intent: 'REDO', label: 'Fast-Forward the Weave' }
			]
		}
	];
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
