# Blueprint 05: Mode Orchestration

## 1. Executive Summary

The **Mode Engine** (Stance Engine) is the behavioral governor of **Rupa Pixel Editor**. It consolidates raw modifier states and interaction flags into a single, high-level **Mode**. This ensures that the application's logic, visual feedback, and auditory resonance are synchronized.

---

## 2. Technical Implementation

- **Location:** `src/lib/engine/mode.svelte.ts`.
- **Class:** `ModeEngine`.
- **Reactivity:** Uses Svelte 5 `$derived` to compute the active state based on keyboard and mouse flags.

---

## 3. The Mode Hierarchy

In cases where multiple intents overlap, the engine resolves them using priority logic:

1.  **PICK**: Momentary (Eyedropper).
2.  **SELECT**: Sustained (Selection Mode).
3.  **ERASE**: Sustained (Erase Flow).
4.  **PAINT**: Sustained (Draw Flow).
5.  **READY**: Default (Standby).

---

## 4. Behavioral Contract

- **State Sequestration:** Components must not check physical key states directly. They must query `mode.current`.
- **Atomic Transitions:** Changing a mode should trigger a clean transition in the UI.
- **Feedback Loop:** Feeds into the `StateIndicator` component for user awareness.
