# Blueprint 04: The EditorPad Engine (The Barista's Hand)

## 1. Executive Summary

The **Keyboard Engine** is the specialized nervous system of Rupa Pixel Editor. Its primary purpose is to transform raw keyboard interrupts into high-level **Barista Intents**. It moves beyond simple key-mapping by treating the keyboard as a tactile controller where rhythm, sustain (holding), and chord complexity define the quality of the "pixel."

---

## 2. Core Philosophy: Intent over Input

In a keyboard-centric studio, the application must not react to keys, but to **Intents**.

- **The Thread (Key):** A single raw unit of input.
- **The Chord:** A combination of modifiers and keys played together (The "Grip").
- **The Intent (Semantic):** What the barista wants to achieve (e.g., "Thread the Canvas," not "Ctrl+Movement").

---

## 3. Functional Anatomy

### 3.1 The Chord Ledger (Tracking)

The engine must maintain a real-time ledger of active keys. This ensures:

- **Ghosting Prevention:** Accurate detection even when the OS or Browser logic attempts to hijack "Sticky" keys.
- **Sustain Logic:** Distinguishing between a "Tap" (Pixel) and a "Hold" (Flow).

### 3.2 The Shuttle (Parsing Logic)

The parsing algorithm follows a **Complexity-First** priority:

1.  **Chords (N+1):** Combinations with the most modifiers (e.g., `Ctrl+Shift+X`) are evaluated first.
2.  **Solos (N):** Single key presses are evaluated last.
3.  **Navigation Sovereignty:** Navigation keys (Arrows) are treated as "Elastic Chords" that allow modifiers to pass through without changing the base Intent, instead modifying the _Mode_ of that Intent (e.g., Move vs. Move-and-Pixel).

### 3.3 Context Sovereignty

The EditorPad recognizes the studio's shifting environment:

- **Canvas Context:** High-performance, low-latency drawing intents.
- **Palace Context (Modals/Palettes):** Navigational and selection intents.
- **Focus Shield:** When the barista is "writing" (Input fields), the Keyboard automatically retracts to prevent accidental pixeling.

---

## 4. Interaction Modalities

### 4.1 Momentary Intents (The Tap)

Actions that occur once per press.

- _Behavior:_ Triggered on `keydown`.
- _Example:_ `Undo`, `Redo`, `Save`.

### 4.2 Sustained Flows (The Threading)

Actions that change the behavior of movement or global state while held.

- _Behavior:_ Modifies the `EditorState` flow flags on `keydown` and reverts them on `keyup`.
- _Example:_ `Flow-Pixel`, `Flow-Select`.

### 4.3 Command Sequences (The Brewing) - _Future Concept_

Multi-key sequences where the order of keys defines the pattern.

- _Example:_ `G` then `C` to "Go to Center."

---

## 5. Evolutionary Constraints

As a living engine, the Keyboard must adhere to these stability rules:

1.  **System Non-Interference:** Avoid chords that conflict with critical OS-level shortcuts (e.g., `Alt+F4`).
2.  **Semantic Mapping:** All chords must be defined in `shortcuts.json` using the `ActionIntent` type. No hardcoded `e.key` checks are permitted within UI components.
3.  **Dynamic Labeling:** The engine must provide human-readable labels for all Intents to ensure the "Barista's Catalog" (Help Modal) stays synchronized automatically.

---

## 6. Technical Contract

- **Input Source:** `window.addEventListener`.
- **Output:** `ActionIntent` string or `null`.
- **State Responsibility:** The engine identifies the Intent; the **EditorState** handles reactive data; the **ShuttleEngine** executes actions.
- **Reactivity:** Use Svelte 5 Runes to expose the **Chord Ledger** for UI debugging and feedback.
