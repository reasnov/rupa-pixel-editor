# Architecture Documentation: Rupa Pixel Editor (Atelier)

## 1. Executive Summary
Rupa is a specialized desktop environment for pixel art, built with a "Keyboard-First" philosophy. The architecture leverages **Svelte 5 (Runes)** for reactive UI management and **Electron** for a native desktop experience. The system is designed around the metaphor of "Digital Stitching," where the canvas is treated as a **Linen** and the cursor as a **Needle**.

---

## 2. Technology Stack
- **Runtime**: Node.js / Electron
- **Frontend Framework**: Svelte 5 (utilizing Runes: `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite / SvelteKit (Static Adapter)
- **Styling**: Tailwind CSS 4.0
- **Input Engine**: **LoomPad** (Semantic intent-based mapping)
- **State Management**: **AtelierState** (Reactive Class-based Singleton)
- **Persistence**: Electron File System (Native) & IndexedDB (Web)

---

## 3. High-Level System Design
Rupa follows the standard Electron **Main-Renderer** architecture:

1.  **Main Process (`electron/main.cjs`)**: Handles window creation, native OS integration, IPC communication, and file system I/O.
2.  **Renderer Process (`src/`)**: The Svelte application where the drawing logic and UI reside.
3.  **Atelier Engine**: TypeScript modules handling non-UI concerns:
    - `audio.ts`: Programmatic synthesized feedback.
    - `export.ts`: SVG and PNG generation logic.
    - `history.ts`: Command-pattern undo/redo stack.
    - `shuttle.ts`: High-level action execution.
    - `stance.svelte.ts`: Behavioral mode orchestration.

---

## 4. Core Systems

### 4.1 The Atelier State (`src/lib/state/atelier.svelte.ts`)
The central heart of the application. It manages the workshop environment:
- **Linen Data**: `stitches` is a flat array representing the grid.
- **Needle Tracking**: `needlePos` ({x, y}) tracks the active cell.
- **Palette**: A collection of `ColorHex` threads.
- **Reactive Projections**: 
  - `cameraTransform`: A `$derived` string for CSS scaling and translation.
  - `displayCoords`: Cartesian coordinates for the HUD.
  - `usedColors`: A `$derived` list of colors currently present on the linen.
- **Escape Stack**: Manages nested UI dismissal (LIFO).

### 4.2 The LoomPad Engine (`src/lib/engine/loompad.svelte.ts`)
Translates raw keyboard events into semantic **LoomIntents**.
- **Chords & Flows**: Handles complex modifier combinations (e.g., Ctrl+Shift).
- **Priority Matching**: Complexity-first evaluation (more modifiers = higher priority).
- **Intent Mapping**: Decouples physical keys from logical actions.

### 4.3 The Stance Engine (`src/lib/engine/stance.svelte.ts`)
Governs the behavioral mode of the application:
- **STANCE_RESTING**: Default movement.
- **STANCE_THREADING**: Continuous stitching (Ctrl).
- **STANCE_UNRAVELLING**: Continuous erasing (Ctrl + Shift).
- **STANCE_LOOMING**: Selection mode (Shift).
- **STANCE_PICKING**: Eyedropper mode (Alt).

---

## 5. UI & Rendering Strategy

### 5.1 Modular Components
The UI is decomposed into specialized modules under `src/lib/components/`:
- **`brand/`**: Splash screens and identity elements.
- **`canvas/`**: The `Linen` and the `Needle`.
- **`hud/`**: Real-time stats (`NeedleStats`), palette (`DyePalette`), and mode indicators (`StateIndicator`).
- **`overlay/`**: Modals for color picking (**DyeBasin**), command search (**PatternCatalog**), settings (**LinenSettings**), and exports (**ArtifactCrate**).

### 5.2 The Camera Protocol
Viewport movement is achieved by applying CSS transforms to the `Linen`. The system ensures that zooming focal points are always centered on the current `needlePos`, maintaining the artisan's focus.

---

## 6. Data Flow
`Keyboard Event` -> `LoomPad` -> `Intent` -> `AtelierState / StanceEngine` -> `UI Reactivity (Runes)` -> `Linen Rendering`.

---

## 7. Performance & Integrity
- **Input Latency**: Aiming for < 16ms (60fps) for smooth navigation.
- **SVG Optimization**: Intelligent path-merging (rect-merging) to keep vector artifacts small.
- **History Depth**: 500-step undo/redo capacity.
