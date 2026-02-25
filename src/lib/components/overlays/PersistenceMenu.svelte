<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import { __ } from '$lib/state/i18n.svelte.js';

	let { onClose = () => (editor.showPersistenceMenu = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Dialog
	title="actions:save"
	subtitle="workspace:project.saved"
	isOpen={true}
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-6">
		<div class="rounded-xl border border-text-main/5 bg-text-main/[0.05] p-6">
			<h3 class="mb-2 font-serif text-sm font-bold tracking-tight text-text-main/60 uppercase">
				Project File (.rupa)
			</h3>
			<p class="truncate font-serif text-sm leading-relaxed text-text-main/50">
				{editor.project.currentFilePath
					? editor.project.currentFilePath.split(/[\\/]/).pop()
					: __('workspace:project.unsaved')}
			</p>
		</div>

		<div class="flex flex-col gap-3">
			<Button
				variant="primary"
				class="w-full py-4"
				onclick={() => {
					services.persistence.save();
					onClose();
				}}
				ariaLabel="actions:save"
			>
				{__('actions:save')}
			</Button>
			<Button
				variant="secondary"
				class="w-full py-4"
				onclick={() => {
					services.persistence.load();
					onClose();
				}}
				ariaLabel="actions:open"
			>
				{__('actions:open')}
			</Button>
		</div>
	</div>
</Dialog>
