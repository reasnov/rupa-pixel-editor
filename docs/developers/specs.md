# Technical Specifications: Rupa Pixel Editor (Atelier)

## 1. Grid Mechanics
- **Linen Size:** Default 32x32.
- **Coordinate System:**
  - **Internal:** Zero-indexed flat array (`y * width + x`).
  - **Display (HUD):** Center-relative (Cartesian). 
    - For even dimensions, there is no zero-row/column (jumps from -1 to 1).
    - For odd dimensions, the center is (0,0).
- **Stitch Data:** Hex color strings (`ColorHex`). 
- **Empty State:** Studio-specific cream `#eee8d5`.

## 2. LoomPad Intent Schema
Every interaction is mapped to a `LoomIntent` to ensure semantic consistency.

### 2.1 Navigation Intents
- `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`
- `JUMP_HOME`: Reset position to center.

### 2.2 Action Intents
- `STITCH`: Apply dye.
- `UNSTITCH`: Remove dye.
- `UNDO`, `REDO`: History traversal.

### 2.3 Flow Intents (Sustained)
- `FLOW_THREAD`: Enable threading (Draw Flow).
- `FLOW_UNRAVEL`: Enable unravelling (Erase Flow).
- `FLOW_LOOM`: Enable looming (Selection).
- `FLOW_PICK`: Enable dye picking (Eyedropper).

### 2.4 UI Intents
- `OPEN_CATALOG`: Show Command Palette.
- `OPEN_BASIN`: Show Color Picker.
- `OPEN_CRATE`: Show Export Menu.

## 3. Visual Identity & Design System
- **Core Aesthetic:** Cottagecore / Retro-Artisan.
- **Primary Brand Color:** Artisan Magenta `#D33682`.
- **Background:** Natural Paper texture with Solarized Base 3 (`#fdf6e3`).
- **Typography:** 
  - **Brand/Headers:** Tiny5 (Pixel-art font).
  - **Serif/Display:** EB Garamond.
  - **Body/System:** Lora.
- **Rendering:** `image-rendering: pixelated` must be applied to all linen views to maintain sharpness.

## 4. Performance Requirements
- **Frame Budget:** < 16.6ms per frame (60 FPS) for all UI updates and movements.
- **Export Fidelity:**
  - **SVG:** Recursive rect-merging required to minimize path count.
  - **PNG:** Scaling must use nearest-neighbor interpolation (no blurring).
- **History:** Command Pattern stack depth of 500 actions.

## 5. File Formats
- **Pattern Book (.rupa):** JSON-based schema storing:
  - Version metadata.
  - Linen dimensions.
  - Palette array.
  - Flat stitch array.
  - Creation/Modification timestamps.
