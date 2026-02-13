# Blueprint 06: The Master’s Folio & The Unified Loom (v0.4.0)

## 1. Executive Summary

Blueprint 06 transforms Rupa from a single-canvas editor into a comprehensive **Artisan Project Manager**. It introduces **The Folio**—a multi-frame (tab) system—and **The Veils**—a multi-layer system. Alongside these structural changes, the four core engines (**Loom, LoomPad, Stance, Shuttle**) are upgraded to handle hierarchical data, sequence-based inputs, and cross-frame operations.

---

## 2. Terminology & Metaphor

| Technical Term        | Artisan Term  | Philosophy                                              |
| :-------------------- | :------------ | :------------------------------------------------------ |
| **Project / Tabs**    | **The Folio** | A collection of works within a single artisan's bundle. |
| **Canvas / Tab Item** | **The Frame** | A single unique composition or "page" in the Folio.     |
| **Layer**             | **The Veil**  | A thin, transparent layer that adds depth to the Motif. |
| **Switch Tab**        | **Turn Page** | Moving between different frames in the Folio.           |
| **Merge Layers**      | **Entwine**   | Permanently joining two Veils into one.                 |

---

## 3. Data Architecture (The Rune Protocol)

The state is refactored from a flat structure into a hierarchical tree using Svelte 5 Runes.

### 3.1 Hierarchy

- **AtelierState**: Root orchestrator delegating to specialized state modules.
- **FolioState**: Manages the collection of `Frames`.
- **FrameState**: Manages dimensions, metadata, and the collection of `Veils`.
- **VeilState**: Manages the raw `stitches` (pixels), visibility, and density (opacity).

### 3.2 Schema (Pattern Book v0.4.0)

```json
{
  "version": "0.4.0",
  "folio": {
    "name": "Artisan Project",
    "frames": [
      {
        "id": "uuid",
        "name": "Main Motif",
        "dimensions": { "width": 32, "height": 32 },
        "veils": [
          { "id": "v1", "name": "Background", "stitches": [...], "isVisible": true },
          { "id": "v2", "name": "Outline", "stitches": [...], "isVisible": true }
        ]
      }
    ]
  }
}
```

---

## 4. Core Engine Upgrades

### 4.1 LoomPad: Sequence Mapping

- **Weaving Sequences**: Support for multi-key sequences (e.g., `G` then `C` for "Go to Center").
- **Context Awareness**: Inputs are routed based on focus (Canvas vs Sidebar).
- **Sticky Prevention**: Improved physical state tracking to avoid stuck modifiers.

### 4.2 The Loom: Hierarchical Routing

- **Active Resolution**: Routes intents to the `ActiveFrame` -> `ActiveVeil`.
- **Safety Checks**: Prevents stitching on locked or hidden Veils.

### 4.3 Stance Engine: The Organizing Stance

- **STANCE_ORGANIZING**: A new mode for managing the Folio/Veil hierarchy.
- **Visual Projection**: Inactive layers can be dimmed or rendered as "Ghost Threads" (Onion Skinning).

### 4.4 Shuttle Engine: Unified Services

- **Manipulation**: Support for `Entwine` (merge) and frame-to-frame motif transfers.
- **Clipboard**: Cross-frame copy/paste with coordinate preservation.
- **Persistence**: Automated migration from v0.3.0 to v0.4.0.

---

## 5. Interaction Design (The Sidebar)

A dual-tabbed sidebar in the Right Bar:

- **Frame Ledger (Tabs)**: List of all canvases in the Folio.
- **Veil Ledger (Layers)**: Stack of layers for the current active frame.

---

## 6. Keyboard Choreography (Intents)

| Intent         | Chord / Sequence      | Action                                   |
| :------------- | :-------------------- | :--------------------------------------- |
| `NEW_FRAME`    | `Alt + N` / `F, N`    | Create a new Frame in the Folio.         |
| `NEXT_FRAME`   | `Alt + PageDown`      | Turn to the next Page/Frame.             |
| `NEW_VEIL`     | `Alt + Shift + N`     | Add a new Veil to the current Frame.     |
| `TOGGLE_VEIL`  | `Alt + L` / `Alt + H` | Lock or Hide the active Veil.            |
| `SWITCH_FOCUS` | `Tab`                 | Toggle focus between Canvas and Sidebar. |

---

## 7. Implementation Roadmap

1. **Phase A**: Refactor `LinenState` into `VeilState` and `FrameState`.
2. **Phase B**: Implement composite rendering in `Linen.svelte` (stacking canvases).
3. **Phase C**: Upgrade `LoomPad` with sequence buffer logic.
4. **Phase D**: Build the dual-tabbed "Folio & Veil" sidebar UI.

---

_"One Folio, many Frames, infinite depth."_
