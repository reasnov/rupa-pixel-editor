# Blueprint: 02-Palette & Export Engine

## 1. Objective

This blueprint serves as the technical contract for expanding **Rupa Pixel Editor** from a monochrome environment to a multi-color workspace. It defines the protocols for palette management and the implementation of high-fidelity export engines (SVG and Raster), ensuring the "Digital Stitching" output is professional and versatile.

---

## 2. Palette System Protocol

The application must support a dynamic palette system that allows users to switch colors without breaking the keyboard-only workflow.

- **State Integration:** The `activeColor` and `palette` array must be managed as Svelte 5 Runes within `src/lib/state/editor.svelte.ts`.
- **Keyboard Binding:** Numeric keys `[1-9]` and `0` are reserved for instant palette selection.
- **Visual Representation:** A dedicated UI component (`PaletteBar`) must display the available colors, with a distinct "Active Indicator" to show the current selection.
- **Color Persistence:** Initial implementation will provide a hardcoded professional palette (e.g., retro-inspired), laid out in a logical sequence for easy memorization.

---

## 3. Viewport & Zoom Protocol

To facilitate work on high-resolution grids, the application must provide a responsive zooming mechanism controlled via keyboard.

- **State Integration:** A `zoomLevel` rune must be established in `EditorState` to track the current magnification factor.
- **Keyboard Binding:**
  - `+` / `=` : Increase Zoom Level.
  - `-` : Decrease Zoom Level.
  - `0` (with modifier) : Reset Zoom to Default (1:1).
- **Implementation:** Zooming should be handled via CSS transformations or dynamic cell-size scaling. Regardless of the method, the `image-rendering: pixelated` property must be preserved to ensure the grid remains sharp at all magnification levels.
- **Boundaries:** Define a minimum zoom (to fit the screen) and a maximum zoom (for micro-stitching precision).

---

## 4. Typography & Visual Identity Protocol

To ensure the application maintains its "Aesthetic Retro" identity and game-like feel, specific typographic and color standards must be enforced.

- **Font Specification:** All UI text must utilize high-quality Monospace fonts or Pixel-themed typefaces (e.g., 'JetBrains Mono', 'Fira Code', or custom pixel fonts). This reinforces the terminal-like precision of the editor.
- **Primary Color Palette:** Implement the **Retro Green Gradient** as the foundational brand color across all interactive elements.
- **Visual Feedback:** Every keyboard interaction should be accompanied by a subtle visual response (e.g., border color shifts, glow intensity changes) in addition to SFX.

---

## 5. Interaction Hierarchy Protocol

The application strictly follows a **Keyboard-Primary, Mouse-Optional** hierarchy to preserve the "Digital Stitching" intent while allowing for user flexibility.

- **Keyboard Priority:** All new features must be implemented with a dedicated keyboard shortcut before any mouse-driven UI is developed.
- **Optional Mouse Support:** Mouse interactions (click, drag, scroll) are treated as supplemental overlays to the core keyboard engine. They must stay synchronized with the `cursorPos` but should never be the _exclusive_ way to access a feature.
- **Zoom Integration:** While `Scroll Wheel` support is provided for convenience, the `+/-` keys remain the canonical method for viewport control.

---

## 6. Advanced Color Selection Protocol

Beyond the predefined palette, users must have the freedom to select any hex color to expand their creative possibilities.

- **Custom Color Tile:** A special "Rainbow" or "Custom" tile must be added to the end of the `PaletteBar`.
- **Trigger Mechanism:**
  - **Keyboard:** `Ctrl + P` (Palette/Picker) to open the color selection interface.
  - **Mouse:** Click the Custom Tile to open the picker.
- **Native Integration:** Utilize the `<input type="color">` element for initial implementation, allowing the OS-native color picker to handle the selection.
- **State Persistence:** The selected custom color must be temporarily added to the active state and can be re-selected until another custom color replaces it.

---

## 7. Export Engine Specifications

The export system must transform the internal reactive grid data into standard industry formats.

### 3.1 SVG Engine (Vector Output)

- **Protocol:** The engine must iterate through the `pixelData` array and generate a valid XML-based SVG string.
- **Optimization:** Adjacent pixels of the identical color on the same row should ideally be merged into a single `<rect>` or path to minimize file complexity.
- **Precision:** The coordinate system in the SVG must remain 1:1 with the grid to ensure mathematical sharpness.

### 3.2 Canvas Engine (Raster Output)

- **Protocol:** Utilize the HTML5 Canvas API to render the grid at a user-defined scale.
- **Integrity:** Must disable image smoothing (`image-smoothing-enabled: false`) during the render process to prevent blurring of pixel edges.
- **Format:** Support for PNG (lossless) as the primary raster export format.

---

## 4. Architectural Integration

- **Export Service:** A dedicated class `src/lib/engine/export.ts` will handle the conversion logic, keeping the UI components clean of processing overhead.
- **Native Interop:** Utilize Electron's `showSaveDialog` (via IPC) to allow users to select the destination path on their local file system.
- **Modality:** Export triggers must be accessible via keyboard shortcuts (e.g., `Ctrl + E` for Export Menu).

---

## 5. Visual Standards

- **Contrast Preservation:** The UI must ensure that the palette selection is visible regardless of the background color.
- **Export Fidelity:** The final output must exactly match the visual state of the grid, including all "stitched" pixels, while excluding the "Active Cell" cursor from the final render.

---

## 6. Open Source Compliance

All export logic and palette configurations must be fully documented in English to allow for community-driven palette additions and engine optimizations.
