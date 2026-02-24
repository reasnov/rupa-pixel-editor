<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import Tooltip from '../../elements/Tooltip.svelte';
</script>

<Tooltip text="timeline:audio_status.title">
	<div class="flex items-center gap-1.5">
		<span
			class="text-[9px] {editor.usageMinutes >= 30 ? 'animate-pulse' : 'opacity-40 grayscale'}"
			aria-hidden="true">🎐</span
		>
		<span
			class="font-serif text-[8px] font-black tracking-widest text-text-main/50 uppercase italic"
		>
			{#if editor.usageMinutes < 30}
				{__('timeline:audio_status.silent')}
			{:else if editor.usageMinutes < 60}
				{__('timeline:audio_status.brewing')}
			{:else}
				{__('timeline:audio_status.resonant')}
			{/if}
		</span>
	</div>
</Tooltip>
