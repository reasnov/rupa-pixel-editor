<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import Modal from '../ui/Modal.svelte';
	import DyeBasin from './DyeBasin.svelte';

	let { onClose = () => (atelier.studio.showLinenSettings = false) } = $props<{
		onClose: () => void;
	}>();

	let width = $state(atelier.linen.width);
	let height = $state(atelier.linen.height);
	let showPicker = $state(false);

	function apply() {
		shuttle.manipulation.resize(width, height);
		onClose();
	}
</script>

{#if showPicker}
	<DyeBasin bind:value={atelier.studio.canvasBgColor} onClose={() => (showPicker = false)} />
{/if}

<Modal
	title="Linen Settings"
	subtitle="Configure the Weaver's Frame"
	icon="📐"
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-6 rounded-xl border border-black/5 bg-white/40 p-8">
			<!-- Project Name -->
			<div class="flex flex-col gap-2">
				<label
					for="project-name"
					class="font-serif text-[10px] font-bold tracking-widest uppercase opacity-40"
					>Project Name</label
				>
				<input
					id="project-name"
					type="text"
					bind:value={atelier.project.name}
					placeholder="Unnamed Pattern"
					class="rounded-xl border border-black/10 bg-white px-4 py-3 font-serif text-lg focus:border-brand focus:outline-none"
				/>
			</div>

			<div class="h-px w-full bg-black/5"></div>

			<div class="grid grid-cols-2 gap-8">
				<div class="flex flex-col gap-2">
					<label
						for="width"
						class="font-serif text-[10px] font-bold tracking-widest uppercase opacity-40"
						>Width</label
					>
					<input
						id="width"
						type="number"
						bind:value={width}
						min="4"
						max="128"
						class="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl focus:border-brand focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="height"
						class="font-serif text-[10px] font-bold tracking-widest uppercase opacity-40"
						>Height</label
					>
					<input
						id="height"
						type="number"
						bind:value={height}
						min="4"
						max="128"
						class="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl focus:border-brand focus:outline-none"
					/>
				</div>
			</div>

			<div class="h-px w-full bg-black/5"></div>

			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-serif text-sm font-bold tracking-tight uppercase opacity-60"
						>Linen Backdrop</span
					>
					<span class="font-serif text-[10px] opacity-40">Visual background color</span>
				</div>
				<button class="group relative flex items-center gap-3" onclick={() => (showPicker = true)}>
					<div
						class="artisan-checker-small h-10 w-16 rounded-xl border-2 border-white shadow-sm transition-transform group-hover:scale-105"
						style="background-color: {atelier.studio.canvasBgColor};"
					></div>
					<div
						class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						🎨
					</div>
				</button>
			</div>

			<p class="font-serif text-[10px] leading-relaxed italic opacity-40">
				Note: Resizing will center your current work on the new frame. Large dimensions may affect
				performance in certain environments.
			</p>
		</div>

		<button class="artisan-primary-btn w-full py-4 text-lg" onclick={apply}>
			Re-stretch Linen
		</button>
	</div>
</Modal>
