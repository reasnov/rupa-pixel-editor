<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { untrack } from 'svelte';

	let {
		title = '',
		subtitle = '',
		icon = '',
		onClose,
		children,
		width = '500px',
		maxHeight = '85vh',
		scrollable = true
	} = $props<{
		title?: string;
		subtitle?: string;
		icon?: string;
		onClose: () => void;
		children: any;
		width?: string;
		maxHeight?: string;
		scrollable?: boolean;
	}>();

	// Custom "Paper Roll" Transition
	function paperRoll(node: HTMLElement, { duration = 600 }) {
		return {
			duration,
			css: (t: number) => {
				const eased = quintOut(t);
				return `
					opacity: ${t};
					transform: scaleX(${0.9 + eased * 0.1}) scaleY(${0.4 + eased * 0.6});
					clip-path: inset(0 ${(1 - eased) * 50}% 0 ${(1 - eased) * 50}%);
				`;
			}
		};
	}

	// Register with Escape Stack once per mount
	$effect(() => {
		untrack(() => {
			atelier.pushEscapeAction(onClose);
		});
		return () => atelier.popEscapeAction(onClose);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	transition:fade={{ duration: 200 }}
	class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/25 backdrop-blur-md"
	onmousedown={(e) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) onClose();
	}}
>
	<div
		in:paperRoll={{ duration: 500 }}
		out:fade={{ duration: 150 }}
		class="flex flex-col gap-8 overflow-hidden rounded-xl border-8 border-white bg-[#fdf6e3] p-10 shadow-2xl ring-1 ring-black/5"
		style="width: {width}; max-height: {maxHeight};"
		onmousedown={(e) => e.stopPropagation()}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-studio-text/5 pb-6">
			<div class="flex items-center gap-4">
				{#if icon}<span class="text-3xl">{icon}</span>{/if}
				<div class="flex flex-col">
					<h2 class="font-tiny5 text-3xl leading-none text-brand">{title}</h2>
					{#if subtitle}
						<span
							class="mt-1 font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-30"
							>{subtitle}</span
						>
					{/if}
				</div>
			</div>
			<button
				onclick={onClose}
				class="rounded-xl border border-black/5 bg-white/50 px-4 py-2 text-[10px] font-bold tracking-widest uppercase opacity-40 transition-all hover:opacity-100"
			>
				Close
			</button>
		</div>

		<!-- Content -->
		<div
			class="custom-scrollbar flex-1 {scrollable
				? 'overflow-y-auto pr-2'
				: 'flex flex-col overflow-hidden'}"
		>
			{@render children()}
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(211, 54, 130, 0.1);
		border-radius: 10px;
	}
</style>
