<script lang="ts">
	import Header from './Header.svelte';
	import ToolGroup from './ToolGroup.svelte';
	import ProjectInfo from './ProjectInfo.svelte';
</script>

<div
	class="pointer-events-none fixed top-0 left-0 z-50 flex w-full items-start justify-between p-8"
>
	<div class="flex items-start gap-8">
		<div class="pointer-events-auto">
			<Header />
		</div>
		<ToolGroup />
	</div>

	<ProjectInfo />
</div>
