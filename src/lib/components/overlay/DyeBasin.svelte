<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';
	import { SpinnerEngine } from '../../engine/spinner.js';
	import DyeSlider from './DyeSlider.svelte';

	let { value = $bindable(), onClose } = $props<{ value: string; onClose: () => void }>();

	// HSLA State
	let h = $state(0);
	let s = $state(0);
	let l = $state(0);
	let a = $state(1); // 0.0 to 1.0

	$effect(() => {
		const fiber = SpinnerEngine.unravel(value);
		untrack(() => {
			h = fiber.h;
			s = fiber.s;
			l = fiber.l;
			a = fiber.a;
		});
	});

	$effect(() => {
		const newThread = SpinnerEngine.spin({ h, s, l, a });
		untrack(() => {
			value = newThread;
		});
	});

	// Register with Escape Stack
	$effect(() => {
		untrack(() => atelier.pushEscapeAction(onClose));
		return () => atelier.popEscapeAction(onClose);
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
		aria-labelledby="dye-basin-title"
		aria-modal="true"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-3xl" aria-hidden="true">⛲</span>
				<div class="flex flex-col">
					<h2 id="dye-basin-title" class="font-tiny5 text-3xl leading-none text-brand">
						{__({ key: 'dye_basin.title' })}
					</h2>
					<span
						class="mt-1 font-serif text-[10px] font-bold tracking-[0.2em] uppercase text-studio-text/40"
					>
						{__({ key: 'dye_basin.subtitle' })}
					</span>
				</div>
			</div>
			<div
				class="artisan-checker-small h-12 w-12 rounded-xl border-2 border-white shadow-inner"
				style="background-color: {value};"
				aria-label="Color Preview"
			></div>
		</div>

		<div class="flex flex-col gap-6">
			<DyeSlider
				label={__({ key: 'dye_basin.sliders.hue' })}
				bind:value={h}
				max={360}
				unit="°"
				isHue={true}
			/>
			<DyeSlider label={__({ key: 'dye_basin.sliders.saturation' })} bind:value={s} max={100} unit="%" />
			<DyeSlider label={__({ key: 'dye_basin.sliders.lightness' })} bind:value={l} max={100} unit="%" />
			<DyeSlider
				label={__({ key: 'dye_basin.sliders.alpha' })}
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
					{__({ key: 'dye_basin.hex_label' })}
				</label>
				<input
					id="hex-input"
					type="text"
					bind:value
					class="w-full bg-transparent font-mono text-lg font-bold uppercase text-studio-text focus:outline-none"
				/>
			</div>
			<div class="flex gap-3">
				<button
					class="artisan-secondary-btn flex h-14 w-14 items-center justify-center p-0 text-xl"
					onclick={() => {
						shuttle.pickDye();
						onClose();
					}}
					title={__({ key: 'dye_basin.eye_drop' })}
					aria-label={__({ key: 'dye_basin.eye_drop' })}
				>
					<span aria-hidden="true">💉</span>
				</button>
				<button class="artisan-primary-btn flex-1 py-4" onclick={onClose}>
					{__({ key: 'dye_basin.seal' })}
				</button>
			</div>
		</div>
	</div>
</div>
