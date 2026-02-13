<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { stance } from '../../engine/stance.svelte.js';

	let edges = $derived(atelier.selection.getBoundaryEdges(atelier.linen.width));
	let isLooming = $derived(stance.current.type === 'LOOMING');
</script>

{#if atelier.selection.isActive}
	<!-- Motif Boundary Marching Ants (SVG Overlay) -->
	<svg
		class="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible"
		style="grid-column: 1 / -1; grid-row: 1 / -1;"
		viewBox="0 0 {atelier.linen.width} {atelier.linen.height}"
		shape-rendering="crispEdges"
	>
		<defs>
			<pattern id="ants" width="1" height="1" patternUnits="userSpaceOnUse">
				<line
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					stroke="var(--ants-color)"
					stroke-width="0.1"
					stroke-dasharray="0.2, 0.2"
				/>
			</pattern>
		</defs>

		{#each edges as edge}
			<line
				x1={edge.x1}
				y1={edge.y1}
				x2={edge.x2}
				y2={edge.y2}
				stroke={isLooming ? 'var(--color-brand)' : 'rgba(211, 54, 130, 0.8)'}
				stroke-width={0.08}
				stroke-dasharray="0.2, 0.2"
				class="marching-ants-svg"
			/>
		{/each}
	</svg>

	<!-- Faint fill for the selected area -->
	<div
		class="pointer-events-none absolute inset-0 z-[39]"
		style="grid-column: 1 / -1; grid-row: 1 / -1;"
	>
		{#each atelier.selection.getPoints(atelier.linen.width) as p}
			<div
				class="absolute bg-brand/10"
				style="
                left: {(p.x / atelier.linen.width) * 100}%; 
                top: {(p.y / atelier.linen.height) * 100}%; 
                width: {100 / atelier.linen.width}%; 
                height: {100 / atelier.linen.height}%;
            "
			></div>
		{/each}
	</div>
{/if}

<style>
	.marching-ants-svg {
		animation: marching-ants-svg-animation 0.8s infinite linear;
	}

	@keyframes marching-ants-svg-animation {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: 0.4;
		}
	}
</style>
