<script lang="ts">
	let {
		label,
		value = $bindable(),
		min = 0,
		max,
		step = 1,
		unit = '',
		isHue = false
	} = $props<{
		label: string;
		value: number;
		min?: number;
		max: number;
		step?: number;
		unit?: string;
		isHue?: boolean;
	}>();
</script>

<div class="flex flex-col gap-2">
	<div
		class="flex justify-between font-serif text-[10px] font-bold tracking-wider uppercase opacity-40"
	>
		<span>{label}</span>
		<span>{step < 1 ? value.toFixed(2) : Math.round(value)}{unit}</span>
	</div>
	<input
		type="range"
		{min}
		{max}
		{step}
		bind:value
		class="custom-slider"
		class:hue-slider={isHue}
	/>
</div>

<style>
	.custom-slider {
		-webkit-appearance: none;
		appearance: none;
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
		border: 3px solid var(--color-brand);
		border-radius: 8px;
		cursor: pointer;
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	}
	.hue-slider {
		background: linear-gradient(
			to right,
			#f00 0%,
			#ff0 17%,
			#0f0 33%,
			#0ff 50%,
			#00f 67%,
			#f0f 83%,
			#f00 100%
		);
	}
</style>
