<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { mode } from '../../engine/mode.svelte.js';
</script>

<div
	class="flex items-center gap-4 transition-opacity duration-1000"
	role="status"
	aria-live="polite"
>
	<div class="flex w-[180px] items-center">
		{#key mode.current.type}
			<div
				class="status-tag flex items-center gap-2 {mode.current.isPulse ? 'animate-pulse' : ''}"
				style="
					border-color: color-mix(in srgb, {mode.current.color} 20%, transparent);
					background-color: color-mix(in srgb, {mode.current.color} 10%, transparent);
					color: {mode.current.color};
				"
			>
				{#if mode.current.icon}
					<span class="text-xs" aria-hidden="true">{mode.current.icon}</span>
				{/if}

				<span class={mode.current.type === 'READY' ? 'font-serif italic opacity-60' : 'font-bold'}>
					{mode.current.label}
				</span>

				{#if mode.current.type === 'READY'}
					<span
						class="ml-1 border-l border-studio-text/20 pl-2 font-mono text-[9px] tracking-tighter not-italic"
					>
						v{editor.version}
					</span>
				{/if}
			</div>
		{/key}
	</div>

	{#if editor.project.lastSaved}
		{@const time = editor.project.lastSaved.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})}
		<div
			class="text-[8px] font-bold tracking-[0.2em] text-studio-text/20 uppercase"
			aria-label={__({ key: 'project.saved', replace: { time } })}
		>
			{__({ key: 'project.saved', replace: { time } })}
		</div>
	{/if}
</div>
