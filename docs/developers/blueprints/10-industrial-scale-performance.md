# Blueprint 10: Industrial Scale & Performance (The Steam Pump)

## 1. Objective

Blueprint 10 addresses the technical and ergonomic challenges of working on high-resolution canvases (1024px and beyond). It introduces **Incremental Memory Management**, **Tactile Panning**, **Scalable Brush Engines**, **Scanline Algorithms**, and **Layer Folders** to ensure that Rupa remains fluid and meditative even at an industrial scale.

---

## 2. Panning & Viewport (The Hand Crank)

Navigating large-scale foam requires free-form movement beyond simple coordinate steps.

### 2.1 Hand Tool (Panning)

- **Orchestration:** `Space (Held) + Drag` (Mouse) atau `H` (Toggle Hand Tool).
- **Implementation:** Menggunakan `'PAN'` Mode di dalam `ModeEngine`. Saat aktif, `PointerEngine` menghitung delta gerakan kursor dan memperbarui `panOffset` di dalam `StudioState`. Kanvas dirender menggunakan transform CSS untuk pergeseran halus yang diakselerasi GPU.
- **Reset:** Tekan `Alt + Backspace` (`RESET_VIEWPORT`) untuk mengembalikan fokus (Zoom) dan posisi (Pan) ke kondisi awal.

### 2.2 Minimap (The Surveyor's Glass)

- **UI:** A floating window showing the entire project with a Magenta rectangle indicating the active viewport.

---

## 3. Incremental Rendering Engine (The Steam Pump)

To avoid the performance cost of cloning million-element arrays (`[...pixels]`), Rupa will transition to a **Dirty-Region Sync** model.

### 3.1 The Pulse Protocol

- **Logic:** The active Layer will maintain its data in a non-reactive buffer for high-speed writing.
- **Reactivity:** A new `renderPulse` rune in `CanvasState` will be incremented by services after modifying the buffer.
- **Efficiency:** The Canvas render effect will only trigger when the `renderPulse` changes, preventing Svelte from diffing millions of array elements.

---

## 4. Scalable Construction (Industrial Brushes)

### 4.1 Macro Brushes

- **Size Limit:** Expanded to **100px**.
- **Optimization:** Large brushes (>20px) will use a scanline-filling algorithm to calculate points instead of individual point iteration to prevent UI thread blocking.

### 4.2 Texture & Airbrush (The Mist)

- **Function:** Randomized pixel scattering for creating "Industrial Mist" (noise) over large areas.

---

## 5. Optimized Selection Mastery (The Precision Sieve)

Standard linear search is insufficient for million-pixel selections.

### 5.1 Scanline Flood Fill

- **Algorithm:** Replaces the current Breadth-First-Search (BFS) with a **Scanline Fill** algorithm.
- **Performance:** Reduces the number of queue operations by processing horizontal spans of pixels at once, essential for instant "Magic Wand" selection on large canvases.

---

## 6. Project Architecture: Layer Folders (The Archive)

Organizing complex weaves with hundreds of infusions.

### 6.1 Infusion Groups (Folders)

- **State:** `FrameState.layers` akan direfaktorisasi dari array datar menjadi struktur rekursif yang mendukung objek `LayerGroup`.
- **Rendering:** Logika rendering komposit rekursif untuk meratakan grup menjadi tampilan kanvas akhir.
- **UI:** Indented tree-view di sidebar dengan fungsionalitas "Expand/Collapse".

---

## 7. Updated Shortcut Migration Map (Industrial Edition)

| Feature            | New Intent         | Primary Key       | Group      |
| :----------------- | :----------------- | :---------------- | :--------- |
| **Panning**        | `PAN_VIEWPORT`     | `Space (Held)`    | Navigation |
| **Reset Pan/Zoom** | `RESET_VIEWPORT`   | `Alt + Backspace` | View       |
| **New Group**      | `NEW_LAYER_GROUP`  | `Ctrl + G`        | Layers     |
| **Toggle Hand**    | `TOGGLE_HAND_TOOL` | `h`               | Tools      |

---

## 8. UX Performance Goals

- **Selection Latency:** < 50ms for a 1024x1024 fill.
- **Memory Footprint:** Menggunakan **Uint32Array** dengan format **ABGR (Little-Endian)** untuk penyimpanan piksel. Hal ini memungkinkan penyalinan memori langsung ke `ImageData.data` dan secara signifikan mengurangi penggunaan memori dibandingkan array string.
- **Rendering:** Memanfaatkan `renderPulse` untuk memicu update kanvas hanya saat data berubah, menggunakan `untrack` pada data piksel reaktif untuk menghindari overhead pelacakan Svelte.

---

## 9. Final Shortcut Map (Industrial)

| Feature            | Intent            | Shortcut          |
| :----------------- | :---------------- | :---------------- |
| **New Group**      | `NEW_LAYER_GROUP` | `Ctrl + G`        |
| **Toggle Minimap** | `TOGGLE_MINIMAP`  | `Ctrl + M`        |
| **Toggle Mist**    | `TOGGLE_AIRBRUSH` | `Alt + A`         |
| **Reset View**     | `RESET_VIEWPORT`  | `Alt + Backspace` |
