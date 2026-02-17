# Architecture Documentation: Rupa Pixel Editor

## 1. Executive Summary

**Rupa Pixel Editor** is a specialized desktop environment for pixel art, built with a "Keyboard-First, Mouse-Friendly" philosophy. The architecture follows a **Modular Layered Monolith** pattern, ensuring high cohesion within functional modules while maintaining a strict separation of concerns across technical layers. The system leverages **Svelte 5 (Runes)** for reactive UI management and **Electron** for a native desktop experience. The system is designed around the metaphor of "Barista Brewing," where the surface is treated as **The Foam** (Canvas) and the tool as **The Etcher** (Cursor).

---

## 2. Architectural Pattern: Modular Layered Monolith

Rupa Pixel Editor is structured into five distinct layers to ensure scalability and maintainability:

1.  **UI Layer (`src/lib/components/`)**: Purely presentational Svelte components (HUD). They consume state and trigger intents.
2.  **State Layer (`src/lib/state/`)**: Reactive data structures using Svelte 5 Runes (The Project). They hold the "Source of Truth" but contain no complex business logic.
3.  **Service Layer (`src/lib/engine/services/`)**: The core drawing and project logic. Services manipulate state and orchestrate complex operations (e.g., Project management, Drawing algorithms).
4.  **Engine Layer (`src/lib/engine/`)**: Low-level infrastructure and orchestrators (Input parsing, Audio generation, Service coordination).
5.  **Logic Layer (`src/lib/logic/`)**: The "Brain" of the application. Pure, stateless algorithms and mathematical models (Geometry, Path processing, Color theory).

---

## 3. Technology Stack

