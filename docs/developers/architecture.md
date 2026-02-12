# Architecture Documentation: Rupa Pixel Editor

## 1. Executive Summary
Rupa is a specialized desktop environment for pixel art, built with a "Keyboard-First" philosophy. The architecture leverages **Svelte 5 (Runes)** for reactive UI management and **Electron** for a native desktop experience. The system is designed around the metaphor of "Digital Stitching," where the canvas is treated as a **Linen** and the cursor as a **Needle**.

---

## 2. Technology Stack
- **Runtime**: Node.js / Electron
- **Frontend Framework**: Svelte 5 (utilizing Runes: `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **Input Engine**: **LoomPad** (Semantic intent-based mapping)
- **State Management**: **AtelierState** (Reactive Class-based Singleton)

---

## 3. High-Level System Design
Rupa follows the standard Electron **Main-Renderer** architecture:
1.  **Main Process (`electron/main.cjs`)**: Handles window creation, native OS integration, and file system I/O.
2.  **Renderer Process (`src/`)**: The Svelte application where the drawing logic and UI reside.
3.  **Atelier Engine**: TypeScript modules handling non-UI concerns like audio synthesized feedback, history, and exports.

---

## 4. Core Systems

### 4.1 The Atelier State (`src/lib/state/atelier.svelte.ts`)
The heart of the application. It manages the workshop environment:
-   **Linen Data**: `stitches` is a flat array representing the grid.
-   **Needle Tracking**: `needlePos` ({x, y}) tracks the active cell.
-   **Reactive Projections**: 
    -   `cameraTransform`: A `$derived` string for CSS scaling and translation.
    -   `displayCoords`: Cartesian coordinates for the HUD.
-   **Escape Stack**: Manages nested UI dismissal (LIFO).

### 4.2 The LoomPad Engine (`src/lib/engine/loompad.ts`)
Translates raw keyboard events into semantic **LoomIntents**.
-   **Chords & Flows**: Handles complex modifier combinations (Hold Ctrl for Threading).
-   **Priority Matching**: Most specific patterns (e.g., Ctrl+Shift) are evaluated first.

---

## 5. UI & Rendering Strategy

### 5.1 Modular Components
The UI is decomposed into specialized modules under `src/lib/components/`:
-   **`canvas/`**: The `Linen` and the `Needle`.
-   **`hud/`**: Real-time stats, palette selections, and mode indicators.
-   **`overlay/`**: Modals for color picking (**DyeBasin**), command search (**PatternCatalog**), and exports (**ArtifactCrate**).

### 5.2 The Camera Protocol
Viewport movement is achieved by applying CSS transforms to the `Linen`. Zooming focal points are always centered on the current `needlePos`.

---

## 6. Interaction Modalities
1.  **Free Movement**: Arrow keys.
2.  **Threading (Stitch-Flow)**: Hold `Ctrl` while moving.
3.  **Block Looming (Selection)**: Hold `Shift` while moving.
4.  **Unravelling (Unstitch-Flow)**: Hold `Ctrl + Shift` while moving.

---

## 7. Data Flow
`Keyboard Event` -> `LoomPad` -> `Intent` -> `AtelierState` -> `UI Reactivity (Runes)` -> `Linen Rendering`.
