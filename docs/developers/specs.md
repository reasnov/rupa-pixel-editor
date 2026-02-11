# Technical Specifications: Rupa Pixel Editor

## 1. System Architecture
Rupa Pixel Editor follows a **Main-Renderer** architecture via Electron, utilizing Svelte 5 for the UI layer and a TypeScript-based core for business logic.

### 1.1 Process Responsibilities
*   **Main Process (Electron):** Handles native window management, file system access (I/O), and OS-level menu configurations.
*   **Renderer Process (Svelte 5):** Handles the drawing grid, keyboard event processing, state management (Runes), and real-time UI updates.

---

## 2. Data Structures & State Management

### 2.1 Grid Data Model
The canvas is represented as a flat array or a 2D matrix of pixel objects.
```typescript
type ColorHex = string; // e.g., "#FF0000"

interface Pixel {
    color: ColorHex;
    alpha: number; // 0 to 1
}

interface GridState {
    width: number;
    height: number;
    data: ColorHex[]; // Flat array for performance: index = y * width + x
}
```

### 2.2 Svelte 5 Runes Integration
*   **`$state` (Grid):** The `data` array will be a reactive state. Updates to a single index should be fine-grained.
*   **`$state` (Cursor):** Tracks the `activeCell` coordinates `{ x: number, y: number }`.
*   **`$derived` (View):** Calculates the rendered pixel size based on the window dimensions and grid resolution.
*   **`$effect`:** Used for syncing the grid state to the HTML5 Canvas for preview or export.

---

## 3. Keyboard Controller Specification

### 3.1 Input Mapping
| Key | Action |
| :--- | :--- |
| `ArrowUp` | Move Cursor Up |
| `ArrowDown` | Move Cursor Down |
| `ArrowLeft` | Move Cursor Left |
| `ArrowRight` | Move Cursor Right |
| `Space` | Toggle Color (Stitch) |
| `Ctrl + Space` / `Backspace` / `Delete` | Clear Pixel (Unstitch) |
| `Shift` (Hold) | Activate **Stitch-Flow** (Auto-color on move) |
| `Ctrl + Shift` (Hold) | Activate **Unstitch-Flow** (Auto-delete on move) |
| `[1-9]` | Select Palette Color |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

### 3.2 Stitch-Flow Logic
When the `Shift` modifier is active, any movement command (`moveCursor`) must trigger the `writePixel` function for the new coordinates before the frame renders.

---

## 4. SFX Engine (Tactile Feedback)
To reinforce the "Digital Stitching" experience, the application uses a synthesized audio engine via Web Audio API.
*   **Move SFX:** Low-frequency sine wave (150Hz) for cursor movement.
*   **Stitch SFX:** Square wave "clack" (400Hz) to simulate placing a brick.
*   **Unstitch SFX:** Noise-based "crunch" to simulate destroying a brick.

---

## 5. Undo/Redo Mechanism
A **Command Pattern** approach is used to manage history.
*   **History Stack:** Two stacks (`undoStack`, `redoStack`) storing `HistoryAction` objects.
*   **Action Object:**
    ```typescript
    interface HistoryAction {
        index: number;
        oldColor: string;
        newColor: string;
    }
    ```
*   **Limit:** Maximum of 500 actions stored in memory.

---

## 5. File I/O & Exporting

### 5.1 Native Format (.rupa)
A JSON-based format containing:
*   Project metadata (name, author).
*   Grid dimensions.
*   Base64 or compressed array of pixel data.
*   Palette configuration.

### 5.2 Export Engines
*   **SVG Engine:** Iterates through the grid and generates `<rect>` elements. Identical adjacent colors should ideally be merged into single paths to optimize file size.
*   **Canvas Engine:** Uses `ctx.putImageData` or `ctx.fillRect` for rapid rasterization to PNG/JPG.

---

## 6. Performance Targets
*   **Input-to-Render Latency:** < 16.6ms (60 FPS).
*   **Grid Capacity:** Support up to 256x256 pixels without UI degradation.
*   **Initialization Time:** < 2 seconds from Electron launch to interactive grid.

---

## 7. Security Considerations
*   **Context Isolation:** Enabled in Electron to prevent renderer access to Node.js internals.
*   **Inter-Process Communication (IPC):** Strict allow-list for `ipcMain` and `ipcRenderer` communication.
*   **Sanitization:** All imported `.rupa` or palette files must be validated against a schema before processing.
