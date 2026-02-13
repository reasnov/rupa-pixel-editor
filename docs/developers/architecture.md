# Architecture Documentation: Rupa Pixel Editor (Atelier)

## 1. Executive Summary

Rupa is a specialized desktop environment for pixel art, built with a "Keyboard-First, Mouse-Friendly" philosophy. The architecture follows a **Modular Layered Monolith** pattern, ensuring high cohesion within functional modules while maintaining a strict separation of concerns across technical layers. The system leverages **Svelte 5 (Runes)** for reactive UI management and **Electron** for a native desktop experience. The system is designed around the metaphor of "Digital Stitching," where the canvas is treated as a **Linen** and the cursor as a **Needle**.

---

## 2. Architectural Pattern: Modular Layered Monolith

Rupa is structured into four distinct layers to ensure scalability and maintainability:

1.  **UI Layer (`src/lib/components/`)**: Purely presentational Svelte components. They consume state and trigger intents.
2.  **State Layer (`src/lib/state/`)**: Reactive data structures using Svelte 5 Runes. They hold the "Source of Truth" but contain no complex business logic.
3.  **Service Layer (`src/lib/engine/services/`)**: The core business logic. Services manipulate state and orchestrate complex operations (e.g., Folio management, Stitching algorithms).
4.  **Engine Layer (`src/lib/engine/`)**: Low-level infrastructure and orchestrators (Input parsing, Audio synthesis, Export algorithms).

---

## 3. Technology Stack

- **Runtime**: Node.js / Electron
- **Frontend Framework**: Svelte 5 (utilizing Runes: `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite / SvelteKit (Static Adapter)
- **Styling**: Tailwind CSS 4.0
- **Input Engines**:
  - **LoomPad**: Keyboard-centric semantic intent mapping.
  - **ShuttlePoint**: Mouse-based positional intent and "Fluid Stitching" mapping.
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

### 4.5 The ShuttlePoint Engine (`src/lib/engine/shuttlepoint.svelte.ts`)

The specialized engine for mouse and pointer interactions.

- **Positional Awareness**: Maps screen-space coordinates to the Linen's grid-space.
- **Fluid Stitching**: Enables organic freehand drawing while respecting the current Stance (Threading, Unravelling, Looming).
- **Gesture Orchestration**: Translates clicks and drags into LoomIntents to maintain consistency with the LoomPad engine.

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

---

## 8. CSS Architecture: SMACSS Pattern

To maintain visual harmony and code maintainability, Rupa Studio follows the **SMACSS** (**S**calable and **M**odular **A**rchitecture for **CSS**) approach, adapted for Svelte 5 and Tailwind CSS:

1.  **Base**: Default styles for HTML elements. In Rupa, these are managed via Tailwind's `@base` layer and global `layout.css`.
2.  **Layout**: Major structural components (e.g., Sidebars, Header, Spindle Panel). These define the skeleton of the Atelier.
3.  **Module**: Reusable, independent UI elements (e.g., `.artisan-tool-btn`, `.stitch-cell`). Modules live within Svelte component `<style>` blocks.
4.  **State**: Describes how modules look in different conditions (e.g., `is-active`, `is-locked`, `is-hidden`). We use Svelte's class toggling for this.
5.  **Theme**: Visual skinning (e.g., Solarized Cream, Artisan Magenta). These are managed via CSS variables and Tailwind configuration.

### 8.1 Implementation Rules

1. Use `@apply` in Svelte `<style>` blocks to compose complex **Module** or **Layout** classes from Tailwind utilities.
2. Prefix shared artisan classes with `artisan-` (e.g., `.artisan-panel`) to avoid naming collisions.
3. Keep state-based classes semantic (e.g., use `.is-stitching` instead of generic `.active`).

---

## 9. Data Layer: Static Configuration (SSoT)

To ensure the studio is easily maintainable and scalable, all static data (Shortcuts, Palettes, Audio frequencies, Onboarding text) is stored in the **Data Layer** using JSON files in `src/lib/config/`.

### 9.1 Single Source of Truth (SSoT)

- **Consistency**: Centralizing data in JSON prevents hardcoded strings from scattering across UI components.
- **Maintainability**: Tuning the "lore" or "vibe" of the studio (e.g., changing sound frequencies or tutorial text) only requires editing a single JSON file.

### 9.2 Access Restrictions

- **Engine/Service Sovereignty**: Only Engines or Services are permitted to import and process JSON configuration files.
- **Normalization**: Engines act as "Data Brokers," responsible for normalizing raw JSON data (e.g., Title Casing shortcut labels) before exposing them to the State or UI layers.
- **Passive UI**: Svelte components must remain "dumb" regarding static data. They should consume processed data from the State or through Engine method calls (e.g., `loompad.getActions()`) rather than importing JSON directly.
