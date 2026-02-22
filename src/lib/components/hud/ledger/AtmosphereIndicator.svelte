<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte';
</script>

<div class="flex items-center gap-1.5" title={__('common:timeline.audio_status.title')}>
	<span
		class="text-[9px] {editor.usageMinutes >= 30 ? 'animate-pulse' : 'opacity-40 grayscale'}"
		aria-hidden="true">🎐</span
	>
	<span class="font-serif text-[8px] font-black tracking-widest text-evergreen/50 uppercase italic">
		{#if editor.usageMinutes < 30}
			{__('common:timeline.audio_status.silent')}
		{:else if editor.usageMinutes < 60}
			{__('common:timeline.audio_status.brewing')}
		{:else}
			{__('common:timeline.audio_status.resonant')}
		{/if}
	</span>
</div>
