<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';

	interface RulerMark {
		index: number;
		isMajor: boolean;
		label?: string;
		isFuture: boolean;
	}

	interface Props {
		rulerMarks: RulerMark[];
		maxRulerWidth: number;
		currentFrameWidth: number;
		scrollLeft: number;
		onScrub: (e: MouseEvent) => void;
	}

	let { rulerMarks, maxRulerWidth, currentFrameWidth, scrollLeft, onScrub }: Props = $props();
</script>

<div class="flex h-6 shrink-0 border-b border-text-main/5 bg-canvas-bg/95">
	<div
		class="z-40 flex w-32 shrink-0 items-center border-r border-text-main/10 bg-canvas-bg px-2 font-serif text-[8px] font-black tracking-widest text-text-main/30 uppercase"
	>
		{__('workspace:hud.project_panel.layers')}
	</div>
	<div class="relative flex-1 overflow-hidden" onclick={onScrub} role="presentation">
		<div
			class="absolute inset-0 flex items-center"
			style="width: {maxRulerWidth}px; min-width: 100%; transform: translateX(-{scrollLeft}px);"
		>
			{#each rulerMarks as mark}
				<div
					class="absolute flex flex-col items-center transition-opacity duration-300 {mark.isFuture
						? 'opacity-20'
						: 'opacity-100'}"
					style="left: {mark.index * currentFrameWidth}px; width: {currentFrameWidth}px;"
				>
					<div class="w-px bg-text-main/20 {mark.isMajor ? 'h-2' : 'h-1'}"></div>
					{#if mark.label}
						<span
							class="font-mono text-[7px] font-black {mark.isMajor && !mark.isFuture
								? 'text-ui-accent'
								: 'text-text-main/40'} mt-0.5 leading-none">{mark.label}</span
						>
					{:else if mark.index % 5 === 0}
						<span class="mt-0.5 font-mono text-[7px] leading-none font-bold text-text-main/20"
							>{mark.index + 1}</span
						>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
