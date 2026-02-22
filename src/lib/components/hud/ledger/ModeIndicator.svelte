<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { mode } from '../../../engine/mode.svelte.js';
</script>

<div class="flex items-center gap-2">
	<span class="font-serif text-[8px] font-black tracking-widest text-evergreen/50 uppercase italic"
		>{__('common:timeline.mode')}:</span
	>
	<span class="font-mono text-[9px] font-bold text-evergreen uppercase">
		{mode.current.type}
	</span>
</div>
