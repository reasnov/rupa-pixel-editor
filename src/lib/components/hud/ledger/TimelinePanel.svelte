<script lang="ts">
	import { editor } from '../../../state/editor.svelte.js';
	import TimelineControls from './timeline/TimelineControls.svelte';
	import TimelineView from './timeline/TimelineView.svelte';
</script>

<div
	class="flex h-32 w-full flex-col gap-1 overflow-hidden bg-transparent px-4 py-2"
	role="region"
	aria-label="Timeline"
>
	<!-- Panel Header -->
	<div class="flex items-center justify-between border-b border-charcoal/5 pb-1">
		<div class="flex items-center gap-6">
			<div class="flex items-center gap-2">
				<span class="text-[10px] opacity-30" aria-hidden="true">⏳</span>
				<span class="font-tiny5 text-[9px] tracking-[0.2em] text-charcoal/40 uppercase"
					>{__({ key: 'timeline.title' })}</span
				>
			</div>

			<TimelineControls />
		</div>

		<div class="flex items-center gap-4">
			<div class="flex flex-col items-end">
				<span class="font-serif text-[7px] font-black tracking-widest text-charcoal/20 uppercase">
					{__({ key: 'timeline.track' })}
				</span>
				<span class="font-mono text-[9px] font-bold text-brand/40">
					{__({ key: 'timeline.pixel_count', replace: { count: editor.project.frames.length } })}
				</span>
			</div>
		</div>
	</div>

	<!-- Main Timeline Area -->
	<TimelineView />
</div>
