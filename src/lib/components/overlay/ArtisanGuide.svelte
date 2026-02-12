<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Modal from '../ui/Modal.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (atelier.studio.showArtisanGuide = false) } = $props<{
		onClose: () => void;
	}>();

	const guides = [
		{
			group: 'Navigation & Looming',
			items: [
				{ intent: 'MOVE_UP', label: 'Move Needle' },
				{ intent: 'GOTO', label: 'Go to Coordinate' },
				{ intent: 'FLOW_SELECT', label: 'Block Selection (Hold)' },
				{ intent: 'ESCAPE', label: 'Clear Selection / Dismiss' }
			]
		},
		{
			group: 'Digital Stitching',
			items: [
				{ intent: 'STITCH', label: 'Stitch (Color Cell)' },
				{ intent: 'UNSTITCH', label: 'Unstitch (Clear Cell)' },
				{ intent: 'FLOW_STITCH', label: 'Continuous Threading (Hold)' },
				{ intent: 'FLOW_UNSTITCH', label: 'Continuous Unravelling (Hold)' },
				{ intent: 'PICK_DYE', label: 'Pick Dye from Linen' }
			]
		},
		{
			group: 'History & Studio',
			items: [
				{ intent: 'UNDO', label: 'Undo Last Stitch' },
				{ intent: 'REDO', label: 'Redo Last Stitch' },
				{ intent: 'OPEN_PALETTE', label: 'Open Pattern Catalog' },
				{ intent: 'OPEN_EXPORT', label: 'Export Artifact Crate' },
				{ intent: 'OPEN_SETTINGS', label: 'Linen Settings' }
			]
		}
	];
</script>

<Modal
	title="Artisan's Guide"
	subtitle="Mastering the Digital Loom"
	icon="📜"
	{onClose}
	width="600px"
>
	<div class="grid grid-cols-1 gap-8">
		{#each guides as group}
			<GuideGroup {group} />
		{/each}
	</div>
</Modal>
