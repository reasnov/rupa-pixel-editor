<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Modal from '../ui/Modal.svelte';
	import { fade, slide } from 'svelte/transition';

	let { onClose = () => (editor.studio.showPaletteLibrary = false) } = $props<{
		onClose?: () => void;
	}>();

	let newPresetName = $state('');

	function handleSave() {
		if (!newPresetName.trim()) return;
		editor.paletteState.savePreset(newPresetName.trim());
		newPresetName = '';
		services.persistence.backup(); // Save to current session
		services.persistence.saveGlobalPalettes(); // Save to global library
	}

	function handleApply(id: string) {
		editor.paletteState.applyPreset(id);
		editor.studio.show('Flavor Swatched Applied');
	}

	function handleDelete(id: string) {
		editor.paletteState.deletePreset(id);
		services.persistence.backup();
		services.persistence.saveGlobalPalettes();
	}
</script>

<Modal
	title={__({ key: 'palette_library.title' })}
	subtitle={__({ key: 'palette_library.subtitle' })}
	icon="🎨"
	{onClose}
	width="600px"
>
	<div class="flex flex-col gap-8">
		<!-- Save Current Palette -->
		<div class="flex flex-col gap-3 rounded-xl border border-brand/10 bg-brand/5 p-6">
			<div class="flex flex-col gap-1">
				<span class="font-serif text-[10px] font-bold tracking-widest text-brand uppercase"
					>{__({ key: 'palette_library.save_label' })}</span
				>
				<span class="font-serif text-[9px] text-brand/60 italic"
					>{__({ key: 'palette_library.save_desc' })}</span
				>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={newPresetName}
					placeholder={__({ key: 'palette_library.name_placeholder' })}
					class="flex-1 rounded-lg border border-brand/20 bg-white px-4 py-2 font-serif text-sm focus:border-brand focus:outline-none"
					onkeydown={(e) => e.key === 'Enter' && handleSave()}
				/>
				<button
					class="editor-primary-btn px-6 py-2 text-xs"
					onclick={handleSave}
					disabled={!newPresetName.trim()}
				>
					{__({ key: 'palette_library.button.save' })}
				</button>
			</div>
		</div>

		<!-- Presets List -->
		<div class="flex flex-col gap-4">
			<span class="font-serif text-[10px] font-bold tracking-widest text-charcoal/30 uppercase"
				>{__({ key: 'palette_library.list_title' })}</span
			>

			<div class="flex flex-col gap-2">
				{#each editor.paletteState.presets as preset (preset.id)}
					<div
						transition:slide={{ duration: 200 }}
						class="group flex items-center justify-between rounded-xl border border-black/5 bg-white/40 p-4 transition-all hover:bg-white/80"
					>
						<div class="flex flex-col gap-2 overflow-hidden">
							<div class="flex items-center gap-3">
								<span class="font-serif text-sm font-bold text-charcoal">{preset.name}</span>
								{#if preset.isDefault}
									<span
										class="rounded-full bg-charcoal/5 px-2 py-0.5 font-mono text-[8px] text-charcoal/40 uppercase"
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
								class="rounded-lg border border-brand/20 bg-brand/5 px-4 py-1.5 font-serif text-[10px] font-bold text-brand uppercase transition-all hover:bg-brand hover:text-white"
								onclick={() => handleApply(preset.id)}
							>
								{__({ key: 'palette_library.button.apply' })}
							</button>
							{#if !preset.isDefault}
								<button
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/10 bg-stone-light/50 text-[10px] transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
									onclick={() => handleDelete(preset.id)}
									title={__({ key: 'palette_library.button.delete' })}
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
