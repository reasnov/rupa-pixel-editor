<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { slide } from 'svelte/transition';
	import Button from '../elements/Button.svelte';
	import Badge from '../elements/Badge.svelte';

	interface Props {
		preset: {
			id: string;
			name: string;
			colors: string[];
			isDefault?: boolean;
		};
		onApply: (id: string) => void;
		onExport: (id: string) => void;
		onDelete: (id: string) => void;
	}

	let { preset, onApply, onExport, onDelete }: Props = $props();

	/**
	 * Formats a string to Title Case (handles spaces and underscores).
	 */
	function toTitleCase(str: string): string {
		return str
			.replace(/_/g, ' ')
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<div
	transition:slide={{ duration: 200 }}
	class="group flex items-center justify-between rounded-xl border border-text-main/5 bg-text-main/[0.05] p-4 transition-all hover:bg-ui-highlight/10"
>
	<div class="flex flex-col gap-2 overflow-hidden">
		<div class="flex items-center gap-3">
			<span class="font-serif text-sm font-bold text-text-main">{toTitleCase(preset.name)}</span>
			{#if preset.isDefault}
				<Badge variant="secondary" size="sm">{__('ui:labels.default')}</Badge>
			{/if}
		</div>
		<!-- Color Strip -->
		<div class="flex flex-wrap gap-1">
			{#each preset.colors.slice(0, 12) as color}
				<div class="h-3 w-3 rounded-sm shadow-inner" style="background-color: {color};"></div>
			{/each}
			{#if preset.colors.length > 12}
				<span class="font-mono text-[8px] opacity-20">+{preset.colors.length - 12}</span>
			{/if}
		</div>
	</div>

	<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
		<Button
			variant="primary"
			size="sm"
			onclick={() => onApply(preset.id)}
			ariaLabel="tools:palette_library.button.apply"
		>
			{__('tools:palette_library.button.apply')}
		</Button>

		<Button
			variant="secondary"
			size="sm"
			onclick={() => onExport(preset.id)}
			ariaLabel="export:button.export_recipe"
			class="h-8 w-8 !p-0"
		>
			📥
		</Button>

		{#if !preset.isDefault}
			<Button
				variant="danger"
				size="sm"
				onclick={() => onDelete(preset.id)}
				ariaLabel="tools:palette_library.button.delete"
				class="h-8 w-8 !p-0"
			>
				🗑️
			</Button>
		{/if}
	</div>
</div>
