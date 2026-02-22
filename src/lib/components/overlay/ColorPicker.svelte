<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';
	import { ColorLogic } from '../../logic/color.js';
	import ColorSlider from './ColorSlider.svelte';

	let { value = $bindable(), onClose } = $props<{ value: string; onClose: () => void }>();

	// HSLA State
	let h = $state(0);
	let s = $state(0);
	let l = $state(0);
	let a = $state(1); // 0.0 to 1.0

	$effect(() => {
		const color = ColorLogic.toHSLA(value);
		untrack(() => {
			h = color.h;
			s = color.s;
			l = color.l;
			a = color.a;
		});
	});

	$effect(() => {
		const newColor = ColorLogic.toHex({ h, s, l, a });
		untrack(() => {
			value = newColor;
		});
	});

	$effect(() => {
		editor.pushEscapeAction(onClose);
		return () => editor.popEscapeAction(onClose);
	});
</script>

<div
	transition:fade={{ duration: 150 }}
	class="fixed inset-0 z-[1300] flex items-center justify-center bg-deep-forest/20 backdrop-blur-sm"
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
	role="presentation"
>
	<div
		in:scale={{ duration: 200, start: 0.95 }}
		out:scale={{ duration: 150, start: 1, opacity: 0 }}
		class="flex w-[400px] flex-col gap-8 rounded-xl border-8 border-washi-white bg-canvas-bg p-10 shadow-2xl"
		role="dialog"
		aria-labelledby="flavor-basin-title"
		aria-modal="true"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-3xl" aria-hidden="true"> 🏺 </span>
				<div class="flex flex-col">
					<h2 id="flavor-basin-title" class="font-tiny5 text-3xl leading-none text-lantern-gold">
						{__('common:color_picker.title')}
					</h2>
					<span
						class="mt-1 font-serif text-[10px] font-bold tracking-[0.2em] text-evergreen/40 uppercase"
					>
						{__('common:color_picker.subtitle')}
					</span>
				</div>
			</div>
			<div
				class="editor-checker-small h-12 w-12 rounded-xl border-2 border-washi-white shadow-inner"
				style="background-color: {value};"
				aria-label="Color Preview"
			></div>
		</div>

		<div class="flex flex-col gap-6">
			<ColorSlider
				label={__('common:color_picker.label.hue')}
				icon="🌈"
				bind:value={h}
				max={360}
				unit="°"
				isHue={true}
			/>
			<ColorSlider
				label={__('common:color_picker.label.saturation')}
				icon="💧"
				bind:value={s}
				max={100}
				unit="%"
			/>
			<ColorSlider
				label={__('common:color_picker.label.lightness')}
				icon="☀️"
				bind:value={l}
				max={100}
				unit="%"
			/>
			<ColorSlider
				label={__('common:color_picker.label.alpha')}
				icon="🌬️"
				bind:value={a}
				min={0}
				max={1}
				step={0.01}
				unit=""
			/>
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 rounded-xl border border-evergreen/5 bg-white/50 p-4">
				<label for="hex-input" class="font-mono text-xs font-bold text-evergreen/40">
					{__('common:color_picker.label.hex')}
				</label>
				<input
					id="hex-input"
					type="text"
					bind:value
					class="w-full bg-transparent font-mono text-lg font-bold text-evergreen uppercase focus:outline-none"
				/>
			</div>
			<div class="flex gap-3">
				<button
					class="editor-secondary-btn flex h-14 w-14 items-center justify-center p-0 text-xl"
					onclick={() => {
						services.pickColor();
						onClose();
					}}
					title={__('common:color_picker.button.eye_dropper')}
					aria-label={__('common:color_picker.button.eye_dropper')}
				>
					<span aria-hidden="true"> 🖌️ </span>
				</button>
				<button class="editor-primary-btn flex-1 py-4" onclick={onClose}>
					{__('common:color_picker.button.confirm')}
				</button>
			</div>
		</div>
	</div>
</div>
