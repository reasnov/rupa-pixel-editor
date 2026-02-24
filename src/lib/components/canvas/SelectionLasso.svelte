<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { mode } from '../../engine/mode.svelte.js';

	let edges = $derived(editor.selection.getBoundaryEdges(editor.canvas.width));
	let vertices = $derived(editor.selection.vertices);
	let isSelecting = $derived(mode.current.type === 'SELECT');

	// Create a single path string for the selection fill (optimized)
	// We only do this when not actively dragging to keep it smooth
	let fillPath = $derived.by(() => {
		if (editor.selection.maskCount > 5000) return ''; // Skip fill for extremely large areas
		return editor.selection
			.getPoints(editor.canvas.width)
			.map((p) => `M${p.x},${p.y}h1v1h-1z`)
			.join(' ');
	});
</script>

{#if editor.selection.isActive}
	<!-- Motif Boundary Marching Ants (SVG Overlay) -->
	<svg
		class="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible"
		style="grid-column: 1 / -1; grid-row: 1 / -1;"
		viewBox="0 0 {editor.canvas.width} {editor.canvas.height}"
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
				stroke={isSelecting ? 'var(--color-lantern-gold)' : 'rgba(181, 137, 0, 0.8)'}
				stroke-width={0.08}
				stroke-dasharray="0.2, 0.2"
				class="marching-ants-svg"
			/>
		{/each}

		<!-- Binding Thread Vertices & Lines -->
		{#if vertices.length > 0}
			{#each vertices as v, i}
				{@const nextV = vertices[i + 1] || vertices[0]}
				<circle cx={v.x + 0.5} cy={v.y + 0.5} r="0.2" fill="var(--color-lantern-gold)" />
				{#if vertices.length > 1 && i < vertices.length - (vertices.length >= 3 ? 0 : 1)}
					<line
						x1={v.x + 0.5}
						y1={v.y + 0.5}
						x2={nextV.x + 0.5}
						y2={nextV.y + 0.5}
						stroke="var(--color-lantern-gold)"
						stroke-width="0.05"
						stroke-dasharray="0.1, 0.1"
					/>
				{/if}
			{/each}
		{/if}
	</svg>

	<!-- Faint fill for the selected area (SVG-based for performance) -->
	<svg
		class="pointer-events-none absolute inset-0 z-[39] h-full w-full overflow-visible"
		style="grid-column: 1 / -1; grid-row: 1 / -1;"
		viewBox="0 0 {editor.canvas.width} {editor.canvas.height}"
		shape-rendering="crispEdges"
	>
		<path d={fillPath} fill="var(--color-lantern-gold)" fill-opacity="0.1" />
	</svg>
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
