# Blueprint 06: The Master’s Project & The Unified Engine (v0.4.0)

## 1. Executive Summary

Blueprint 06 transforms Rupa from a single-canvas editor into a comprehensive **Barista Project Manager**. It introduces **The Project**—a multi-frame (tab) system—and **The Layers**—a multi-layer system. Alongside these structural changes, the four core engines (**Engine, Keyboard, Stance, Shuttle**) are upgraded to handle hierarchical data, sequence-based inputs, and cross-frame operations.

---

## 2. Terminology & Metaphor

| Technical Term        | Barista Term  | Philosophy                                              |
| :-------------------- | :------------ | :------------------------------------------------------ |
| **Project / Tabs**    | **The Project** | A collection of works within a single barista's bundle. |
| **Canvas / Tab Item** | **The Frame** | A single unique composition or "page" in the Project.     |
| **Layer**             | **The Layer**  | A thin, transparent layer that adds depth to the Pattern. |
| **Switch Tab**        | **Turn Page** | Moving between different frames in the Project.           |
| **Merge Layers**      | **Entwine**   | Permanently joining two Layers into one.                 |

---

## 3. Data Architecture (The Rune Protocol)

The state is refactored from a flat structure into a hierarchical tree using Svelte 5 Runes.

### 3.1 Hierarchy

- **EditorState**: Root orchestrator delegating to specialized state modules.
- **ProjectState**: Manages the collection of `Frames`.
- **FrameState**: Manages dimensions, metadata, and the collection of `Layers`.
- **LayerState**: Manages the raw `pixels` (pixels), visibility, and density (opacity).

### 3.2 Schema (Pattern Book v0.4.0)

```json
{
  "version": "0.4.0",
  "project": {
    "name": "Barista Project",
    "frames": [
      {
        "id": "uuid",
        "name": "Main Pattern",
        "dimensions": { "width": 32, "height": 32 },
        "layers": [
          { "id": "v1", "name": "Background", "pixels": [...], "isVisible": true },
          { "id": "v2", "name": "Outline", "pixels": [...], "isVisible": true }
        ]
      }
    ]
  }
}
```

---

## 4. Core Engine Upgrades

### 4.1 Keyboard: Sequence Mapping

- **Brewing Sequences**: Support for multi-key sequences (e.g., `G` then `C` for "Go to Center").
- **Context Awareness**: Inputs are routed based on focus (Canvas vs Sidebar).
- **Sticky Prevention**: Improved physical state tracking to avoid stuck modifiers.

### 4.2 The Editor: Hierarchical Routing

- **Active Resolution**: Routes intents to the `ActiveFrame` -> `ActiveLayer`.
- **Safety Checks**: Prevents pixeling on locked or hidden Layers.

### 4.3 Stance Engine: The Organizing Stance

- **STANCE_ORGANIZING**: A new mode for managing the Project/Layer hierarchy.
- **Visual Projection**: Inactive layers can be dimmed or rendered as "Ghost Threads" (Onion Skinning).

### 4.4 Shuttle Engine: Unified Services

- **Manipulation**: Support for `Entwine` (merge) and frame-to-frame pattern transfers.
- **Clipboard**: Cross-frame copy/paste with coordinate preservation.
- **Persistence**: Automated migration from v0.3.0 to v0.4.0.

---

## 5. Interaction Design (The Sidebar)

A dual-tabbed sidebar in the Right Bar:

- **Frame Ledger (Tabs)**: List of all canvases in the Project.
- **Layer Ledger (Layers)**: Stack of layers for the current active frame.

---

## 6. Keyboard Choreography (Intents)

| Intent         | Chord / Sequence      | Action                                   |
| :------------- | :-------------------- | :--------------------------------------- |
| `NEW_FRAME`    | `Alt + N` / `F, N`    | Create a new Frame in the Project.         |
| `NEXT_FRAME`   | `Alt + PageDown`      | Turn to the next Page/Frame.             |
| `NEW_VEIL`     | `Alt + Shift + N`     | Add a new Layer to the current Frame.     |
| `TOGGLE_VEIL`  | `Alt + L` / `Alt + H` | Lock or Hide the active Layer.            |
| `SWITCH_FOCUS` | `Tab`                 | Toggle focus between Canvas and Sidebar. |

---

## 7. Implementation Roadmap

1. **Phase A**: Refactor `CanvasState` into `LayerState` and `FrameState`.
2. **Phase B**: Implement composite rendering in `Canvas.svelte` (stacking canvases).
3. **Phase C**: Upgrade `Keyboard` with sequence buffer logic.
4. **Phase D**: Build the dual-tabbed "Project & Layer" sidebar UI.

---

_"One Project, many Frames, infinite depth."_
