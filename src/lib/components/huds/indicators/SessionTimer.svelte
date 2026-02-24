<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte';
</script>

<div class="flex items-center gap-1.5" title={__('timeline:duration')}>
	<span class="text-[9px] opacity-40" aria-hidden="true">⏳</span>
	<span class="font-mono text-[9px] font-bold text-text-main/80 tabular-nums">
		{editor.studio.sessionTimeLabel}
	</span>
</div>
