# Blueprint 02: Palette & Export Engine

## 1. Objective

This blueprint serves as the technical contract for expanding **Rupa Pixel Editor** from a monochrome environment to a multi-color workspace. It defines the protocols for palette (Ingredients) management and the implementation of high-fidelity export (Service) engines.

---

## 2. Palette System Protocol

The application must support a dynamic palette system that allows users to switch colors without breaking the keyboard-centric workflow.

- **State Integration:** The `activeColor` (The Flavor) and `palette` (The Ingredients) array must be managed as Svelte 5 Runes within `src/lib/state/editor.svelte.ts`.
- **Keyboard Binding:** Numeric keys `[1-9]` and `0` are reserved for instant palette selection.
- **Visual Representation:** A dedicated UI component (`ColorPalette`) must display the available colors.
- **Data Persistence:** Initial implementation will provide a hardcoded professional palette laid out in a logical sequence.

---

## 3. Viewport & Zoom Protocol

To facilitate work on high-resolution grids, the application must provide a responsive zooming mechanism.

- **State Integration:** A `zoomLevel` (Focus Level) rune must be established in `StudioState` to track magnification.
- **Keyboard Binding:** `+` / `-` keys for zooming and `Ctrl+0` to reset.
- **Implementation:** Zooming is handled via CSS transformations on the Canvas (Foam) element.

---

## 4. Typography & Visual Identity Protocol

The UI must reinforcement the "Barista Café" identity while maintaining technical precision.

- **Font Specification:** UI text utilizes high-quality Monospace and Serif fonts.
- **Primary Color Palette:** Solarized-inspired palette with "Barista Magenta" as the brand accent.

---

## 5. Interaction Hierarchy Protocol

The application strictly follows a **Keyboard-Primary, Mouse-Optional** hierarchy.

- **Technical Consistency:** Mouse interactions must stay synchronized with the `cursorPos` (Etcher Position) managed in `CursorState`.

---

## 6. Color Selection Protocol

Beyond the predefined palette, users can select any hex color using the `ColorPicker` (Flavor Basin).

- **Technical Implementation:** Uses `ColorLogic` (`src/lib/engine/color.ts`) to process HSLA and HEX conversions.

---

## 7. Export Engine Specifications (Motion & Service)

The export system transforms reactive grid data into standard formats.

### 3.1 SVG Engine (Vector Output)

- **Technical Detail:** Iterates through pixel data and generates optimized XML.
- **Location:** `src/lib/engine/export.ts`.

### 3.2 Raster Engine (Image Output)

- **Technical Detail:** Utilizes HTML5 Canvas for high-fidelity PNG/JPG/WebP generation.
- **Location:** `src/lib/engine/export.ts`.

---

## 8. Open Source Compliance

All internal logic must be documented using standard technical terms to allow for community-driven optimization of the core engines.
