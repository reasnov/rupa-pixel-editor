<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (editor.showPersistenceMenu = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal title="Artisan Records" subtitle="Preserving Your Stories" icon="📦" {onClose} width="400px">
	<div class="flex flex-col gap-6">
		<div class="rounded-xl border border-evergreen/5 bg-white/50 p-6">
			<h3 class="mb-2 font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase">
				Chronicle Book (.rupa)
			</h3>
			<p class="font-serif text-sm leading-relaxed text-evergreen/50">
				Save your art as a dedicated chronicle file on your machine or in the sanctuary's memory.
			</p>
		</div>

		<div class="flex flex-col gap-3">
			<button
				class="editor-primary-btn w-full py-4"
				onclick={() => {
					services.persistence.save();
					onClose();
				}}
			>
				Store Record to File
			</button>
			<button
				class="editor-secondary-btn w-full py-4"
				onclick={() => {
					services.persistence.load();
					onClose();
				}}
			>
				Load Record from File
			</button>
		</div>
	</div>
</Modal>
