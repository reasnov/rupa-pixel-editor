<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import TimelineControls from './timeline/TimelineControls.svelte';
	import TimelineView from './timeline/TimelineView.svelte';
	import Button from '../../elements/Button.svelte';

	let heightClass = $derived.by(() => {
		if (editor.studio.isTimelineMinimized) return 'h-12';
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
	<div class="flex items-center justify-between border-b border-text-main/5 pb-1">
		<div class="flex min-w-0 flex-1 items-center gap-6">
			<div class="flex shrink-0 items-center gap-2">
				<span class="text-[10px] opacity-30" aria-hidden="true">🌀</span>
				<span class="font-tiny5 text-[9px] tracking-[0.2em] text-text-main/40 uppercase"
					>{__('timeline:title')}</span
				>
			</div>

			<TimelineControls />
		</div>

		<div class="flex items-center gap-4">
			<div class="mr-4 flex flex-col items-end">
				<span class="font-serif text-[7px] font-black tracking-widest text-text-main/20 uppercase">
					{__('timeline:track')}
				</span>
				<span class="font-mono text-[9px] font-bold text-ui-accent/40">
					{__('timeline:frame_count', { replace: { count: editor.project.frames.length } })}
				</span>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center gap-1 border-l border-text-main/10 pl-4">
				<Button
					variant="ghost"
					size="sm"
					onclick={toggleMinimize}
					ariaLabel={editor.studio.isTimelineMinimized ? 'ui:labels.confirm' : 'ui:labels.minimize'}
					class="h-5 w-5 !p-0"
				>
					<span class="text-[10px] opacity-40"
						>{editor.studio.isTimelineMinimized ? '🔼' : '🔽'}</span
					>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onclick={toggleMaximize}
					ariaLabel={editor.studio.isTimelineMaximized ? 'ui:labels.confirm' : 'ui:labels.maximize'}
					class="h-5 w-5 !p-0"
				>
					<span class="text-[10px] opacity-40"
						>{editor.studio.isTimelineMaximized ? '🗗' : '⏫'}</span
					>
				</Button>
			</div>
		</div>
	</div>

	<!-- Main Timeline Area -->
	<div
		class="flex min-h-0 flex-1 flex-col overflow-hidden {editor.studio.isTimelineMinimized
			? 'pointer-events-none opacity-0'
			: 'opacity-100'} transition-opacity duration-300"
	>
		<TimelineView />
	</div>
</div>
