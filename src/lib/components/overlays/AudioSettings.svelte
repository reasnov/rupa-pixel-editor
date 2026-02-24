<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Slider from '../elements/Slider.svelte';
	import { __ } from '$lib/state/i18n.svelte.js';

	let { onClose = () => (editor.showAudioSettings = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Dialog
	title="workspace:hud.audio.title"
	subtitle="workspace:hud.audio.flow_title"
	isOpen={true}
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8">
		<!-- Master Mute Toggle -->
		<div
			class="flex items-center justify-between rounded-xl border border-text-main/5 bg-white/40 p-6 shadow-sm"
		>
			<div class="flex flex-col">
				<span class="font-serif text-sm font-bold tracking-tight text-text-main/60 uppercase"
					>{__('workspace:hud.audio.master_mute')}</span
				>
				<span class="font-serif text-[10px] text-text-main/40"
					>{__('workspace:hud.audio.mute_desc')}</span
				>
			</div>
			<Button
				variant={editor.isMuted ? 'primary' : 'secondary'}
				class="!px-6 !py-2"
				onclick={() => editor.toggleMute()}
				ariaLabel={editor.isMuted ? 'actions:hud.unmute_audio' : 'actions:hud.mute_audio'}
			>
				{editor.isMuted ? '🔇 Muted' : '🎐 Active'}
			</Button>
		</div>

		<!-- Volume Sliders -->
		<div class="flex flex-col gap-6 rounded-xl border border-text-main/5 bg-white/40 p-8">
			<!-- SFX Volume -->
			<Slider
				label="workspace:hud.audio.sfx_label"
				min={0}
				max={1}
				step={0.01}
				bind:value={editor.sfxVolume}
				ariaLabel="workspace:hud.audio.sfx_label"
			/>

			<!-- BGM Volume -->
			<Slider
				label="workspace:hud.audio.bgm_label"
				min={0}
				max={1}
				step={0.01}
				bind:value={editor.bgmVolume}
				ariaLabel="workspace:hud.audio.bgm_label"
			/>
		</div>

		<!-- Ambient Status Info -->
		<div class="rounded-xl bg-text-main/5 p-6">
			<h3 class="font-tiny5 mb-2 text-lg text-ui-accent">
				{__('workspace:hud.audio.flow_title')}
			</h3>
			<div class="flex flex-col gap-2 font-serif text-[11px] leading-relaxed text-text-main/60">
				<div class="flex justify-between">
					<span>{__('workspace:hud.audio.duration_label')}</span>
					<span class="font-mono">{editor.usageMinutes} minutes</span>
				</div>
				<p class="text-text-main/50 italic">
					{#if editor.usageMinutes < 30}
						{__('workspace:hud.audio.status_awaiting')}
					{:else}
						{__('workspace:hud.audio.status_playing')}
					{/if}
				</p>
			</div>
		</div>

		<Button variant="primary" class="w-full py-4" onclick={onClose} ariaLabel="ui:labels.confirm">
			{__('ui:labels.confirm')}
		</Button>
	</div>
</Dialog>
