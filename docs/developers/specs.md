# Technical Specifications: Rupa Pixel Editor

## 1. System Architecture
Rupa follows a **Main-Renderer** architecture, utilizing Svelte 5 for the UI layer and a TypeScript-based core for the "Weaver's Engine."

---

## 2. Input Controller Specification

### 2.1 The Weaver's Map
| Key | Action |
| :--- | :--- |
| `Arrow Keys` | Move the Needle |
| `Space` | Stitch (Place Color) |
| `Backspace` / `Delete` | Unstitch (Remove Color) |
| `Ctrl + Space` | Unstitch (Remove Color) |
| `Shift` (Hold) | **Stitch-Flow**: Continuous Threading |
| `Ctrl + Shift` (Hold) | **Unstitch-Flow**: Continuous Unraveling |
| `[1-0]` | Select Dye (Palette) |
| `Ctrl + P` | Open the **Dye Basin** (Color Picker) |
| `Ctrl + E` | **Export Project** |

---

## 3. Visual Hierarchy (The Artisan's Layers)
The application is organized into three distinct visual layers to reinforce the crafting experience.

*   **1. The Canvas:** The 32x32 interactive grid where stitches are placed. It mimics a piece of linen or paper.
*   **2. The Frame:** A solid, rounded container (The Loom) that holds the Canvas. It provides the visual boundary and centering for the Tracking Loom mechanism.
*   **3. The Window:** The overall Studio environment, containing the HUD, the background textures, and the Frame.

### 3.1 Cottagecore Visuals
*   **The Canvas:** A soft background with a linen-like texture and subtle grid.
*   **The Frame:** A thick, white/wooden rounded frame (`artisan-frame`) with soft shadows.
*   **The HUD:** Artisan panels with rounded corners and serif typography.
*   **The Spirit Needle:** A soft, glowing block that floats gently, representing the point of creation.
*   **Color Story:** Primary colors include #fdf6e3 (Old Paper), #859900 (Sage), and #cb4b16 (Terracotta).

### 3.2 Artisan Audio (Synthesized)
*   **Movement:** Soft wooden taps (300Hz Sine).
*   **Stitching:** Gentle bell-like chimes (1200Hz-1500Hz).
*   **Unstitching:** Soft paper or brush-like rustling (Filtered Noise).

## 4. Viewport & Camera Protocol (The Tracking Loom)
To maintain focus during intricate work, the viewport follows the Needle (cursor) dynamically.

*   **Cursor-Centric Tracking:** The grid must automatically pan to keep the `activeCell` centered within the viewport.
*   **Zoom Axis:** Zooming operations (`zoomLevel`) must use the `activeCell` as the focal point, ensuring the user never loses sight of their current stitch.
*   **Smooth Transition:** Viewport movement should be near-instantaneous but calculated to keep the needle as the "fixed point" of the composition.

## 5. The Pattern Book (Command Palette)
To fulfill the keyboard-centric promise, a centralized command interface is provided.
*   **Trigger:** `Ctrl + K` (Catalog) to open the palette.
*   **Functionality:**
    *   Fuzzy search for studio actions (e.g., "Export PNG", "Reset Zoom", "Toggle Flow").
    *   Associated keyboard shortcuts displayed next to each action.
*   **Navigation:** `ArrowUp`/`Down` to select, `Enter` to execute, `Esc` to close.

---

## 6. Export Engine
The Export engine converts the digital linen into permanent artifacts.
*   **SVG (Vector Tapestry):** A mathematically perfect representation of the stitch pattern.
*   **PNG (Linen Print):** A high-resolution raster export with preserved pixel sharpness.