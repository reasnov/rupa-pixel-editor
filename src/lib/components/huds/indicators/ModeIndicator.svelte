<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { mode } from '../../../engine/mode.svelte.js';
	import Badge from '../../elements/Badge.svelte';
</script>

<div class="flex items-center gap-2">
	<span class="font-serif text-[8px] font-black tracking-widest text-text-main/50 uppercase italic"
		>{__('timeline:mode')}:</span
	>
	<Badge variant="primary" size="sm">
		{mode.current.label}
	</Badge>
</div>
