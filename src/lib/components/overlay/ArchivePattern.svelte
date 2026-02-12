<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (atelier.studio.showArchivePattern = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal
	title="Archive Pattern"
	subtitle="Preserving Digital Stitches"
	icon="💾"
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-6">
		<div class="rounded-2xl border border-black/5 bg-white/50 p-6">
			<h3 class="mb-2 font-serif text-sm font-bold tracking-tight uppercase opacity-60">
				Pattern Book (.rupa)
			</h3>
			<p class="font-serif text-sm opacity-50">
				Save your work as a dedicated file on your machine or in your browser's archive.
			</p>
		</div>

		<div class="flex flex-col gap-3">
			<button
				class="artisan-primary-btn w-full"
				onclick={() => {
					shuttle.persistence.save();
					onClose();
				}}
			>
				Archive to Pattern Book
			</button>
			<button
				class="artisan-secondary-btn w-full"
				onclick={() => {
					shuttle.persistence.load();
					onClose();
				}}
			>
				Restore from Pattern Book
			</button>
		</div>
	</div>
</Modal>
