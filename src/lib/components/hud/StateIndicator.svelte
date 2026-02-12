<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import { stance } from '../../engine/stance.svelte';
	import { fade, scale } from 'svelte/transition';
</script>

<div class="flex items-center gap-4">
	<div 
		key={stance.current.type}
		in:scale={{ duration: 200, start: 0.95 }}
		out:fade={{ duration: 150 }}
		class="status-tag flex items-center gap-2 {stance.current.isPulse ? 'animate-pulse' : ''}"
		style="
			border-color: color-mix(in srgb, {stance.current.color} 20%, transparent);
			background-color: color-mix(in srgb, {stance.current.color} 10%, transparent);
			color: {stance.current.color};
		"
	>
		{#if stance.current.icon}
			<span class="text-xs">{stance.current.icon}</span>
		{/if}
		
		<span class={stance.current.type === 'RESTING' ? 'font-serif italic opacity-60' : 'font-bold'}>
			{stance.current.label}
		</span>

		{#if stance.current.type === 'RESTING'}
			<span class="ml-1 border-l border-studio-text/20 pl-2 not-italic font-mono text-[9px] tracking-tighter">
				v{atelier.version}
			</span>
		{/if}
	</div>

	<!-- Auto-save notification -->
	{#if atelier.lastSaved}
		{@const time = atelier.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
		<div 
			transition:fade
			class="text-[8px] font-bold tracking-[0.2em] uppercase opacity-20"
		>
			Linen Backed Up: {time}
		</div>
	{/if}
</div>
