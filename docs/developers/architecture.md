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

The central heart of the application. It manages the workshop environment through specialized sub-state classes:

- **Modular State Pattern**: State is decomposed into classes (`LinenState`, `NeedleState`, `PaletteState`, etc.) using Svelte 5 Runes.
- **Service-Oriented Logic**: Business logic is strictly kept in `src/lib/engine/services/`. State classes only hold data and derived projections.
- **Session Tracking**: Tracks `usageMinutes` and `usageSeconds` for the Atmosphere Protocol and working timer.

### 4.2 The LoomPad Engine (`src/lib/engine/loompad.svelte.ts`)

Translates raw keyboard events into semantic **LoomIntents**.

- **Chords & Flows**: Handles complex modifier combinations (e.g., Ctrl+Shift).
- **Reserved Shortcuts**: Maintains a list of OS-level shortcuts to avoid intent collisions.

### 4.3 The Stance Engine (`src/lib/engine/stance.svelte.ts`)

Governs the behavioral mode of the application.

### 4.4 The Ambient Engine (`src/lib/engine/ambient.ts`)

A generative music system producing real-time piano soundscapes.

- **Procedural Composition**: Uses Eb Major Pentatonic scale and progressive chord cycles.
- **Atmosphere Protocol**: Implements a 30-minute silence delay followed by a 30-minute volume fade-in.

---

## 5. UI & Rendering Strategy

### 5.1 Professional Workspace Layout

The HUD follows a solid container architecture (similar to professional editors like Figma):

- **Atelier Header (Top)**: Central command center for identity, tools, and project metadata.
- **Folio Sidebar (Left)**: Management of Frames (Canvases) and Veils (Layers). Supports Drag-and-Drop.
- **Inspector Sidebar (Right)**: Property panels for Dye selection, history, and Needle statistics.
- **Status Footer (Bottom)**: Houses the **TechLedger** with modular indicators for Chords, Stances, Working Time, and Atmosphere status.

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
