<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';

	let { onResolve } = $props<{ onResolve: () => void }>();

	async function handleRestore() {
		const success = await services.persistence.restoreLastSession();
		if (success) {
			editor.studio.show(__('ui:studio.session_restored'));
		}
		onResolve();
	}

	function handleDiscard() {
		onResolve();
	}
</script>

<Dialog
	title={__('ui:labels.recovery_title')}
	subtitle={__('ui:labels.recovery_subtitle')}
	isOpen={true}
	onClose={handleDiscard}
	width="450px"
>
	<div class="flex flex-col gap-6">
		<p class="text-sm leading-relaxed text-text-main/70">
			{__('ui:labels.recovery_description')}
		</p>

		<div class="flex justify-end gap-3 border-t border-text-main/5 pt-4">
			<Button variant="ghost" onclick={handleDiscard} ariaLabel="ui:labels.cancel">
				{__('ui:labels.cancel')}
			</Button>
			<Button variant="primary" onclick={handleRestore} ariaLabel="ui:labels.confirm">
				{__('ui:labels.confirm')}
			</Button>
		</div>
	</div>
</Dialog>
