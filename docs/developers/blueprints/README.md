# The Architect's Map: Rupa Blueprints

## 1. Philosophy: Living Contracts
Blueprints in Rupa are **not** static task lists or changelogs. They are **Living Contracts** that define the technical soul, architectural rules, and interaction philosophies of the studio.

- **Evolutionary:** As the application grows, blueprints are updated to reflect the current truth.
- **Semantic:** They focus on the *Why* and the *Pattern*, rather than the specific version number.
- **Truth-Bearing:** If the code and the blueprint disagree, the blueprint represents the "ideal" state that must be achieved.

---

## 2. Directory Index

### [01: Project Genesis](./01-project-genesis.md)
The foundational spark. Defines the core tech stack (Svelte 5 + Electron), the "Artisan" metaphor, and the initial Digital Stitching engine.

### [02: Palette & Artifacts](./02-palette-and-export.md)
The artisan's tools. Details the implementation of the Natural Dye Basin (Color Picker), dynamic palettes, and the pro-grade Export Engine (SVG path merging and sharp PNGs).

### [03: Persistence & Manipulation](./03-persistence-and-manipulation.md)
The studio's memory. Governs how projects are saved/loaded (`.rupa` format), the 10-minute Auto-Backup rhythm, and advanced grid transformations like flipping and rotation.

### [04: The LoomPad Engine](./04-loompad-engine.md)
The Weaver's Hand. A dedicated specification for the keyboard-centric input system. Defines the translation of raw keys into **Semantic Intents**, chord priority, and context-aware behavior.

---

## 3. Usage for Developers
When contributing or extending Rupa:
1.  **Consult the Map:** Read the relevant blueprint to understand the "Intent" behind a feature.
2.  **Uphold the Contract:** Ensure your implementation follows the architectural constraints (e.g., "No hardcoded key checks in UI").
3.  **Refine the Truth:** If you find a better way to weave a feature, update the blueprint first to reflect the new architectural standard.

---

*"We do not build software; we weave digital textiles."*
