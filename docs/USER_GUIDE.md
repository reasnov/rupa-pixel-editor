# The Artisan's User Guide: Weaving in Rupa

Welcome to your studio. This guide provides the knowledge needed to master the **Rupa Pixel Editor**, transforming your keyboard into a digital loom.

---

## 1. Entering the Atelier (The HUD)

The Atelier is organized into four main areas to keep your workspace clean:

- **Top Bar (Command Center):** Contains the Header, Project Info, and primary tools (Catalog, Export, Clear, Mute).
- **Left Bar (Dye Palette):** Your selection of threads. Use `1-0` to switch dyes instantly.
- **Right Bar (Artisan Stats):** Displays the Active Dye, Needle Coordinates, Linen Size, and a history of **Used Dyes**.
- **Bottom Bar (Ledger):** Shows the **State Indicator** (your current mode) and the **Debug Bar** (technical chord ledger).

---

## 2. Core Navigation & Stitching

Rupa is designed for a keyboard-first experience.

### 2.1 Moving the Needle
- **Arrow Keys:** Move the Needle across the linen.
- **`G` (Go To):** Instantly jump to a specific coordinate using the Cartesian system.

### 2.2 Applying Dyes (Stitching)
- **Space / Enter:** Apply the active dye to the current cell (Stitch).
- **Backspace / Delete:** Clear the current cell (Unstitch).

### 2.3 Batch Filling
You can fill an entire area instantly:
1. Hold **`Shift`** to enter **Looming Mode** (Selection).
2. Use **Arrow Keys** to define the area.
3. Press **`Space`** while holding Shift to fill the entire area with the active dye.

---

## 3. The Artisan's Stances (Modes)

Mastering Rupa requires understanding how modifiers change your "Stance."

| Stance | Modifier | Action |
| :--- | :--- | :--- |
| **Resting** | None | Free movement without altering the linen. |
| **Threading** | `Ctrl` | **Flow-Stitch:** Color every cell the needle passes through. |
| **Looming** | `Shift` | **Selection:** Define a rectangular area. The selection persists until cleared. |
| **Unravelling** | `Ctrl + Shift`| **Flow-Erase:** Clear every cell the needle passes through. |
| **Picking** | `Alt` | **Eyedropper:** Sample a color directly from the linen. |

---

## 4. Pattern Manipulation (Selection)

When you define a selection (Looming), it remains active as a **Persistent Selection** (shown with a thin gray border) even after releasing Shift.

- **`Space`:** Fill the selection with the active dye.
- **`Ctrl + C` (Copy):** Capture the **Motif** (pattern) into the clipboard as a **Swatch**.
- **`Ctrl + X` (Cut):** Capture the Swatch and clear the source area.
- **`Ctrl + V` (Paste):** Place the captured Swatch at the current needle position.
- **`Esc`:** Clear the active selection.

---

## 5. Viewport Control (Loom Zoom)

- **`+` / `=`:** Zoom in for fine detail.
- **`-`:** Zoom out to see the whole tapestry.
- **`0`:** Reset zoom to 100%.

The camera protocol ensures the **Needle** always stays centered in your view when zooming.

---

## 6. Creating Artifacts (Export)

When your work is complete, transform it into a permanent file:

1. Press **`Ctrl + E`** to open the **Artifact Crate**.
2. Choose your format:
   - **PNG:** A sharp, pixel-perfect raster image.
   - **SVG:** An optimized vector graphic. The engine intelligently merges connected stitches into complex paths, keeping the file size small.
3. Select your scale and background preference.
4. Export and save to your local system.

---

## 7. Archiving Patterns (Saving)

- **`Ctrl + S`:** Save your project as a `.rupa` Pattern Book.
- **Linen Backup:** Rupa automatically backs up your work every 10 minutes.

---

*"May your stitches be steady and your palette be vibrant."*
