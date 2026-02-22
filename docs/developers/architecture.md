# Architecture Documentation: Rupa Pixel Editor

## 1. Executive Summary

**Rupa Pixel Editor** is a specialized desktop environment for pixel art, built with a "Keyboard-First, Mouse-Friendly" philosophy. The architecture follows a **Modular Layered Monolith** pattern, ensuring high cohesion within functional modules while maintaining a strict separation of concerns across technical layers. The system is designed around the identity of a **Japanese Roadside Cafe x Retro 8-bit Aesthetic**. The canvas is treated as **The Washi** (or Moss), and the tool as **The Artisan's Brush** (the Cursor).

---

## 2. Architectural Pattern: Modular Layered Monolith

Rupa Pixel Editor is structured into five distinct layers to ensure scalability and maintainability:

1.  **UI Layer (`src/lib/components/`)**: Purely presentational Svelte components (HUD). They consume state and trigger intents from the **Roadside Sanctuary**.
2.  **State Layer (`src/lib/state/`)**: Reactive data structures using Svelte 5 Runes (The Atelier). They hold the "Source of Truth" for the chronicles being woven.
3.  **Service Layer (`src/lib/engine/services/`)**: The **Business Logic & Rules** container. Services manage state transitions, project-specific rules, and orchestrate complex workflows (e.g., Chronicle preservation, Ingredient management).
4.  **Engine Layer (`src/lib/engine/`)**: The **Orchestrator & Entry-point**. Handles hardware bridges (Input, 8-bit Audio, Nature Ambience), input normalization, and high-level system coordination.
5.  **Logic Layer (`src/lib/logic/`)**: **Pure, stateless algorithms**. Contains mathematical calculations and complex processing logic (Geometry, Color, Path, Rendering, Sorting, Filtering, Binary Manipulation).

---

## 3. Technology Stack

- **Runtime**: Node.js / Electron
- **Frontend Framework**: Svelte 5 (utilizing Runes: `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite / SvelteKit (Static Adapter)
- **Styling**: Tailwind CSS 4.0 (Evergreen-Retro Palette)
- **Audio**: Web Audio API (Low-fi Triangle/Square waves)
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
- **Explicit Imports**: Provides the `__()` function for component-level translations. To ensure better error tracking and type safety, this function must be imported manually in every component where it is used.
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
- **Frame Sidebar (Left)**: Management of **Frames** (Cups) and **Layers** (Infusions). Includes the **Minimap** (Surveyor's Glass) at the top and support for Drag-and-Drop.
- **Inspector Sidebar (Right)**: Property panels for **Color** (Flavor) selection, history, and cursor statistics.
- **Properties Panel (Contextual)**: Specialized panel for fine-tuning **Infusion** (Layer) properties like opacity and blend modes.
- **Status Footer (Bottom)**: Houses the **TechLedger** with modular indicators for Modes, Working Time, and Ambiance status.

### 5.2 The Camera Protocol

Viewport movement is achieved by applying CSS transforms to the **Canvas**. The system ensures that zooming focal points are always centered on the current `cursorPos`, maintaining the artist's focus.

---

## 6. Interaction Protocol: The Unified Intent Gateway

To maintain architectural integrity and ensure consistent side-effects (Audio, History), **Rupa** follows a strict gateway protocol:

1.  **UI as a Consumer:** Svelte components may freely read from the **State Layer** to display information.
2.  **Intent Gateway:** UI components **MUST NOT** trigger logic or mutate state directly. They must call methods on the **Engine Layer** (for hardware/orchestration) or the **Service Layer** (for business rules).
3.  **Side-Effect Sovereignty:** Side-effects like sound (`audio.ts`) or undo/redo (`history.ts`) are managed exclusively within the Gateway (Engine/Service). This ensures the "Barista's Rhythm" is consistent across all input methods (Keyboard, Pointer, UI).
4.  **Logic Isolation:** The **Logic Layer** is never called directly by the UI. It is a tool used by Engines and Services to perform heavy calculations.

---

## 7. Data Flow

`Keyboard/Pointer Event` -> `Engine (Normalization)` -> `ActionIntent` -> `Service (Business Rules)` -> `State Mutation (Runes)` -> `UI Reactivity`.

---

## 8. Performance & Integrity

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

## 9. Data & Persistence Layer

To ensure the application is easily maintainable, scalable, and resilient, Rupa categorizes data into three distinct tiers:

### 9.1 Static Configuration (`src/lib/config/`)

Contains orchestration settings, keyboard shortcuts, UI themes, and onboarding text stored as JSON.

- **Role**: Defines the "lore" and behavior of the studio.
- **Access**: Only Engines/Services. UI consumes processed data from State.

### 9.2 Pure Data Assets (`src/lib/data/`)

Contains heavy, read-only datasets such as default color palettes, lookup tables, and project templates.

- **Role**: Provides the raw "ingredients" for the editor.
- **Access**: Accessible by Logic, Services, and Engines for processing.

### 9.3 Dynamic Persistence (User Data)

Handles the "Source of Truth" for user creations across different environments.

- **Electron (Native)**: Direct File System (FS) access for `.rupa` project files.
- **Web/Preview (IndexedDB)**: Browser-based storage for autosaves and temporary session state.
- **Metadata**: Tracks `lastSaved`, `usageMinutes`, and versioning.
