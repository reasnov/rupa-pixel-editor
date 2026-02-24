# Development Conventions: Rupa Pixel Editor

To maintain the quality and consistency of the **Editor**, all developers must adhere to these established conventions, strictly following the **Core Construction Philosophy (3S)**.

---

## 1. The 3S Standards (S3)

1.  **Secure (S1)**:
    - Treat all external input (file imports, clipboard data, user-provided values) as untrusted.
    - Sanitize and validate all data at boundaries before it enters the **Logic** or **State** layers.
    - Never expose sensitive environment details in error messages or logs.
2.  **Sustain (S2)**:
    - **Sync or Sink**: Code changes without corresponding documentation updates are incomplete.
    - Adhere to the **Aesthetic-Natural** principle: focus on structural calmness, minimal abstraction, and high comprehensibility.
    - Every public method and service MUST include descriptive JSDoc for intent, parameters, and behavior.
3.  **Scalable (S3)**:
    - Design features to handle industrial-scale projects (e.g., large canvas sizes, high frame counts) without performance degradation.
    - Maintain modularity to allow easy refactoring or replacement of individual services.
    - Optimize reactive projections (Svelte 5 Runes) to avoid unnecessary re-renders or computation.

---

## 2. Architectural Integrity (SOC)

Rupa Pixel Editor follows a strict **Separation of Concerns (SOC)** across its layered monolith:

- **Components**: Must remain "dumb." They should only display data from state and call methods on the `services` or `editor` objects. No complex logic should live in `.svelte` files.
- **State**: Classes in `src/lib/state/` should only contain `$state` and `$derived` properties. They are data holders. UI reads state but **NEVER** mutates it directly.
- **Services**: All **Business Logic & Rules** MUST live in `src/lib/engine/services/`. This is the only place where project state transitions and rules are enforced.
- **Engines**: The **Orchestrators & Entry-points** that bridge hardware (Input, Audio) to application logic and normalize events.
- **Logic**: All **Pure, Stateless Algorithms** (math, sorting, filtering, rendering, binary manipulation) MUST live in `src/lib/logic/`. **UI MUST NEVER call Logic modules directly.** Logic is a private resource for Engines and Services.
- **Persistence Layer**: Manages the lifecycle of static "ingredients", studio configuration, and dynamic user creations. Access to dynamic data (LocalStorage/IndexedDB) is handled exclusively through the `PersistenceService`. No direct file system or storage access from components is permitted.

---

## 3. Data & Resource Access

To prevent "spaghetti" data flow, adhere to these access rules:

- **Static Config (`src/lib/config/`)**: Orchestration and configuration data. Only Engines and Services may import these.
- **Pure Data (`src/lib/data/`)**: Algorithmic ingredients and heavy read-only datasets. May be imported by Logic, Services, or Engines.
- **Dynamic Persistence (User Data)**: Managed via the `PersistenceService` (FileSystem/IndexedDB/LocalStorage). Never access storage directly from UI components.
- **Manual Imports**: To ensure traceability and robust error tracking, **NEVER** use global variables or functions. Always explicitly import the `services` coordinator, the `editor` state, and the `__` translation helper in every file where they are required.

---

## 4. Coding Standards

### 4.1 Svelte 5 Runes & Snippets

- Always use **Runes** (`$state`, `$derived`, `$effect`, `$props`, `$bindable`).
- Favor `$derived.by` for complex reactive projections to keep logic encapsulated.
- Use **Snippets** (`{#snippet ...}`) for layout-level components to ensure clean separation between containers and content.
- Use `untrack()` within `$effect` when registering/unregistering listeners or global stacks to avoid circular reactivity.

### 4.2 Layout & Shell

- All major UI parts must be wrapped within the **AppShell** components (`AppHeader`, `AppSidebar`, `AppViewport`, `AppFooter`, `AppOverlay`).
- Maintain strict **Z-index boundaries**:
  - Viewport/Canvas: `z-10` to `z-30`.
  - Sidebars/Header/Footer: `z-30`.
  - Overlays: `z-[500]`.
- Use `pointer-events-none` on overlay roots to prevent interaction blocking.

### 4.3 TypeScript & Metadata

- **English-Only**: All code, comments, and documentation must be in English.
- **Type Safety**: Avoid `any`. Define interfaces for all data structures (e.g., `HistoryAction`, `ColorHex`).
- **DocBlocks**: Every public method in Services or Engines must include a professional JSDoc block describing intent and parameters.

### 4.4 Naming Conventions

