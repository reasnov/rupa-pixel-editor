<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Slider from '../elements/Slider.svelte';
	import Toggle from '../elements/Toggle.svelte';

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

<Dialog
	title="actions:open_underlay_menu"
	isOpen={true}
	onClose={() => (studio.showUnderlayMenu = false)}
>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<label class="text-xs font-bold text-text-main/60 uppercase" for="underlay-file"
				>{__('workspace:underlay.upload_label')}</label
			>
			<input
				id="underlay-file"
				type="file"
				accept="image/*"
				class="text-xs text-text-main/80"
				onchange={handleFileChange}
			/>
		</div>

		{#if studio.underlayImage}
			<div class="grid grid-cols-2 items-start gap-8">
				<div class="flex flex-col gap-2">
					<span class="text-xs font-bold text-text-main/60 uppercase"
						>{__('workspace:underlay.visibility')}</span
					>
					<Toggle
						bind:checked={studio.isUnderlayVisible}
						label={studio.isUnderlayVisible ? 'ui:labels.on' : 'ui:labels.off'}
						ariaLabel="workspace:underlay.visibility"
					/>
				</div>

				<Slider
					label="workspace:project_panel.opacity"
					min={0}
					max={1}
					step={0.05}
					bind:value={studio.underlayOpacity}
					ariaLabel="workspace:project_panel.opacity"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<span class="text-xs font-bold text-text-main/60 uppercase"
					>{__('workspace:underlay.positioning')}</span
				>
				<div class="flex items-center gap-4">
					<Button
						variant="secondary"
						size="sm"
						onclick={resetUnderlay}
						ariaLabel="actions:reset_viewport"
					>
						{__('actions:reset_viewport')}
					</Button>
					<span class="text-[10px] text-text-main/40 italic">
						Use Ctrl + Alt + Arrows to nudge on canvas.
					</span>
				</div>
			</div>

			<div class="border-t border-text-main/5 pt-4">
				<Button
					variant="ghost"
					class="w-full text-xs text-red-500 hover:underline"
					onclick={() => (studio.underlayImage = null)}
					ariaLabel="actions:delete"
				>
					Clear Reference Image
				</Button>
			</div>
		{/if}
	</div>
</Dialog>
