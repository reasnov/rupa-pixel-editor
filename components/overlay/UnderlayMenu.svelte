<script lang="ts">
	import { __ } from '../../state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import Modal from '../ui/Modal.svelte';

	const studio = editor.studio;

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				studio.underlayImage = ev.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	function resetUnderlay() {
		studio.underlayOffset = { x: 0, y: 0 };
		studio.underlayScale = 1.0;
	}
</script>

<Modal title={__({ key: 'OPEN_UNDERLAY_MENU' })} onClose={() => (studio.showUnderlayMenu = false)}>
	<div class="flex flex-col gap-6 p-2">
		<div class="flex flex-col gap-2">
			<label class="text-xs font-bold text-charcoal/60 uppercase" for="underlay-file"
				>Upload Reference Image</label
			>
			<input
				id="underlay-file"
				type="file"
				accept="image/*"
				class="text-xs text-charcoal/80"
				onchange={handleFileChange}
			/>
		</div>

		{#if studio.underlayImage}
			<div class="grid grid-cols-2 gap-4">
				<div class="flex flex-col gap-2">
					<span class="text-xs font-bold text-charcoal/60 uppercase">Visibility</span>
					<button
						class="editor-tool-btn justify-center"
						onclick={() => (studio.isUnderlayVisible = !studio.isUnderlayVisible)}
					>
						{studio.isUnderlayVisible ? 'Hide Underlay' : 'Show Underlay'}
					</button>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-xs font-bold text-charcoal/60 uppercase" for="underlay-opacity"
						>Vapor Opacity ({Math.round(studio.underlayOpacity * 100)}%)</label
					>
					<input
						id="underlay-opacity"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={studio.underlayOpacity}
						class="accent-brand"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<span class="text-xs font-bold text-charcoal/60 uppercase">Manual Positioning</span>
				<div class="flex items-center gap-4">
					<button class="editor-tool-btn text-xs" onclick={resetUnderlay}> Reset View </button>
					<span class="text-[10px] text-charcoal/40 italic">
						Use Ctrl + Alt + Arrows to nudge on canvas.
					</span>
				</div>
			</div>

			<div class="border-t border-charcoal/5 pt-4">
				<button
					class="w-full text-xs text-red-500 hover:underline"
					onclick={() => (studio.underlayImage = null)}
				>
					Clear Reference Image
				</button>
			</div>
		{/if}
	</div>
</Modal>
