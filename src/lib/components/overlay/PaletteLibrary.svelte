<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { ColorLogic } from '../../logic/color.js';
	import Modal from '../ui/Modal.svelte';
	import { fade, slide } from 'svelte/transition';

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
		editor.studio.show('Flavor Swatch Applied');
	}

	function handleDelete(id: string) {
		editor.paletteState.deletePreset(id);
		services.persistence.backup();
		services.persistence.saveGlobalPalettes();
	}

	function handleNewRecipe() {
		editor.paletteState.newPalette();
		editor.studio.show('Empty Cup Ready for New Flavors');
	}

	function triggerImport() {
		fileInput?.click();
	}

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const text = await file.text();
		if (editor.paletteState.importPalette(text)) {
			editor.studio.show(`Imported ${file.name}`);
		} else {
			editor.studio.show('Invalid Ingredients (File Format Error)');
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

<Modal
	title={__('common:palette_library.title')}
	subtitle={__('common:palette_library.subtitle')}
	icon="🎨"
	{onClose}
	width="600px"
>
	<div class="flex flex-col gap-8">
		<!-- Actions: New & Import -->
		<div class="flex items-center gap-3">
			<button
				class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-evergreen/10 bg-white/40 py-4 transition-all hover:border-lantern-gold/40 hover:bg-white"
				onclick={handleNewRecipe}
			>
				<span class="text-lg">🏺</span>
				<div class="flex flex-col items-start">
					<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
						>New Pigment Set</span
					>
					<span class="font-serif text-[8px] text-evergreen/30 italic"
						>Start from a blank washi</span
					>
				</div>
			</button>

			<button
				class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-evergreen/10 bg-white/40 py-4 transition-all hover:border-lantern-gold/40 hover:bg-white"
				onclick={triggerImport}
			>
				<span class="text-lg">📦</span>
				<div class="flex flex-col items-start">
					<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
						>Import Ingredients</span
					>
					<span class="font-serif text-[8px] text-evergreen/30 italic">Load .GPL or HEX list</span>
				</div>
			</button>
		</div>

		<!-- Save Current Palette -->
		<div class="flex flex-col gap-3 rounded-xl border border-lantern-gold/10 bg-lantern-gold/5 p-6">
			<div class="flex flex-col gap-1">
				<span class="font-serif text-[10px] font-bold tracking-widest text-lantern-gold uppercase"
					>{__('common:palette_library.save_label')}</span
				>
				<span class="font-serif text-[9px] text-lantern-gold/60 italic"
					>{__('common:palette_library.save_desc')}</span
				>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={newPresetName}
					placeholder={__('common:palette_library.name_placeholder')}
					class="flex-1 rounded-lg border border-lantern-gold/20 bg-white px-4 py-2 font-serif text-sm focus:border-lantern-gold focus:outline-none"
					onkeydown={(e) => e.key === 'Enter' && handleSave()}
				/>
				<button
					class="editor-primary-btn px-6 py-2 text-xs"
					onclick={handleSave}
					disabled={!newPresetName.trim()}
				>
					{__('common:palette_library.button.save')}
				</button>
			</div>
		</div>

		<!-- Presets List -->
		<div class="flex flex-col gap-4">
			<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/30 uppercase"
				>{__('common:palette_library.list_title')}</span
			>

			<div class="flex flex-col gap-2">
				{#each editor.paletteState.presets as preset (preset.id)}
					<div
						transition:slide={{ duration: 200 }}
						class="group flex items-center justify-between rounded-xl border border-evergreen/5 bg-white/40 p-4 transition-all hover:bg-white/80"
					>
						<div class="flex flex-col gap-2 overflow-hidden">
							<div class="flex items-center gap-3">
								<span class="font-serif text-sm font-bold text-evergreen">{preset.name}</span>
								{#if preset.isDefault}
									<span
										class="rounded-full bg-evergreen/5 px-2 py-0.5 font-mono text-[8px] text-evergreen/40 uppercase"
										>Default</span
									>
								{/if}
							</div>
							<!-- Color Strip -->
							<div class="flex flex-wrap gap-1">
								{#each preset.colors.slice(0, 12) as color}
									<div
										class="h-3 w-3 rounded-sm shadow-inner"
										style="background-color: {color};"
									></div>
								{/each}
								{#if preset.colors.length > 12}
									<span class="font-mono text-[8px] opacity-20">+{preset.colors.length - 12}</span>
								{/if}
							</div>
						</div>

						<div
							class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<button
								class="rounded-lg border border-lantern-gold/20 bg-lantern-gold/5 px-4 py-1.5 font-serif text-[10px] font-bold text-lantern-gold uppercase transition-all hover:bg-lantern-gold hover:text-white"
								onclick={() => handleApply(preset.id)}
							>
								{__('common:palette_library.button.apply')}
							</button>

							<button
								class="flex h-8 w-8 items-center justify-center rounded-lg border border-evergreen/10 bg-bamboo-shoot/20 text-[10px] transition-all hover:border-lantern-gold hover:bg-lantern-gold hover:text-white"
								onclick={() => handleExport(preset.id)}
								title="Export Recipe (.gpl)"
							>
								📥
							</button>

							{#if !preset.isDefault}
								<button
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-evergreen/10 bg-bamboo-shoot/20 text-[10px] transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
									onclick={() => handleDelete(preset.id)}
									title={__('common:palette_library.button.delete')}
								>
									🗑️
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</Modal>
