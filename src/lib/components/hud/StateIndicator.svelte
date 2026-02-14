<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { stance } from '../../engine/stance.svelte.js';
</script>

<div
	class="flex items-center gap-4 transition-opacity duration-1000 {atelier.needle.isVisible
		? 'opacity-100'
		: 'opacity-0'}"
	role="status"
	aria-live="polite"
>
	<div class="flex w-[180px] items-center">
		{#key stance.current.type}
			<div
				class="status-tag flex items-center gap-2 {stance.current.isPulse ? 'animate-pulse' : ''}"
				style="
					border-color: color-mix(in srgb, {stance.current.color} 20%, transparent);
					background-color: color-mix(in srgb, {stance.current.color} 10%, transparent);
					color: {stance.current.color};
				"
			>
				{#if stance.current.icon}
					<span class="text-xs" aria-hidden="true">{stance.current.icon}</span>
				{/if}

				<span
					class={stance.current.type === 'RESTING' ? 'font-serif italic opacity-60' : 'font-bold'}
				>
					{stance.current.label}
				</span>

				{#if stance.current.type === 'RESTING'}
					<span
						class="ml-1 border-l border-studio-text/20 pl-2 font-mono text-[9px] tracking-tighter not-italic"
					>
						v{atelier.version}
					</span>
				{/if}
			</div>
		{/key}
	</div>

	{#if atelier.project.lastSaved}
		{@const time = atelier.project.lastSaved.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})}
		<div
			class="text-[8px] font-bold tracking-[0.2em] text-studio-text/20 uppercase"
			aria-label={__({ key: 'project.archived', replace: { time } })}
		>
			{__({ key: 'project.archived', replace: { time } })}
		</div>
	{/if}
</div>
