# Blueprint 06: Project Management

## 1. Executive Summary

Blueprint 06 transforms **Rupa Pixel Editor** from a single-canvas editor into a multi-frame and multi-layer project manager. It introduces the **Project** (Recipe Book) hierarchy, including **Frames** (Cups) and **Layers** (Infusions).

---

## 2. Terminology Mapping

| Technical Term | UI (Barista) Term | Implementation File |
| :--- | :--- | :--- |
| **Project** | **The Order** | `src/lib/state/project.svelte.ts` |
| **Frame** | **The Cup** | `src/lib/state/frame.svelte.ts` |
| **Layer** | **The Infusion** | `src/lib/state/layer.svelte.ts` |

---

## 3. Data Architecture

The state uses a hierarchical tree structure:

- **EditorState:** Root orchestrator.
- **ProjectState:** Manages the collection of `frames`.
- **FrameState:** Manages `layers` and dimensions.
- **LayerState:** Manages raw `pixels` array.

---

## 4. Core System Upgrades

### 4.1 Input Engine: Sequence Mapping

- **Logic:** `SequenceEngine` handles multi-key rhythms.
- **Sovereignty:** Input routing based on active UI focus.

### 4.2 Service Coordination

- **Coordinator:** `ServiceCoordinator` (`services`) in `src/lib/engine/services.ts`.
- **Operations:** Supports reordering frames/layers, merging layers, and cross-frame clipboard actions.

---

## 5. Interaction Design

- **Sidebar:** Managed via `FrameSidebar.svelte` and `FramePanel.svelte`.
- **Composite Rendering:** `FrameState.compositePixels` caches the flattened pixel array for display.
