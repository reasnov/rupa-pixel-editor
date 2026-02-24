<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Modal from '../ui/Modal.svelte';
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
		document.getElementById('goto-x')?.focus();
	});
</script>

<Modal
	title={__('common:navigation.title')}
	subtitle={__('common:navigation.subtitle')}
	icon="📍"
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-8" role="form">
		<div class="flex flex-col gap-6 rounded-xl border border-evergreen/5 bg-white/40 p-8">
			<div class="grid grid-cols-2 gap-8">
				<div class="flex flex-col gap-2">
					<label
						for="goto-x"
						class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase"
					>
						{__('common:navigation.label_x')}
					</label>
					<input
						id="goto-x"
						type="number"
						bind:value={targetX}
						onkeydown={handleKey}
						class="rounded-xl border border-evergreen/10 bg-white px-4 py-3 font-mono text-xl text-evergreen focus:border-lantern-gold focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="goto-y"
						class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase"
					>
						{__('common:navigation.label_y')}
					</label>
					<input
						id="goto-y"
						type="number"
						bind:value={targetY}
						onkeydown={handleKey}
						class="rounded-xl border border-evergreen/10 bg-white px-4 py-3 font-mono text-xl text-evergreen focus:border-lantern-gold focus:outline-none"
					/>
				</div>
			</div>
			<p class="font-serif text-[10px] leading-relaxed text-evergreen/40 italic">
				{__('common:navigation.current', {
					replace: { x: editor.displayCoords.x, y: editor.displayCoords.y }
				})}
			</p>
		</div>

		<button class="editor-primary-btn w-full py-4 text-lg" onclick={jump}>
			{__('common:navigation.action')}
		</button>
	</div>
</Modal>
