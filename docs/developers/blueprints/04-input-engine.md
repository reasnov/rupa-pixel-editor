# Blueprint 04: Input Engine

## 1. Executive Summary

The **Keyboard Engine** (Rhythm Engine) is the specialized nervous system of **Rupa Pixel Editor**. Its primary purpose is to transform raw keyboard interrupts into high-level **ActionIntents**. It treats the keyboard as a tactile controller where rhythm, sustain, and chord complexity define the quality of the interaction.

---

## 2. Core Philosophy: Intent over Input

The application reacts to **Intents**, not raw keys.

- **The Rhythm (Key):** A single raw unit of input.
- **The Chord:** A combination of modifiers and keys.
- **The Intent:** Semantic action (e.g., `PAINT`, `UNDO`).

---

## 3. Technical Implementation

### 3.1 Input Mapping

- **Configuration:** All mappings are defined in `src/lib/config/shortcuts.json`.
- **Engine:** `KeyboardEngine` in `src/lib/engine/keyboard.svelte.ts`.

### 3.2 Command Sequences

- **Concept:** Supports multi-key sequences (e.g., `G` then `C`).
- **Logic:** Handled by `SequenceEngine` in `src/lib/engine/sequence.svelte.ts`.

---

## 4. Interaction Modalities

### 4.1 Momentary Intents (The Tap)

- **Behavior:** Triggered on `keydown`.
- **Example:** `UNDO`, `SAVE`.

### 4.2 Sustained Flows (The Pour)

- **Behavior:** Actions that change global state while a key is held.
- **Example:** Holding `Ctrl` for continuous drawing.

---

## 5. Architectural Contract

- **State Responsibility:** The engine identifies the Intent; the **EditorState** handles data; the **ServiceCoordinator** (`services`) executes actions.
