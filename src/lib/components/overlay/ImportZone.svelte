<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Modal from '../ui/Modal.svelte';

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

<Modal
	title={__('export:propagation.title')}
	subtitle={__('export:propagation.subtitle')}
	icon="🌀"
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-8 p-2">
		<!-- Servings Count -->
		<div class="flex items-center justify-between">
			<div class="flex flex-col gap-1">
				<label
					for="cups-input"
					class="font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase"
				>
					{__('export:propagation.frames_label')}
				</label>
				<span class="font-serif text-[10px] text-evergreen/40">
					{__('export:propagation.frames_desc')}
				</span>
			</div>
			<input
				id="cups-input"
				type="number"
				bind:value={cups}
				min="1"
				max={editor.project.frames.length - editor.project.activeFrameIndex - 1}
				class="w-20 rounded-xl border border-evergreen/10 bg-white px-4 py-2 font-mono text-lg text-evergreen focus:outline-none"
			/>
		</div>

		<!-- Offset Controls -->
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<span class="font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase">
					{__('export:propagation.offset_label')}
				</span>
				<span class="font-serif text-[10px] text-evergreen/40">
					{__('export:propagation.offset_desc')}
				</span>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="flex items-center gap-3 rounded-xl border border-evergreen/5 bg-white/40 p-3">
					<span class="font-mono text-[10px] font-bold text-evergreen/30">X</span>
					<input
						type="number"
						bind:value={dx}
						class="w-full bg-transparent font-mono text-sm font-bold text-evergreen focus:outline-none"
					/>
				</div>
				<div class="flex items-center gap-3 rounded-xl border border-evergreen/5 bg-white/40 p-3">
					<span class="font-mono text-[10px] font-bold text-evergreen/30">Y</span>
					<input
						type="number"
						bind:value={dy}
						class="w-full bg-transparent font-mono text-sm font-bold text-evergreen focus:outline-none"
					/>
				</div>
			</div>
		</div>

		<button
			class="editor-primary-btn mt-4 w-full py-4 text-lg"
			onclick={execute}
			disabled={cups <= 0}
		>
			{__('export:propagation.action')}
		</button>
	</div>
</Modal>
