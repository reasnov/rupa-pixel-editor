<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import { onMount } from 'svelte';

	let { onClose = () => (editor.studio.showGoTo = false) } = $props<{ onClose: () => void }>();

	// We use Cartesian coordinates for input as they match the HUD
	let targetX = $state(editor.displayCoords.x);
	let targetY = $state(editor.displayCoords.y);

	function jump() {
		services.jumpTo(targetX, targetY);
		onClose();
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') jump();
	}

	onMount(() => {
		// Use a slight delay to ensure the modal is rendered and input is focusable
		setTimeout(() => {
			const el = document.getElementById('goto-x') as HTMLInputElement;
			if (el) el.focus();
		}, 100);
	});
</script>

<Dialog
	title="workspace:navigation.title"
	subtitle="workspace:navigation.subtitle"
	isOpen={true}
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-6 rounded-xl border border-text-main/5 bg-text-main/[0.05] p-8">
			<div class="grid grid-cols-2 gap-8">
				<Input
					id="goto-x"
					label="workspace:navigation.label_x"
					type="number"
					bind:value={targetX}
					onkeydown={handleKey}
					ariaLabel="workspace:navigation.label_x"
				/>
				<Input
					id="goto-y"
					label="workspace:navigation.label_y"
					type="number"
					bind:value={targetY}
					onkeydown={handleKey}
					ariaLabel="workspace:navigation.label_y"
				/>
			</div>
			<p class="font-serif text-[10px] leading-relaxed text-text-main/40 italic">
				{__('workspace:navigation.current', {
					replace: { x: editor.displayCoords.x, y: editor.displayCoords.y }
				})}
			</p>
		</div>

		<Button
			variant="primary"
			class="w-full py-4 text-lg"
			onclick={jump}
			ariaLabel="workspace:navigation.action"
		>
			{__('workspace:navigation.action')}
		</Button>
	</div>
</Dialog>
