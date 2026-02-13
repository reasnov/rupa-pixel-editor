<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
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
	role="button"
	tabindex="-1"
>
	<div
		in:scale={{ duration: 200, start: 0.95 }}
		out:scale={{ duration: 150, start: 1, opacity: 0 }}
		class="flex w-[400px] flex-col gap-8 rounded-xl border-8 border-white bg-[#fdf6e3] p-10 shadow-2xl"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-3xl">⛲</span>
				<div class="flex flex-col">
					<h2 class="font-tiny5 text-3xl leading-none text-brand">Dye Basin</h2>
					<span class="mt-1 font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-30"
						>Mix your threads</span
					>
				</div>
			</div>
			<div
				class="artisan-checker-small h-12 w-12 rounded-xl border-2 border-white shadow-inner"
				style="background-color: {value};"
			></div>
		</div>

		<div class="flex flex-col gap-6">
			<DyeSlider label="Hue" bind:value={h} max={360} unit="°" isHue={true} />
			<DyeSlider label="Saturation" bind:value={s} max={100} unit="%" />
			<DyeSlider label="Lightness" bind:value={l} max={100} unit="%" />
			<DyeSlider label="Alpha" bind:value={a} min={0} max={1} step={0.01} unit="" />
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 rounded-xl border border-black/5 bg-white/50 p-4">
				<span class="font-mono text-sm font-bold opacity-40">HEX</span>
				<input
					type="text"
					bind:value
					class="w-full bg-transparent font-mono text-lg font-bold uppercase focus:outline-none"
				/>
			</div>
			<button class="artisan-primary-btn w-full py-4" onclick={onClose}>Seal the Dye</button>
		</div>
	</div>
</div>
