<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (editor.showPersistenceMenu = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal title="Recipe Store" subtitle="Managing Digital Creations" icon="💾" {onClose} width="400px">
	<div class="flex flex-col gap-6">
		<div class="rounded-xl border border-black/5 bg-white/50 p-6">
			<h3 class="mb-2 font-serif text-sm font-bold tracking-tight uppercase opacity-60">
				Recipe Book (.rupa)
			</h3>
			<p class="font-serif text-sm opacity-50">
				Save your art as a dedicated recipe file on your machine or in your browser's local store.
			</p>
		</div>

		<div class="flex flex-col gap-3">
			<button
				class="editor-primary-btn w-full"
				onclick={() => {
					shuttle.persistence.save();
					onClose();
				}}
			>
				Store Recipe to File
			</button>
			<button
				class="editor-secondary-btn w-full"
				onclick={() => {
					shuttle.persistence.load();
					onClose();
				}}
			>
				Load Recipe from File
			</button>
		</div>
	</div>
</Modal>