- **Technical Naming (No Metaphors)**: All technical identifiers—including file names, directory names, class names, function names, variable names, and state properties—MUST use industry-standard technical terminology. Do not use metaphors in the codebase (e.g., use `Project`, not `Chronicle`).
- **Color Names Exception**: Naming for colors (e.g., in CSS variables, Tailwind classes, or color constants) is exempt from the "no metaphor" rule and can be named freely (e.g., `washi-white`, `lantern-gold` are acceptable).
- **UI Strings (Metaphors Allowed)**: Metaphors (e.g., "Washi", "Servings", "Ingredients") ARE allowed and encouraged for user-facing UI labels and i18n strings to preserve the **Roadside Sanctuary** aesthetic.
- **Refactoring Requirement**: If a metaphorical name is found in a technical context (excluding colors), it must be refactored to its technical equivalent immediately.
- **Standard Technical Terms**:
  - `Project` instead of `Chronicle`
  - `Canvas` instead of `Washi` or `Moss`
  - `Frame` instead of `Serving` or `Cup`
  - `Layer` instead of `Ingredient` or `Infusion`
  - `Brush` instead of `Artisan's Brush`
  - `Color` instead of `Pigment` or `Flavor`
  - `Palette` instead of `Recipe` or `Pigment Station`
  - `Export` instead of `Hantaran Tray` or `Artifact`
  - `Command Palette` instead of `Catalog` or `Sanctuary Records`
- **State Modules**: Suffix with `State` (e.g., `CanvasState`).
- **Services**: Suffix with `Service` (e.g., `ProjectService`).
- **Components**: PascalCase (e.g., `ColorPalette.svelte`).
- **i18n Keys**: Use semantic, hierarchical technical keys (e.g., `project.save` instead of `hud.actions.save_project`).

### 4.5 Internationalization (i18n)

- **No Hardcoded Strings**: All UI text must use the `__({ key })` function or `__('namespace:key')`.
- **Explicit Imports**: Always import `__` from `$lib/state/i18n.svelte.ts`. **DO NOT** rely on global variables for translation.
- **Translation Files**: Located in `src/lib/lang/{locale}/*.json`.
- **Locale Standard**: The English (`en`) locale is the primary source of truth for all **Roadside Sanctuary** terminology.

---

## 5. UI & UX Standards

### 5.1 Keyboard-First

- Every new feature MUST be reachable via a keyboard shortcut.
- All actions must be registered in the **Artisan's Catalog** (Command Palette).

### 5.2 Visual Consistency: Japanese Roadside Cafe x Retro 8-bit

- Use the **Evergreen-Retro Design System**:
  - Background: Washi White (`#fdf6e3`) via `--color-washi-white`.
  - Primary: Deep Forest Green (`#3a5a40`) via `--color-deep-forest`.
  - Highlights: Lantern Gold (`#b58900`) via `--color-lantern-gold`.
  - Borders: Aged Oak (`#b08968`) via `--color-aged-oak` or Stone Path (`#dad7cd`) via `--color-stone-path`.
- **8-bit Aesthetic**: Ensure all Canvas rendering and UI icons use `image-rendering: pixelated`.
- **Lo-fi Feel**: Feedback should be tactile and "clicky," mirroring 8-bit hardware.

### 5.3 Theme Governance (Light/Dark Mode)

To ensure seamless transitions between **Evergreen-Retro** (Light) and **Midnight Sanctuary** (Dark), follow these implementation rules:

1.  **Functional Aliases Only**: NEVER use concrete color variables like `--color-washi-white` or `--color-night-indigo` directly in component styles. ALWAYS use functional aliases:
    - `--color-canvas-bg`: For main work areas.
    - `--color-panel-bg`: For HUD and sidebar backgrounds.
    - `--color-text-main`: For primary content and icons.
    - `--color-ui-accent`: For active states and focus rings.
2.  **Theme Trigger**: The theme is controlled by the `data-theme` attribute on the `<html>` element. CSS overrides for Dark Mode MUST be nested under `:root[data-theme="dark"]`.
3.  **VFX Adaptation**: Visual effects (SVG filters, Grain, CRT) must react to the theme:
    - Reduce grain opacity in Dark Mode to prevent visual noise.
    - Shift scanline colors to darker, muted tones.
4.  **Reactivity**: When implementing custom canvas drawing or WebGL logic, ensure the theme state is reactive via `editor.studio.theme` to trigger re-renders.

---

## 6. Workflow

### 6.1 Modularity

- If a component grows too large, split it into smaller pieces in a sub-directory (e.g., `hud/ledger/`).
- Use **Context API** for deeply nested state access if global imports become a bottleneck.

### 6.2 Quality Gate

- Run `npm run check` and `npm run lint` before every commit.
- Document every major architectural change in a new **Blueprint**.
