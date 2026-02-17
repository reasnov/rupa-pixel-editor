<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';
	import { SpinnerEngine } from '../../engine/spinner.js';
	import ColorSlider from './ColorSlider.svelte';

	let { value = $bindable(), onClose } = $props<{ value: string; onClose: () => void }>();

	// HSLA State
	let h = $state(0);
	let s = $state(0);
	let l = $state(0);
	let a = $state(1); // 0.0 to 1.0

	$effect(() => {
		const color = SpinnerEngine.unravel(value);
		untrack(() => {
			h = color.h;
			s = color.s;
			l = color.l;
			a = color.a;
		});
	});

	$effect(() => {
		const newColor = SpinnerEngine.spin({ h, s, l, a });
		untrack(() => {
			value = newColor;
		});
	});
</script>

<div
	transition:fade={{ duration: 150 }}
	class="fixed inset-0 z-[1300] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
	role="presentation"
>
	<div
		in:scale={{ duration: 200, start: 0.95 }}
		out:scale={{ duration: 150, start: 1, opacity: 0 }}
		class="flex w-[400px] flex-col gap-8 rounded-xl border-8 border-white bg-canvas-bg p-10 shadow-2xl"
		role="dialog"
		aria-labelledby="flavor-basin-title"
		aria-modal="true"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-3xl" aria-hidden="true">⛲</span>
				<div class="flex flex-col">
					<h2 id="flavor-basin-title" class="font-tiny5 text-3xl leading-none text-brand">
						{__({ key: 'color_picker.title' })}
					</h2>
					<span
						class="mt-1 font-serif text-[10px] font-bold tracking-[0.2em] text-studio-text/40 uppercase"
					>
						{__({ key: 'color_picker.subtitle' })}
					</span>
				</div>
			</div>
			<div
				class="editor-checker-small h-12 w-12 rounded-xl border-2 border-white shadow-inner"
				style="background-color: {value};"
				aria-label="Color Preview"
			></div>
		</div>

		<div class="flex flex-col gap-6">
			<ColorSlider
				label={__({ key: 'color_picker.sliders.hue' })}
				bind:value={h}
				max={360}
				unit="°"
				isHue={true}
			/>
			<ColorSlider
				label={__({ key: 'color_picker.sliders.saturation' })}
				bind:value={s}
				max={100}
				unit="%"
			/>
			<ColorSlider
				label={__({ key: 'color_picker.sliders.lightness' })}
				bind:value={l}
				max={100}
				unit="%"
			/>
			<ColorSlider
				label={__({ key: 'color_picker.sliders.alpha' })}
				bind:value={a}
				min={0}
				max={1}
				step={0.01}
				unit=""
			/>
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 rounded-xl border border-black/5 bg-white/50 p-4">
				<label for="hex-input" class="font-mono text-xs font-bold text-studio-text/40">
					{__({ key: 'color_picker.hex_label' })}
				</label>
				<input
					id="hex-input"
					type="text"
					bind:value
					class="w-full bg-transparent font-mono text-lg font-bold text-studio-text uppercase focus:outline-none"
				/>
			</div>
			<div class="flex gap-3">
				<button
					class="editor-secondary-btn flex h-14 w-14 items-center justify-center p-0 text-xl"
					onclick={() => {
						shuttle.pickColor();
						onClose();
					}}
					title={__({ key: 'color_picker.eye_drop' })}
					aria-label={__({ key: 'color_picker.eye_drop' })}
				>
					<span aria-hidden="true">💉</span>
				</button>
				<button class="editor-primary-btn flex-1 py-4" onclick={onClose}>
					{__({ key: 'color_picker.seal' })}
				</button>
			</div>
		</div>
	</div>
</div>
