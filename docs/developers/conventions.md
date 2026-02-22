# Development Conventions: Rupa Pixel Editor

To maintain the quality and consistency of the **Editor**, all developers must adhere to these established conventions.

---

## 1. Architectural Integrity (SOC)

Rupa Pixel Editor follows a strict **Separation of Concerns (SOC)** across its layered monolith:

- **Components**: Must remain "dumb." They should only display data from state and call methods on the `services` or `editor` objects. No complex logic should live in `.svelte` files.
- **State**: Classes in `src/lib/state/` should only contain `$state` and `$derived` properties. They are data holders. UI reads state but **NEVER** mutates it directly.
- **Services**: All **Business Logic & Rules** MUST live in `src/lib/engine/services/`. This is the only place where project state transitions and rules are enforced.
- **Engines**: The **Orchestrators & Entry-points** that bridge hardware (Input, Audio) to application logic and normalize events.
- **Logic**: All **Pure, Stateless Algorithms** (math, sorting, filtering, rendering, binary manipulation) MUST live in `src/lib/logic/`. **UI MUST NEVER call Logic modules directly.** Logic is a private resource for Engines and Services.

---

## 2. Data & Resource Access

To prevent "spaghetti" data flow, adhere to these access rules:

- **Static Config (`src/lib/config/`)**: Orchestration data. Only Engines and Services may import these.
- **Pure Data (`src/lib/data/`)**: Algorithmic ingredients. May be imported by Logic, Services, or Engines.
- **Dynamic Persistence**: Managed via the `PersistenceService`. Never access `localStorage` or `fs` directly from UI components.
- **Manual Imports**: To ensure traceability and robust error tracking, **NEVER** use global variables or functions. Always explicitly import the `services` coordinator, the `editor` state, and the `__` translation helper in every file where they are required.

---

## 3. Coding Standards

### 2.1 Svelte 5 Runes

- Always use **Runes** (`$state`, `$derived`, `$effect`, `$props`, `$bindable`).
- Favor `$derived.by` for complex reactive projections to keep logic encapsulated.
- Use `untrack()` within `$effect` when registering/unregistering listeners or global stacks to avoid circular reactivity.

### 2.2 TypeScript & Metadata

- **English-Only**: All code, comments, and documentation must be in English.
- **Type Safety**: Avoid `any`. Define interfaces for all data structures (e.g., `HistoryAction`, `ColorHex`).
- **DocBlocks**: Every public method in Services or Engines must include a professional JSDoc block describing intent and parameters.

### 2.3 Naming Conventions

- **State Modules**: Suffix with `State` (e.g., `CanvasState`).
- **Services**: Suffix with `Service` (e.g., `ProjectService`).
- **Components**: PascalCase (e.g., `ColorPalette.svelte`).
- **Artisan Metaphors**: Use Japanese Roadside Cafe terminology in UI labels (via i18n) but maintain technical clarity in variable names:
  - `frames` → **Servings**
  - `layers` → **Ingredients**
  - `project` → **Chronicle**
  - `canvas` → **Washi** (or Moss)
  - `brush` → **The Artisan's Brush**
- **i18n Keys**: Use semantic, hierarchical keys based on the **Roadside Sanctuary** lore. Avoid generic technical keys.

### 2.4 Internationalization (i18n)

- **No Hardcoded Strings**: All UI text must use the `__({ key })` function.
- **Explicit Imports**: Always import `__` from `$lib/state/i18n.svelte.js`. **DO NOT** rely on global variables for translation.
- **Translation Files**: Located in `src/lib/lang/{locale}/*.json`.
- **Locale Standard**: The English (`en`) locale is the primary source of truth for all **Roadside Sanctuary** terminology.

---

## 3. UI & UX Standards

### 3.1 Keyboard-First

- Every new feature MUST be reachable via a keyboard shortcut.
- All actions must be registered in the **Artisan's Catalog** (Command Palette).

### 3.2 Visual Consistency: Japanese Roadside Cafe x Retro 8-bit

- Use the **Evergreen-Retro Design System**:
  - Background: Washi Paper (`#fdf6e3`).
  - Primary: Deep Forest Green (`#3a5a40`) or Evergreen (`#344e41`).
  - Highlights: Lantern Gold (`#b58900`) for the "Cafe Glow."
  - Borders: Aged Wood (`#eee8d5`) or Stone Path (`#dad7cd`).
- **8-bit Aesthetic**: Ensure all Canvas rendering and UI icons use `image-rendering: pixelated`.
- **Lo-fi Feel**: Feedback should be tactile and "clicky," mirroring 8-bit hardware.

---

## 4. Workflow

### 4.1 Modularity

- If a component grows too large, split it into smaller pieces in a sub-directory (e.g., `hud/ledger/`).
- Use **Context API** for deeply nested state access if global imports become a bottleneck.

### 4.2 Quality Gate

- Run `npm run check` and `npm run lint` before every commit.
- Document every major architectural change in a new **Blueprint**.
