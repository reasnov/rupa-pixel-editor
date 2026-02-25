<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { untrack } from 'svelte';
	import { ColorLogic } from '../../logic/color.js';
	import ColorSlider from './ColorSlider.svelte';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';

	let { value = $bindable(), onClose } = $props<{ value: string; onClose: () => void }>();

	// HSLA State
	let h = $state(0);
	let s = $state(0);
	let l = $state(0);
	let a = $state(1); // 0.0 to 1.0

	// Local input state for the HEX field to prevent cursor jumping/interruptions
	let inputValue = $state(value);

	$effect(() => {
		const color = ColorLogic.toHSLA(value);
		untrack(() => {
			h = color.h;
			s = color.s;
			l = color.l;
			a = color.a;
			// Keep input sync when value changes from outside (e.g. eye dropper)
			if (inputValue !== value) {
				inputValue = value;
			}
		});
	});

	$effect(() => {
		const newColor = ColorLogic.toHex({ h, s, l, a });
		untrack(() => {
			value = newColor;
			inputValue = newColor;
		});
	});

	function handleHexInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value.toUpperCase();
		inputValue = val;
		const cleanHex = val.replace('#', '');

		// Only apply if it's at least 6 characters (RGB) or 8 characters (RGBA)
		if (cleanHex.length === 6 || cleanHex.length === 8) {
			const color = ColorLogic.toHSLA(val);
			h = color.h;
			s = color.s;
			l = color.l;
			a = color.a;
			// Don't update value here, let the HSLA $effect handle it to keep sliders in sync
		}
	}

	$effect(() => {
		editor.pushEscapeAction(onClose);
		return () => editor.popEscapeAction(onClose);
	});
</script>

<Dialog
	title="tools:color_picker.title"
	subtitle="tools:color_picker.subtitle"
	isOpen={true}
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8">
		<div class="flex items-center justify-between px-2">
			<span class="text-3xl" aria-hidden="true"> 🏺 </span>
			<div
				class="editor-checker-small h-16 w-32 rounded-xl border-4 border-canvas-bg shadow-lg"
				style="background-color: {value};"
				aria-label={__('ui:accessibility.color_preview')}
			></div>
		</div>

		<div class="flex flex-col gap-6">
			<ColorSlider
				label={__('tools:color_picker.label.hue')}
				icon="🌈"
				bind:value={h}
				max={360}
				unit="°"
				isHue={true}
			/>
			<ColorSlider
				label={__('tools:color_picker.label.saturation')}
				icon="💧"
				bind:value={s}
				max={100}
				unit="%"
			/>
			<ColorSlider
				label={__('tools:color_picker.label.lightness')}
				icon="☀️"
				bind:value={l}
				max={100}
				unit="%"
			/>
			<ColorSlider
				label={__('tools:color_picker.label.alpha')}
				icon="🌬️"
				bind:value={a}
				min={0}
				max={1}
				step={0.01}
				unit=""
			/>
		</div>

		<div class="flex flex-col gap-4">
			<Input
				label="tools:color_picker.label.hex"
				value={inputValue}
				oninput={handleHexInput}
				ariaLabel="tools:color_picker.label.hex"
				class="font-mono text-lg uppercase"
			/>

			<div class="flex gap-3">
				<Button
					variant="secondary"
					onclick={() => {
						services.pickColor();
						onClose();
					}}
					ariaLabel="tools:color_picker.button.eye_dropper"
					class="!h-14 !w-14 text-xl"
				>
					<span aria-hidden="true"> 🖌️ </span>
				</Button>
				<Button
					variant="primary"
					class="flex-1 py-4"
					onclick={onClose}
					ariaLabel="ui:labels.confirm"
				>
					{__('ui:labels.confirm')}
				</Button>
			</div>
		</div>
	</div>
</Dialog>
