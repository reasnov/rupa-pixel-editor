<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { ColorLogic } from '../../logic/color.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import PalettePresetItem from './PalettePresetItem.svelte';

	let { onClose = () => (editor.studio.showPaletteLibrary = false) } = $props<{
		onClose?: () => void;
	}>();

	let newPresetName = $state('');
	let fileInput: HTMLInputElement | undefined = $state();

	function handleSave() {
		if (!newPresetName.trim()) return;
		editor.paletteState.savePreset(newPresetName.trim());
		newPresetName = '';
		services.persistence.backup();
		services.persistence.saveGlobalPalettes();
	}

	function handleApply(id: string) {
		editor.paletteState.applyPreset(id);
		editor.studio.show(__('tools:palette_library.applied_toast'));
	}

	function handleDelete(id: string) {
		editor.paletteState.deletePreset(id);
		services.persistence.backup();
		services.persistence.saveGlobalPalettes();
	}

	function handleNewRecipe() {
		editor.paletteState.newPalette();
		editor.studio.show(__('tools:palette_library.new_toast'));
	}

	function triggerImport() {
		fileInput?.click();
	}

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const text = await file.text();
		if (editor.paletteState.importPalette(text)) {
			editor.studio.show(
				__('tools:palette_library.import_success_toast', { replace: { name: file.name } })
			);
		} else {
			editor.studio.show(__('tools:palette_library.import_error_toast'));
		}
		// Reset input
		(e.target as HTMLInputElement).value = '';
	}

	function handleExport(id: string) {
		const preset = editor.paletteState.presets.find((p) => p.id === id);
		if (!preset) return;

		const gplContent = ColorLogic.toGPL(preset.name, preset.colors);
		const blob = new Blob([gplContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${preset.name.toLowerCase().replace(/\s+/g, '-')}.gpl`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<input
	type="file"
	accept=".gpl,.txt"
	class="hidden"
	bind:this={fileInput}
	onchange={handleFileChange}
/>

<Dialog
	title="tools:palette_library.title"
	subtitle="tools:palette_library.subtitle"
	isOpen={true}
	{onClose}
	width="600px"
>
	<div class="flex flex-col gap-8">
		<!-- Actions: New & Import -->
		<div class="flex items-center gap-3">
			<button
				class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-text-main/10 bg-text-main/[0.05] py-4 transition-all hover:border-ui-accent/40 hover:bg-ui-highlight/20"
				onclick={handleNewRecipe}
				aria-label={__('tools:palette_library.new_set')}
			>
				<span class="text-lg">🏺</span>
				<div class="flex flex-col items-start">
					<span class="font-serif text-[10px] font-bold tracking-widest text-text-main/60 uppercase"
						>{__('tools:palette_library.new_set')}</span
					>
					<span class="font-serif text-[8px] text-text-main/30 italic"
						>{__('tools:palette_library.new_set_desc')}</span
					>
				</div>
			</button>

			<button
				class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-text-main/10 bg-text-main/[0.05] py-4 transition-all hover:border-ui-accent/40 hover:bg-ui-highlight/20"
				onclick={triggerImport}
				aria-label={__('tools:palette_library.import')}
			>
				<span class="text-lg">📦</span>
				<div class="flex flex-col items-start">
					<span class="font-serif text-[10px] font-bold tracking-widest text-text-main/60 uppercase"
						>{__('tools:palette_library.import')}</span
					>
					<span class="font-serif text-[8px] text-text-main/30 italic"
						>{__('tools:palette_library.import_desc')}</span
					>
				</div>
			</button>
		</div>

		<!-- Save Current Palette -->
		<div class="flex flex-col gap-3 rounded-xl border border-ui-accent/10 bg-ui-accent/5 p-6">
			<div class="flex flex-col gap-1">
				<span class="font-serif text-[10px] font-bold tracking-widest text-ui-accent uppercase"
					>{__('tools:palette_library.save_label')}</span
				>
				<span class="font-serif text-[9px] text-ui-accent/60 italic"
					>{__('tools:palette_library.save_desc')}</span
				>
			</div>
			<div class="flex items-end gap-2">
				<Input
					bind:value={newPresetName}
					placeholder="tools:palette_library.name_placeholder"
					ariaLabel="tools:palette_library.save_label"
					class="flex-1"
					onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleSave()}
				/>
				<Button
					variant="primary"
					onclick={handleSave}
					disabled={!newPresetName.trim()}
					ariaLabel="tools:palette_library.button.save"
					class="py-2.5"
				>
					{__('tools:palette_library.button.save')}
				</Button>
			</div>
		</div>

		<!-- Presets List -->
		<div class="flex flex-col gap-4">
			<span class="font-serif text-[10px] font-bold tracking-widest text-text-main/30 uppercase"
				>{__('tools:palette_library.list_title')}</span
			>

			<div class="flex flex-col gap-2">
				{#each editor.paletteState.presets as preset (preset.id)}
					<PalettePresetItem
						{preset}
						onApply={handleApply}
						onExport={handleExport}
						onDelete={handleDelete}
					/>
				{/each}
			</div>
		</div>
	</div>
</Dialog>
