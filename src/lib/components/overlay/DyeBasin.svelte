<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';
	import DyeSlider from './DyeSlider.svelte';

	let { value = $bindable(), onClose } = $props<{ value: string; onClose: () => void }>();

	// HSLA State
	let h = $state(0);
	let s = $state(0);
	let l = $state(0);
	let a = $state(1);

	$effect(() => {
		const hsla = hexToHsla(value);
		untrack(() => {
			h = hsla.h;
			s = hsla.s;
			l = hsla.l;
			a = hsla.a / 100;
		});
	});

	$effect(() => {
		const newHex = hslaToHex(h, s, l, a);
		untrack(() => {
			value = newHex;
		});
	});

	function hexToHsla(hex: string) {
		let r = 0,
			g = 0,
			b = 0,
			alpha = 1;
		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		} else if (hex.length === 7) {
			r = parseInt(hex.substring(1, 3), 16);
			g = parseInt(hex.substring(3, 5), 16);
			b = parseInt(hex.substring(5, 7), 16);
		}
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h_val = 0,
			s_val = 0,
			l_val = (max + min) / 2;
		if (max !== min) {
			const d = max - min;
			s_val = l_val > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h_val = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h_val = (b - r) / d + 2;
					break;
				case b:
					h_val = (r - g) / d + 4;
					break;
			}
			h_val /= 6;
		}
		return { h: h_val * 360, s: s_val * 100, l: l_val * 100, a: alpha * 100 };
	}

	function hslaToHex(h_val: number, s_val: number, l_val: number, a_val: number) {
		h_val /= 360;
		s_val /= 100;
		l_val /= 100;
		let r, g, b;
		if (s_val === 0) {
			r = g = b = l_val;
		} else {
			const q = l_val < 0.5 ? l_val * (1 + s_val) : l_val + s_val - l_val * s_val;
			const p = 2 * l_val - q;
			const hue2rgb = (t: number) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};
			r = hue2rgb(h_val + 1 / 3);
			g = hue2rgb(h_val);
			b = hue2rgb(h_val - 1 / 3);
		}
		const toHex = (x: number) =>
			Math.round(x * 255)
				.toString(16)
				.padStart(2, '0');
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}
</script>

<div
	transition:fade={{ duration: 150 }}
	class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
	role="button"
	tabindex="-1"
>
	<div
		in:scale={{ duration: 200, start: 0.95 }}
		out:scale={{ duration: 150, start: 1, opacity: 0 }}
		class="flex w-[400px] flex-col gap-8 rounded-[3rem] border-8 border-white bg-[#fdf6e3] p-10 shadow-2xl"
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
				class="h-12 w-12 rounded-2xl border-2 border-white shadow-inner"
				style="background-color: {value};"
			></div>
		</div>

		<div class="flex flex-col gap-6">
			<DyeSlider label="Hue" bind:value={h} max={360} unit="°" isHue={true} />
			<DyeSlider label="Saturation" bind:value={s} max={100} unit="%" />
			<DyeSlider label="Lightness" bind:value={l} max={100} unit="%" />
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 rounded-2xl border border-black/5 bg-white/50 p-4">
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
