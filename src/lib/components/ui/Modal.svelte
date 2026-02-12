<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';

	let {
		title = '',
		subtitle = '',
		icon = '',
		onClose,
		children,
		width = '500px',
		maxHeight = '85vh'
	} = $props<{
		title?: string;
		subtitle?: string;
		icon?: string;
		onClose: () => void;
		children: any;
		width?: string;
		maxHeight?: string;
	}>();

	// Register with Escape Stack once per mount
	$effect(() => {
		// Use untrack to ensure registering doesn't re-trigger the effect
		untrack(() => {
			atelier.pushEscapeAction(onClose);
		});
		return () => atelier.popEscapeAction(onClose);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	transition:fade={{ duration: 150 }}
	class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
>
	<div
		in:scale={{ duration: 200, start: 0.95 }}
		out:scale={{ duration: 150, start: 1, opacity: 0 }}
		class="flex flex-col gap-8 overflow-hidden rounded-[2rem] border-8 border-white bg-[#fdf6e3] p-10 shadow-2xl ring-1 ring-black/5"
		style="width: {width}; max-height: {maxHeight};"
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
				class="rounded-full border border-black/5 bg-white/50 px-4 py-2 text-[10px] font-bold tracking-widest uppercase opacity-40 transition-all hover:opacity-100"
			>
				Close
			</button>
		</div>

		<!-- Content -->
		<div class="custom-scrollbar flex-1 overflow-y-auto pr-2">
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
