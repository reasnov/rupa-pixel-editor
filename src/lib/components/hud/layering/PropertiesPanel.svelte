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
	class="mr-2 mb-2 flex flex-col gap-4 rounded-xl border border-evergreen/5 bg-white/40 p-4 pt-2 shadow-sm backdrop-blur-sm"
>
	<!-- Common: Opacity (Density) -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase"
				>Opacity</span
			>
			<div class="flex items-center gap-1">
				<input
					type="number"
					min="0"
					max="100"
					value={Math.round(target.opacity * 100)}
					oninput={(e) =>
						(target.opacity = Math.max(0, Math.min(100, Number(e.currentTarget.value))) / 100)}
					class="editor-input-number w-10"
				/>
				<span class="font-tiny5 text-[8px] text-evergreen/30">%</span>
			</div>
		</div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={target.opacity}
			class="editor-slider"
		/>
	</div>

	<!-- Layer Specific -->
	{#if isLayer}
		<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

		<!-- Synchronized Toggle -->
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase"
					>Synchronized</span
				>
				<span class="font-serif text-[8px] text-evergreen/30 italic">Sync across all servings</span>
			</div>
			<button
				onclick={() => (target.isLinked = !target.isLinked)}
				class="flex h-4 w-8 items-center rounded-full transition-colors {target.isLinked
					? 'bg-lantern-gold'
					: 'bg-evergreen/10'}"
				aria-label="Toggle Synchronization"
			>
				<div
					class="h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform {target.isLinked
						? 'translate-x-4.5'
						: 'translate-x-1'}"
				></div>
			</button>
		</div>

		<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

		<!-- Wiggle (The Mist) -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase">
					{__('common:export.wiggle_modifier')}
				</span>
				<div class="flex items-center gap-1">
					<span class="font-tiny5 text-[9px] font-bold text-lantern-gold"
						>{target.wiggleAmount}</span
					>
					<span class="font-tiny5 text-[8px] text-evergreen/30 uppercase">px</span>
				</div>
			</div>
			<input
				type="range"
				min="0"
				max="5"
				step="0.5"
				bind:value={target.wiggleAmount}
				class="editor-slider"
			/>
		</div>

		<!-- Sway (The Flow) -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase">
					{__('common:export.sway_modifier')}
				</span>
				<div class="flex items-center gap-1">
					<span class="font-tiny5 text-[9px] font-bold text-lantern-gold">{target.swayAmount}</span>
					<span class="font-tiny5 text-[8px] text-evergreen/30 uppercase">px</span>
				</div>
			</div>
			<input
				type="range"
				min="0"
				max="20"
				step="1"
				bind:value={target.swayAmount}
				class="editor-slider"
			/>
		</div>
	{/if}

	<!-- Frame Specific -->
	{#if isFrame}
		<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>
		<div class="flex flex-col gap-1 rounded-lg bg-lantern-gold/5 p-2 ring-1 ring-lantern-gold/10">
			<span class="font-serif text-[10px] font-bold tracking-widest text-lantern-gold uppercase"
				>Master Pace</span
			>
			<span class="font-serif text-[8px] leading-tight text-lantern-gold/60 italic"
				>This serving follows the project's global rhythm (FPS).</span
			>
		</div>
	{/if}
</div>
