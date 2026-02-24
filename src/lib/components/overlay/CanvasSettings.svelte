<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Modal from '../ui/Modal.svelte';
	import ColorPicker from './ColorPicker.svelte';

	let { onClose = () => (editor.showCanvasSettings = false) } = $props<{
		onClose: () => void;
	}>();

	let width = $state(editor.canvas.width);
	let height = $state(editor.canvas.height);
	let showPicker = $state(false);

	function apply() {
		services.manipulation.resize(width, height);
		onClose();
	}
</script>

{#if showPicker}
	<ColorPicker bind:value={editor.backgroundColor} onClose={() => (showPicker = false)} />
{/if}

<Modal
	title={__('common:settings.title')}
	subtitle={__('common:settings.subtitle')}
	icon="📐"
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8" role="form">
		<div class="flex flex-col gap-6 rounded-xl border border-evergreen/5 bg-white/40 p-8">
			<!-- Dimensions -->
			<div class="grid grid-cols-2 gap-8">
				<div class="flex flex-col gap-2">
					<label
						for="width"
						class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase"
					>
						{__('common:settings.width')}
					</label>
					<input
						id="width"
						type="number"
						bind:value={width}
						min="4"
						max="128"
						class="rounded-xl border border-evergreen/10 bg-white px-4 py-3 font-mono text-xl text-evergreen focus:border-lantern-gold focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="height"
						class="font-serif text-[10px] font-bold tracking-widest text-evergreen/40 uppercase"
					>
						{__('common:settings.height')}
					</label>
					<input
						id="height"
						type="number"
						bind:value={height}
						min="4"
						max="128"
						class="rounded-xl border border-evergreen/10 bg-white px-4 py-3 font-mono text-xl text-evergreen focus:border-lantern-gold focus:outline-none"
					/>
				</div>
			</div>

			<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

			<!-- Stabilization -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<label
							for="stab-input"
							class="font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase"
						>
							{__('common:settings.stabilization')}
						</label>
						<span class="font-serif text-[10px] text-evergreen/40">
							{__('common:settings.stabilization_desc')}
						</span>
					</div>
					<span class="font-mono text-sm font-bold text-lantern-gold"
						>{editor.studio.stabilization}%</span
					>
				</div>
				<input
					id="stab-input"
					type="range"
					bind:value={editor.studio.stabilization}
					min="0"
					max="100"
					class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-evergreen/5 accent-lantern-gold"
				/>
			</div>

			<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

			<!-- Flow Pace (FPS) -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<label
						for="fps-input"
						class="font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase"
					>
						{__('common:settings.fps_label')}
					</label>
					<span class="font-serif text-[10px] text-evergreen/40">
						{__('common:settings.fps_desc')}
					</span>
				</div>

				<input
					id="fps-input"
					type="number"
					bind:value={editor.project.fps}
					min="1"
					max="60"
					class="w-20 rounded-xl border border-evergreen/10 bg-white px-4 py-2 font-mono text-lg text-evergreen focus:border-lantern-gold focus:outline-none"
				/>
			</div>

			<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

			<!-- Backdrop -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase">
						{__('common:settings.background_label')}
					</span>
					<span class="font-serif text-[10px] text-evergreen/40">
						{__('common:settings.background_desc')}
					</span>
				</div>
				<button
					class="group relative flex items-center gap-3"
					onclick={() => (showPicker = true)}
					aria-label="Change Backdrop Color"
				>
					<div
						class="editor-checker-small h-10 w-16 rounded-xl border-2 border-washi-white shadow-sm transition-transform group-hover:scale-105"
						style="background-color: {editor.backgroundColor};"
					></div>
					<div
						class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lantern-gold text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						🎨
					</div>
				</button>
			</div>

			<p class="font-serif text-[10px] leading-relaxed text-evergreen/40 italic">
				{__('common:settings.note')}
			</p>
		</div>

		<button class="editor-primary-btn w-full py-4 text-lg" onclick={apply}>
			{__('common:settings.apply')}
		</button>
	</div>
</Modal>
