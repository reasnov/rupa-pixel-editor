# Development Conventions: Rupa Studio

To maintain the quality and consistency of the **Atelier**, all developers must adhere to these established conventions.

---

## 1. Architectural Integrity (SOC)

Rupa follows a strict **Separation of Concerns (SOC)** across its layered monolith:

- **Components**: Must remain "dumb." They should only display data from state and call methods on the `shuttle` or `atelier` objects. No complex logic should live in `.svelte` files.
- **State**: Classes in `src/lib/state/` should only contain `$state` and `$derived` properties. They are data holders.
- **Services**: All business logic (loops, math, array manipulations) MUST live in `src/lib/engine/services/`.
- **Engines**: Orchestrators that bridge hardware (Input, Audio) to application logic.

---

## 2. Coding Standards

### 2.1 Svelte 5 Runes

- Always use **Runes** (`$state`, `$derived`, `$effect`, `$props`, `$bindable`).
- Favor `$derived.by` for complex reactive projections to keep logic encapsulated.
- Use `untrack()` within `$effect` when registering/unregistering listeners or global stacks to avoid circular reactivity.

### 2.2 TypeScript & Metadata

- **English-Only**: All code, comments, and documentation must be in English.
- **Type Safety**: Avoid `any`. Define interfaces for all data structures (e.g., `HistoryAction`, `ColorHex`).
- **DocBlocks**: Every public method in Services or Engines must include a professional JSDoc block describing intent and parameters.

### 2.3 Naming Conventions

- **State Modules**: Suffix with `State` (e.g., `LinenState`).
- **Services**: Suffix with `Service` (e.g., `FolioService`).
- **Components**: PascalCase (e.g., `DyeBasin.svelte`).
- **Artisan Terms**: Use artisan terminology in UI labels but maintain technical clarity in variable names (e.g., `usageMinutes` vs "Working Time").

---

## 3. UI & UX Standards

### 3.1 Keyboard-First

- Every new feature MUST be reachable via a keyboard shortcut.
- Avoid using shortcuts that conflict with common OS/Browser commands (e.g., `Ctrl+W`, `Ctrl+R`).
- All actions must be registered in the **Pattern Catalog** (Command Palette).

### 3.2 Visual Consistency

- Use the **Artisan Design System**:
  - Background: Natural Paper (`#fdf6e3`).
  - Brand: Artisan Magenta (`#d33682`).
  - Borders: Grid Border (`#eee8d5`).
- Ensure all Linen rendering uses `image-rendering: pixelated`.

---

## 4. Workflow

### 4.1 Modularity

- If a component grows too large, split it into smaller pieces in a sub-directory (e.g., `hud/ledger/`).
- Use **Context API** for deeply nested state access if global imports become a bottleneck.

### 4.2 Quality Gate

- Run `npm run check` and `npm run lint` before every commit.
- Document every major architectural change in a new **Blueprint**.
