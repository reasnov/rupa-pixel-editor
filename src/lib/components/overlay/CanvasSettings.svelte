<script lang="ts">
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
	title={__({ key: 'settings.title' })}
	subtitle={__({ key: 'settings.subtitle' })}
	icon="📐"
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8" role="form">
		<div class="flex flex-col gap-6 rounded-xl border border-black/5 bg-white/40 p-8">
			<!-- Dimensions -->
			<div class="grid grid-cols-2 gap-8">
				<div class="flex flex-col gap-2">
					<label
						for="width"
						class="font-serif text-[10px] font-bold tracking-widest text-studio-text/40 uppercase"
					>
						{__({ key: 'settings.width' })}
					</label>
					<input
						id="width"
						type="number"
						bind:value={width}
						min="4"
						max="128"
						class="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl text-studio-text focus:border-brand focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="height"
						class="font-serif text-[10px] font-bold tracking-widest text-studio-text/40 uppercase"
					>
						{__({ key: 'settings.height' })}
					</label>
					<input
						id="height"
						type="number"
						bind:value={height}
						min="4"
						max="128"
						class="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl text-studio-text focus:border-brand focus:outline-none"
					/>
				</div>
			</div>

			<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

			<!-- Stabilization -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<label
							for="stab-input"
							class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase"
						>
							{__({ key: 'settings.stabilization' })}
						</label>
						<span class="font-serif text-[10px] text-studio-text/40">
							{__({ key: 'settings.stabilization_desc' })}
						</span>
					</div>
					<span class="font-mono text-sm font-bold text-brand">{editor.studio.stabilization}%</span>
				</div>
				<input
					id="stab-input"
					type="range"
					bind:value={editor.studio.stabilization}
					min="0"
					max="100"
					class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/5 accent-brand"
				/>
			</div>

			<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

			<!-- Flow Pace (FPS) -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<label
						for="fps-input"
						class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase"
					>
						{__({ key: 'settings.weave_pace' })}
					</label>
					<span class="font-serif text-[10px] text-studio-text/40">
						{__({ key: 'settings.fps_desc' })}
					</span>
				</div>
				<input
					id="fps-input"
					type="number"
					bind:value={editor.studio.fps}
					min="1"
					max="60"
					class="w-20 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg text-studio-text focus:border-brand focus:outline-none"
				/>
			</div>

			<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

			<!-- Backdrop -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase">
						{__({ key: 'settings.backdrop' })}
					</span>
					<span class="font-serif text-[10px] text-studio-text/40">
						{__({ key: 'settings.backdrop_desc' })}
					</span>
				</div>
				<button
					class="group relative flex items-center gap-3"
					onclick={() => (showPicker = true)}
					aria-label="Change Backdrop Color"
				>
					<div
						class="editor-checker-small h-10 w-16 rounded-xl border-2 border-white shadow-sm transition-transform group-hover:scale-105"
						style="background-color: {editor.backgroundColor};"
					></div>
					<div
						class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						🎨
					</div>
				</button>
			</div>

			<p class="font-serif text-[10px] leading-relaxed text-studio-text/40 italic">
				{__({ key: 'settings.note' })}
			</p>
		</div>

		<button class="editor-primary-btn w-full py-4 text-lg" onclick={apply}>
			{__({ key: 'settings.apply' })}
		</button>
	</div>
</Modal>
