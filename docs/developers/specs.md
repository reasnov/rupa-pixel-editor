# Technical Specifications: Rupa Pixel Editor

## 1. System Architecture

Rupa follows a **Main-Renderer** architecture, utilizing Svelte 5 for the UI layer and a TypeScript-based core for the "Weaver's Engine."

---

## 2. Input Controller Specification

### 2.1 The Weaver's Map

| Key                    | Action                                   |
| :--------------------- | :--------------------------------------- |
| `Arrow Keys`           | Move the Needle                          |
| `Space`                | Stitch (Place Color)                     |
| `Backspace` / `Delete` | Unstitch (Remove Color)                  |
| `Ctrl + Space`         | Unstitch (Remove Color)                  |
| `Shift` (Hold)         | **Stitch-Flow**: Continuous Threading    |
| `Ctrl + Shift` (Hold)  | **Unstitch-Flow**: Continuous Unraveling |
| `[1-0]`                | Select Dye (Palette)                     |
| `Ctrl + P`             | Open the **Dye Basin** (Color Picker)    |
| `Ctrl + E`             | **Export Project**                       |
| `Ctrl + L`             | **Clear the Linen** (Empty Canvas)       |
| `I` / `Alt + Space`    | **Eyedropper** (Pick Dye from Canvas)    |

---

## 3. Visual Hierarchy (The Artisan's Layers)

...

### 3.3 Dynamic Dye History

The UI must provide a "Used Dyes" section that automatically tracks and displays only the colors currently present on the linen.

- **Source:** Derived from the `pixelData` array.
- **Filtering:** Excludes the empty linen color (#eee8d5).
- **Interaction:** Keyboard selection or clicking a used dye sets it as the active color.

---

## 4. Viewport & Camera Protocol (The Tracking Loom)

To maintain focus during intricate work, the viewport follows the Needle (cursor) dynamically.

- **Cursor-Centric Tracking:** The grid must automatically pan to keep the `activeCell` centered within the viewport.
- **Zoom Axis:** Zooming operations (`zoomLevel`) must use the `activeCell` as the focal point, ensuring the user never loses sight of their current stitch.
- **Visual Guides:** Primary axes intersect at the grid center. Secondary guide lines are rendered every **8 tiles** from the center to provide an 8-bit rhythmic structure.
- **Smooth Transition:** Viewport movement should be near-instantaneous but calculated to keep the needle as the "fixed point" of the composition.

## 5. The Pattern Book (Command Palette)

To fulfill the keyboard-centric promise, a centralized command interface is provided.

- **Trigger:** `Ctrl + K` (Catalog) to open the palette.
- **Functionality:**
  - Fuzzy search for studio actions (e.g., "Export PNG", "Reset Zoom", "Toggle Flow").
  - Associated keyboard shortcuts displayed next to each action.
- **Navigation:** `ArrowUp`/`Down` to select, `Enter` to execute, `Esc` to close.

---

## 6. Export Engine

The Export engine converts the digital linen into permanent artifacts.

- **SVG (Vector Tapestry):** A mathematically perfect representation of the stitch pattern.
- **PNG (Linen Print):** A high-resolution raster export with preserved pixel sharpness.