- **Runtime**: Node.js / Electron
- **Frontend Framework**: Svelte 5 (utilizing Runes: `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite / SvelteKit (Static Adapter)
- **Styling**: Tailwind CSS 4.0
- **Input Engines**:
  - **Keyboard Engine**: Keyboard-centric semantic action mapping (The Rhythm).
  - **Pointer Engine**: Mouse-based positional intent and "Continuous Flow" mapping.
- **State Management**: **EditorState** (Reactive Class-based Singleton)
- **Persistence**: Electron File System (Native) & IndexedDB (Web)

---

## 3. High-Level System Design

Rupa Pixel Editor follows the standard Electron **Main-Renderer** architecture:

1.  **Main Process (`electron/main.cjs`)**: Handles window creation, native OS integration, IPC communication, and file system I/O.
2.  **Renderer Process (`src/`)**: The Svelte application where the drawing logic and UI reside.
3.  **Core Engine**: TypeScript modules handling non-UI concerns:
    - `audio.ts`: Programmatic synthesized feedback.
    - `export.ts`: SVG and Raster generation logic.
    - `history.ts`: Command-pattern undo/redo stack.
    - `services.ts`: Unified service coordinator (ServiceCoordinator).
    - `mode.svelte.ts`: Behavioral state orchestration.

---

## 4. Core Systems

### 4.1 The Editor State (`src/lib/state/editor.svelte.ts`)

The central heart of the application. It manages the environment through specialized sub-state classes:

- **Modular State Pattern**: State is decomposed into classes (`CanvasState`, `CursorState`, `PaletteState`, etc.) using Svelte 5 Runes.
- **Service-Oriented Logic**: Business logic is strictly kept in `src/lib/engine/services/`. State classes only hold data and derived projections.
- **Session Tracking**: Tracks `usageMinutes` and `usageSeconds` for the Ambiance status and working timer.

### 4.2 The Keyboard Engine (`src/lib/engine/keyboard.svelte.ts`)

Translates raw keyboard events into semantic **ActionIntents**.

- **Rhythms & Flows**: Handles complex modifier combinations (e.g., Ctrl+Shift).
- **Reserved Shortcuts**: Maintains a list of OS-level shortcuts to avoid intent collisions.

### 4.3 The Mode Engine (`src/lib/engine/mode.svelte.ts`)

Governs the behavioral mode of the application (Paint, Erase, Select).

### 4.4 The Ambient Engine (`src/lib/engine/ambient.ts`)

A generative music system producing real-time piano soundscapes.

- **Procedural Composition**: Uses Eb Major Pentatonic scale and progressive chord cycles.
- **Ambiance Protocol**: Implements a 30-minute silence delay followed by a 30-minute volume fade-in.

### 4.5 The Pointer Engine (`src/lib/engine/pointer.svelte.ts`)

The specialized engine for mouse and pointer interactions.

- **Positional Awareness**: Maps screen-space coordinates to the **Canvas** (Foam) grid-space.
- **Continuous Flow**: Enables organic freehand drawing while respecting the current Mode (Painting, Erasing).
- **Gesture Orchestration**: Translates clicks and drags into ActionIntents to maintain consistency with the Keyboard engine.

### 4.6 The i18n System (`src/lib/state/i18n.svelte.ts`)

The internationalization layer for the application.

- **Reactive Translation**: Uses `i18next` integrated with Svelte Runes for real-time language switching.
- **Global Helper**: Provides the `__()` global function for component-level translations without imports.
- **Barista Lexicon**: Manages localized strings for tools, metadata, and ambiance descriptions.

### 4.7 The Logic Layer (`src/lib/logic/`)

The "Brain" of the application. This layer contains pure, side-effect-free algorithms.

- **Geometry Module**: Handles line interpolation (Bresenham) and arc fitting for shape correction.
- **Path Module**: Manages smoothing and simplification (Douglas-Peucker).
- **Computational Sovereignty**: Logic modules must never import from State, Services, or UI layers. They receive raw data and return calculated results.

---

## 5. UI & Rendering Strategy

### 5.1 Professional Workspace Layout

The HUD follows a solid container architecture (similar to professional editors like Figma):

- **Editor Header (Top)**: Central command center for identity, tools, and project metadata.
- **Frame Sidebar (Left)**: Management of **Frames** (Cups) and **Layers** (Infusions). Supports Drag-and-Drop.
- **Inspector Sidebar (Right)**: Property panels for **Color** (Flavor) selection, history, and cursor statistics.
- **Status Footer (Bottom)**: Houses the **TechLedger** with modular indicators for Modes, Working Time, and Ambiance status.

### 5.2 The Camera Protocol

Viewport movement is achieved by applying CSS transforms to the **Canvas**. The system ensures that zooming focal points are always centered on the current `cursorPos`, maintaining the artist's focus.

---

## 6. Data Flow

`Keyboard Event` -> `KeyboardEngine` -> `ActionIntent` -> `EditorState / ModeEngine` -> `UI Reactivity (Runes)` -> `Canvas Rendering`.

---

## 7. Performance & Integrity

- **Input Latency**: Aiming for < 16ms (60fps) for smooth navigation.
- **SVG Optimization**: Intelligent path-merging (rect-merging) to keep vector artifacts small.

---

## 8. CSS Architecture: SMACSS Pattern

To maintain visual harmony and code maintainability, Rupa Pixel Editor follows the **SMACSS** approach, adapted for Svelte 5 and Tailwind CSS:

1.  **Base**: Default styles for HTML elements. Managed via Tailwind's `@base` layer and global `layout.css`.
2.  **Layout**: Major structural components (e.g., Sidebars, Header, Timeline Panel). These define the skeleton of the application.
3.  **Module**: Reusable, independent UI elements (e.g., `.editor-tool-btn`, `.pixel-cell`). Modules live within Svelte component `<style>` blocks.
4.  **State**: Describes how modules look in different conditions (e.g., `is-active`, `is-locked`, `is-hidden`). We use Svelte's class toggling for this.
5.  **Theme**: Visual skinning (e.g., Solarized Cream, Barista Magenta). Managed via CSS variables and Tailwind configuration.

### 8.1 Implementation Rules

1. Use `@apply` in Svelte `<style>` blocks to compose complex **Module** or **Layout** classes from Tailwind utilities.
2. Prefix shared application classes with `editor-` (e.g., `.editor-panel`) to avoid naming collisions.
3. Keep state-based classes semantic (e.g., use `.is-painting` instead of generic `.active`).

---

## 9. Data Layer: Static Configuration (SSoT)

To ensure the application is easily maintainable and scalable, all static data (Shortcuts, Palettes, Audio frequencies, Onboarding text) is stored in the **Data Layer** using JSON files in `src/lib/config/`.

### 9.1 Single Source of Truth (SSoT)

- **Consistency**: Centralizing data in JSON prevents hardcoded strings from scattering across UI components.
- **Maintainability**: Tuning the "lore" or "vibe" of the café (e.g., changing sound frequencies or tutorial text) only requires editing a single JSON file.

### 9.2 Access Restrictions

- **Engine/Service Sovereignty**: Only Engines or Services are permitted to import and process JSON configuration files.
- **Normalization**: Engines act as "Data Brokers," responsible for normalizing raw JSON data (e.g., Title Casing shortcut labels) before exposing them to the State or UI layers.
- **Passive UI**: Svelte components must remain "dumb" regarding static data. They should consume processed data from the State or through Engine method calls (e.g., `keyboard.getActions()`) rather than importing JSON directly.
