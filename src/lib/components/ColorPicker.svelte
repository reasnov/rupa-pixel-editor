<script lang="ts">
	import { editor } from '../state/editor.svelte';

	let h = $state(0);
	let s = $state(100);
	let l = $state(50);

	// Parse current color to HSL on mount
	function hexToHsl(hex: string) {
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;

		let max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return { h: h * 360, s: s * 100, l: l * 100 };
	}

	// Initialize HSL from current active color
	const initialHsl = hexToHsl(editor.activeColor);
	h = initialHsl.h;
	s = initialHsl.s;
	l = initialHsl.l;

	function hslToHex(h: number, s: number, l: number) {
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n: number) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0');
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}

	// Sync local HSL to editor active color
	$effect(() => {
		editor.activeColor = hslToHex(h, s, l);
	});

	function close() {
		editor.showColorPicker = false;
	}

	// Register Escape listener
	$effect(() => {
		editor.pushEscapeAction(close);
		return () => editor.popEscapeAction(close);
	});

	function handleHexInput(e: Event) {
		const hex = (e.target as HTMLInputElement).value;
		if (/^#[0-9A-F]{6}$/i.test(hex)) {
			const hsl = hexToHsl(hex);
			h = hsl.h;
			s = hsl.s;
			l = hsl.l;
		}
	}
</script>

<div
	id="picker-overlay"
	class="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={handleOutsideClick}
>
	<div
		class="flex w-80 flex-col gap-6 rounded-[2.5rem] border-8 border-white bg-[#fdf6e3] p-8 shadow-2xl ring-1 ring-black/5"
	>
		<div class="flex items-center justify-between">
			<span class="font-serif text-2xl text-studio-warm italic">Natural Dye Basin</span>
			<button
				onclick={close}
				class="text-[10px] font-bold tracking-widest uppercase opacity-30 transition-opacity hover:opacity-100"
				>Close</button
			>
		</div>

		<!-- Preview area -->
		<div
			class="relative flex h-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#eee8d5] shadow-inner"
		>
			<div class="tech-checker absolute inset-0 opacity-30"></div>
			<div
				class="z-10 h-20 w-20 rounded-full border-4 border-white shadow-lg"
				style="background-color: {editor.activeColor};"
			></div>
		</div>

		<!-- Sliders -->
		<div class="flex flex-col gap-5">
			<div class="flex flex-col gap-2">
				<div
					class="flex justify-between text-[10px] font-black tracking-wider uppercase opacity-30"
				>
					<span>Hue</span>
					<span>{Math.round(h)}°</span>
				</div>
				<input type="range" min="0" max="360" bind:value={h} class="custom-slider hue-slider" />
			</div>

			<div class="flex flex-col gap-2">
				<div
					class="flex justify-between text-[10px] font-black tracking-wider uppercase opacity-30"
				>
					<span>Saturation</span>
					<span>{Math.round(s)}%</span>
				</div>
				<input type="range" min="0" max="100" bind:value={s} class="custom-slider" />
			</div>

			<div class="flex flex-col gap-2">
				<div
					class="flex justify-between text-[10px] font-black tracking-wider uppercase opacity-30"
				>
					<span>Lightness</span>
					<span>{Math.round(l)}%</span>
				</div>
				<input type="range" min="0" max="100" bind:value={l} class="custom-slider" />
			</div>
		</div>

		<div class="relative">
			<input
				type="text"
				value={editor.activeColor.toUpperCase()}
				oninput={handleHexInput}
				maxlength="7"
				class="focus:ring-ghibli-warm/20 w-full rounded-xl border border-black/5 bg-white/80 py-2 text-center font-mono text-xs opacity-60 focus:ring-2 focus:outline-none"
			/>
			<span
				class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[8px] font-bold uppercase opacity-20"
				>Hex</span
			>
		</div>
	</div>
</div>

<style>
	.custom-slider {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
		background: #eee8d5;
		border-radius: 5px;
		outline: none;
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	.custom-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		background: #fff;
		border: 3px solid #859900;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
		margin-top: -1px;
	}

	.hue-slider {
		background: linear-gradient(
			to right,
			#ff0000 0%,
			#ffff00 17%,
			#00ff00 33%,
			#00ffff 50%,
			#0000ff 67%,
			#ff00ff 83%,
			#ff0000 100%
		);
	}
</style>
