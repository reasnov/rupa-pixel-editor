# Blueprint 01: Core Architecture

## 1. Objective

This blueprint serves as the foundational contract for establishing the **Rupa Pixel Editor** codebase. It defines the structural requirements, licensing, and integration protocols necessary to transition from a conceptual framework to a functional open-source desktop environment.

---

## 2. Repository & Licensing

The project is committed to an open-source philosophy, ensuring transparency and community collaboration.

- **Primary Repository:** `https://github.com/reasnov/rupa-pixel-editor`
- **License:** Open Source (MIT License)
- **Distribution:** Publicly available for modification, distribution, and commercial use under the terms of the MIT license.

---

## 3. Codebase Structure (Industry Standard)

The application must adhere to a modular architecture to separate the rendering layer from the core pixel-processing logic:

```text
rupa-pixel-editor/
├── docs/               # Technical specifications and blueprints
├── src/
│   ├── lib/            # Encapsulated application logic
│   │   ├── components/ # Pure UI components (HUD)
│   │   ├── engine/     # Orchestrators and hardware bridges
│   │   ├── logic/      # Pure stateless algorithms (Pure Math)
│   │   ├── state/      # Reactive data structures (Runes)
│   │   ├── data/       # Static assets (Palettes, Templates)
│   │   ├── config/     # Orchestration settings (JSON)
│   │   └── types/      # TypeScript interfaces
│   └── routes/         # Application shell and routing
├── static/             # Immutable assets and metadata
├── electron/           # Main process and native OS integrations
└── tests/              # Comprehensive test suites
```

---

## 4. Technical Stack Compliance

All implementations must utilize the following core technologies to ensure modern performance and long-term maintainability:

- **Runtime:** Electron (Native Desktop Environment)
- **UI Framework:** Svelte 5 (Utilizing Runes for fine-grained reactivity)
- **Styling Engine:** Tailwind CSS 4.0
- **Language:** TypeScript (Strict mode enabled)
- **Build Tool:** Vite + SvelteKit (Configured with `adapter-static`)
- **Persistence:** IndexedDB (Web Storage) and FileSystem (Native)

---

## 5. Architectural Protocols

### 5.1 Layered Architecture (SOC)

The system enforces a strict 5-layer modular monolith:

1. **UI Layer**: Purely presentational components.
2. **State Layer**: Reactive Source of Truth using Runes.
3. **Service Layer**: Business logic and rule enforcement.
4. **Engine Layer**: Orchestration and hardware normalization.
5. **Logic Layer**: Pure, stateless mathematical algorithms.
6. **Persistence Layer**: 3-tier data management (Config, Static Data, Dynamic Storage).

### 5.2 Technical Naming Standards (Mandatory)

All technical identifiers (variables, functions, classes, files) MUST use industry-standard terminology. Metaphors (e.g., "Washi", "Cups", "Infusions") are strictly limited to user-facing UI labels and i18n strings.

- **Standard Terms**: `Project`, `Canvas`, `Frame`, `Layer`, `Brush`, `Palette`.

### 5.3 Performance & Parallelism

Computationally intensive tasks (Exporting, Tracing, Binary Manipulation) should be offloaded to **Web Workers** to maintain UI responsiveness.

---

## 6. Project Sovereignty

As an Open Source project, **Rupa Pixel Editor** encourages external contributions while maintaining the core philosophy of a keyboard-first, professional pixel environment. All code, including variable names and comments, must be authoritatively in English and use technical terminology.
