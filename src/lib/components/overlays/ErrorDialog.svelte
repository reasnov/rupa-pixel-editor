<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';

	let { onClose = () => (editor.studio.showErrorDialog = false) } = $props<{
		onClose?: () => void;
	}>();

	const error = $derived(editor.studio.lastError);
</script>

<Dialog
	title={error?.title || 'System Error'}
	subtitle="Technical Exception Details"
	isOpen={true}
	{onClose}
	width="500px"
>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<p class="text-sm font-medium text-text-main/80">
				{error?.message || 'An unexpected error has occurred.'}
			</p>

			{#if error?.technical}
				<div class="mt-4 flex flex-col gap-1">
					<span class="font-mono text-[10px] font-bold text-text-main/40 uppercase"
						>Technical Trace</span
					>
					<pre
						class="max-h-40 overflow-auto rounded-lg bg-text-main/5 p-4 font-mono text-[11px] whitespace-pre-wrap text-text-main/60">
						{error.technical}
					</pre>
				</div>
			{/if}
		</div>

		<div class="flex justify-end gap-3 border-t border-text-main/5 pt-4">
			<Button variant="primary" onclick={onClose} ariaLabel="ui:labels.confirm">
				{__('ui:labels.confirm')}
			</Button>
		</div>
	</div>
</Dialog>
