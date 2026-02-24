<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';

	let { onClose = () => (editor.studio.showPourBasin = false) } = $props<{
		onClose?: () => void;
	}>();

	let cups = $state(5);
	let dx = $state(1);
	let dy = $state(0);

	function execute() {
		services.selection.propagate(cups, dx, dy);
		onClose();
	}
</script>

<Dialog
	title="export:propagation.title"
	subtitle="export:propagation.subtitle"
	isOpen={true}
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-8">
		<Input
			label="export:propagation.frames_label"
			type="number"
			bind:value={cups}
			min={1}
			max={editor.project.frames.length - editor.project.activeFrameIndex - 1}
			ariaLabel="export:propagation.frames_label"
		/>

		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<span class="font-serif text-[10px] font-bold tracking-widest text-text-main/60 uppercase">
					{__('export:propagation.offset_label')}
				</span>
				<span class="font-serif text-[9px] text-text-main/40 italic">
					{__('export:propagation.offset_desc')}
				</span>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<Input
					label="workspace:navigation.label_x"
					type="number"
					bind:value={dx}
					ariaLabel="workspace:navigation.label_x"
				/>
				<Input
					label="workspace:navigation.label_y"
					type="number"
					bind:value={dy}
					ariaLabel="workspace:navigation.label_y"
				/>
			</div>
		</div>

		<Button
			variant="primary"
			class="w-full py-4 text-lg"
			onclick={execute}
			disabled={cups <= 0}
			ariaLabel="export:propagation.action"
		>
			{__('export:propagation.action')}
		</Button>
	</div>
</Dialog>
