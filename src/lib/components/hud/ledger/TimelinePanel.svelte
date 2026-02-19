<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import TimelineControls from './timeline/TimelineControls.svelte';
	import TimelineView from './timeline/TimelineView.svelte';

	let heightClass = $derived.by(() => {
		if (editor.studio.isTimelineMinimized) return 'h-8';
		if (editor.studio.isTimelineMaximized) return 'h-[75vh]';
		return 'h-40';
	});

	function toggleMinimize() {
		editor.studio.isTimelineMinimized = !editor.studio.isTimelineMinimized;
		if (editor.studio.isTimelineMinimized) editor.studio.isTimelineMaximized = false;
	}

	function toggleMaximize() {
		editor.studio.isTimelineMaximized = !editor.studio.isTimelineMaximized;
		if (editor.studio.isTimelineMaximized) editor.studio.isTimelineMinimized = false;
	}
</script>

<div
	class="flex {heightClass} w-full flex-col gap-1 overflow-hidden bg-transparent px-4 py-2 transition-all duration-300 ease-in-out"
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

			{#if !editor.studio.isTimelineMinimized}
				<TimelineControls />
			{/if}
		</div>

		<div class="flex items-center gap-4">
			{#if !editor.studio.isTimelineMinimized}
				<div class="flex flex-col items-end mr-4">
					<span class="font-serif text-[7px] font-black tracking-widest text-charcoal/20 uppercase">
						{__({ key: 'timeline.track' })}
					</span>
					<span class="font-mono text-[9px] font-bold text-brand/40">
						{__({ key: 'timeline.pixel_count', replace: { count: editor.project.frames.length } })}
					</span>
				</div>
			{:else}
				<span class="font-mono text-[8px] font-bold text-brand/40 mr-4">
					{editor.project.frames.length} Cups
				</span>
			{/if}

			<!-- Action Buttons -->
			<div class="flex items-center gap-1 border-l border-charcoal/10 pl-4">
				<button
					onclick={toggleMinimize}
					class="flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-black/5"
					title={editor.studio.isTimelineMinimized ? 'Restore' : 'Minimize'}
				>
					<span class="text-[10px] opacity-40">{editor.studio.isTimelineMinimized ? '🔼' : '🔽'}</span>
				</button>
				<button
					onclick={toggleMaximize}
					class="flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-black/5"
					title={editor.studio.isTimelineMaximized ? 'Restore' : 'Maximize'}
				>
					<span class="text-[10px] opacity-40">{editor.studio.isTimelineMaximized ? '🗗' : '⏫'}</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Main Timeline Area -->
	{#if !editor.studio.isTimelineMinimized}
		<TimelineView />
	{/if}
</div>
