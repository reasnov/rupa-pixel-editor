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
├── docs/               # Technical specifications and architectural blueprints
├── src/
│   ├── lib/            # Encapsulated application logic
│   │   ├── components/ # Atomic Svelte UI elements
│   │   ├── engine/     # Pure TypeScript logic (Pixel, Keyboard, Export)
│   │   ├── state/      # Reactive stores via Svelte 5 Runes
│   │   └── types/      # Domain-specific TypeScript interfaces
│   └── routes/         # Application shell and view-routing
├── static/             # Immutable assets and metadata
├── electron/           # Main process entry points and native integrations
└── config/             # Environment-specific configurations
```

---

## 4. Technical Stack Compliance

All implementations must utilize the following core technologies to ensure modern performance and long-term maintainability:

- **Runtime:** Electron (Native Desktop Environment)
- **UI Framework:** Svelte 5 (Utilizing Runes for fine-grained reactivity)
- **Styling Engine:** Tailwind CSS 4.0
- **Language:** TypeScript (Strict mode enabled)
- **Build Tool:** Vite + SvelteKit (Configured with `adapter-static`)

---

## 5. Architectural Protocols

### 5.1 State Management (The Rune Protocol)

Application state must be centralized within `src/lib/state/` using Svelte 5 Runes (`$state`, `$derived`). The code must use technical terms (e.g., `pixels`, `frames`, `layers`). The Barista metaphors (e.g., `etches`, `cups`, `infusions`) are reserved for UI labels provided by the i18n system.

### 5.2 Styling Aesthetic

The visual identity must be established in `src/routes/layout.css`, focusing on a professional "Barista Cream" aesthetic for the user interface. Pixel rendering on the Canvas (Foam) must be configured to disable anti-aliasing (`image-rendering: pixelated`).

### 5.3 Build & Distribution

The application must be configured to output a static site via `adapter-static` to be served locally by Electron. This ensures the application remains 100% offline-first.

---

## 6. Project Sovereignty

As an Open Source project, **Rupa Pixel Editor** encourages external contributions while maintaining the core philosophy of "Digital Brewing" in its user experience. All code, including variable names and comments, must be in English and use industry-standard terminology.
