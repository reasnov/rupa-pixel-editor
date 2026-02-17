# Blueprint 05: The Barista's Stance (Mode Orchestration)

## 1. Executive Summary

The **StanceEngine** is the behavioral governor of Rupa Pixel Editor. It consolidates raw modifier states and interaction flags into a single, high-level **Barista Stance**. This ensures that the application's logic, visual feedback, and auditory response are always perfectly synchronized.

---

## 2. The Stance Hierarchy (Priority)

In cases where multiple intents overlap, the StanceEngine resolves them using the following sovereignty:

1.  **STANCE_PICKING**: Momentary (Eyedropper).
2.  **STANCE_LOOMING**: Sustained (Selection Mode - Shift).
3.  **STANCE_UNRAVELLING**: Sustained (Erase Flow - Alt).
4.  **STANCE_THREADING**: Sustained (Draw Flow - Ctrl).
5.  **STANCE_RESTING**: Default (Free movement).

---

## 3. Stance Metadata

Every Stance must provide a standardized descriptor for the HUD:

- **Label**: Human-readable name (e.g., "Threading").
- **Icon**: Visual representation (e.g., "🧵").
- **Aesthetic**: The brand color associated with the mode (e.g., `studio-teal`).
- **Activity**: A pulse or animation flag for the bottom bar.

---

## 4. Behavioral Contract

- **State Sequestration**: Components and engines must not check `isShiftPressed` directly. They must query `stanceEngine.currentStance`.
- **Atomic Transitions**: Changing a Stance should trigger a clean transition, clearing any temporary buffers (like selection paths) from the previous Stance.
- **Keyboard Integration**: The StanceEngine consumes `ActionIntents` and outputs the resolved **Stance**.

---

## 5. Technical Implementation

- **Store**: A reactive Svelte 5 class.
- **Derivation**: Uses `$derived` to compute the active Stance based on the Pattern Buffer.
- **Feedback Loop**: Directly feeds into the `StateIndicator` component.
