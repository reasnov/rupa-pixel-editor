<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { fade } from 'svelte/transition';

	let { target } = $props<{
		target: any;
	}>();

	let isLayer = $derived('isLinked' in target);
	let isFrame = $derived('duration' in target);
</script>

<div
	transition:fade={{ duration: 100 }}
	class="mr-2 mb-2 flex flex-col gap-3 rounded-b-lg border-x border-b border-charcoal/5 bg-charcoal/[0.02] p-3 pt-1"
>
	<!-- Common: Opacity -->
	<div class="flex items-center justify-between gap-4">
		<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Density</span>
		<div class="flex flex-1 items-center gap-2">
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={target.opacity}
				class="editor-slider h-1 flex-1"
			/>
			<input
				type="number"
				min="0"
				max="100"
				value={Math.round(target.opacity * 100)}
				oninput={(e) =>
					(target.opacity = Math.max(0, Math.min(100, Number(e.currentTarget.value))) / 100)}
				class="w-10 rounded border border-charcoal/10 bg-white p-0.5 text-center font-mono text-[10px]"
			/>
			<span class="font-mono text-[8px] opacity-30">%</span>
		</div>
	</div>

	<!-- Layer Specific: Steeped Toggle -->
	{#if isLayer}
		<div class="h-px w-full bg-black/5" aria-hidden="true"></div>
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Steeped</span>
				<span class="font-serif text-[8px] text-charcoal/30">Sync across all cups</span>
			</div>
			<button
				onclick={() => (target.isLinked = !target.isLinked)}
				class="flex h-4 w-8 items-center rounded-full transition-colors {target.isLinked
					? 'bg-brand'
					: 'bg-charcoal/10'}"
				aria-label="Toggle Steeped (Sync across all cups)"
			>
				<div
					class="h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform {target.isLinked
						? 'translate-x-4.5'
						: 'translate-x-1'}"
				></div>
			</button>
		</div>

		<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

		<!-- Wiggle -->
		<div class="flex items-center justify-between gap-4">
			<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">
				{__({ key: 'export.wiggle_modifier' })}
			</span>
			<div class="flex flex-1 items-center gap-2">
				<input
					type="range"
					min="0"
					max="5"
					step="0.5"
					bind:value={target.wiggleAmount}
					class="editor-slider h-1 flex-1"
				/>
				<span class="font-mono text-[8px] opacity-30">{target.wiggleAmount}px</span>
			</div>
		</div>

		<!-- Sway -->
		<div class="flex items-center justify-between gap-4">
			<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">
				{__({ key: 'export.sway_modifier' })}
			</span>
			<div class="flex flex-1 items-center gap-2">
				<input
					type="range"
					min="0"
					max="20"
					step="1"
					bind:value={target.swayAmount}
					class="editor-slider h-1 flex-1"
				/>
				<span class="font-mono text-[8px] opacity-30">{target.swayAmount}px</span>
			</div>
		</div>
	{/if}

	<!-- Frame Specific: Duration -->
	{#if isFrame}
		<div class="h-px w-full bg-black/5" aria-hidden="true"></div>
		<div class="flex items-center justify-between gap-4">
			<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Shift</span>
			<div class="flex flex-1 items-center gap-2">
				<input
					type="range"
					min="10"
					max="2000"
					step="10"
					bind:value={target.duration}
					class="editor-slider h-1 flex-1"
				/>
				<input
					type="number"
					min="10"
					max="5000"
					bind:value={target.duration}
					class="w-12 rounded border border-charcoal/10 bg-white p-0.5 text-center font-mono text-[10px]"
				/>
				<span class="font-mono text-[8px] opacity-30">ms</span>
			</div>
		</div>
	{/if}
</div>
