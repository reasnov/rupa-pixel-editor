<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { fade } from 'svelte/transition';
	import Slider from '../../elements/Slider.svelte';
	import Toggle from '../../elements/Toggle.svelte';

	let { target } = $props<{
		target: any;
	}>();

	let isLayer = $derived('isLinked' in target);
	let isFrame = $derived('duration' in target);
</script>

<div
	transition:fade={{ duration: 100 }}
	class="mr-2 mb-2 flex flex-col gap-4 rounded-xl border border-text-main/5 bg-white/40 p-4 pt-2 shadow-sm backdrop-blur-sm"
>
	<!-- Common: Opacity (Density) -->
	<Slider
		label="workspace:project_panel.opacity"
		min={0}
		max={1}
		step={0.01}
		bind:value={target.opacity}
		ariaLabel="workspace:project_panel.opacity"
	/>

	<!-- Layer Specific -->
	{#if isLayer}
		<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

		<!-- Synchronized Toggle -->
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="font-serif text-[10px] font-bold tracking-widest text-text-main/40 uppercase"
					>{__('workspace:hud.sync_label')}</span
				>
				<span class="font-serif text-[8px] text-text-main/30 italic"
					>{__('workspace:hud.sync_desc')}</span
				>
			</div>
			<Toggle bind:checked={target.isLinked} ariaLabel="workspace:hud.sync_label" />
		</div>

		<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

		<!-- Wiggle (The Mist) -->
		<Slider
			label="export:wiggle_modifier"
			min={0}
			max={5}
			step={0.5}
			bind:value={target.wiggleAmount}
			ariaLabel="export:wiggle_modifier"
		/>

		<!-- Sway (The Flow) -->
		<Slider
			label="export:sway_modifier"
			min={0}
			max={20}
			step={1}
			bind:value={target.swayAmount}
			ariaLabel="export:sway_modifier"
		/>
	{/if}

	<!-- Frame Specific -->
	{#if isFrame}
		<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>
		<div class="flex flex-col gap-1 rounded-lg bg-ui-accent/5 p-2 ring-1 ring-ui-accent/10">
			<span class="font-serif text-[10px] font-bold tracking-widest text-ui-accent uppercase"
				>{__('workspace:hud.master_pace_label')}</span
			>
			<span class="font-serif text-[8px] leading-tight text-ui-accent/60 italic"
				>{__('workspace:hud.master_pace_desc')}</span
			>
		</div>
	{/if}
</div>
