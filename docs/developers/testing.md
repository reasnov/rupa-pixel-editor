# Testing Guide: Quality Tasting in the Café

To ensure the **Rupa Pixel Editor** remains a reliable sanctuary for digital baristas, we maintain a rigorous testing culture. Testing is our way of "tasting the brew" to ensure every pixel is etched with precision and every interaction feels tactile and correct.

---

## 1. Testing Philosophy

We follow a **Layer-Specific Testing Strategy** that aligns with our modular monolith architecture:

- **Logic Layer (The Ingredients):** Pure, stateless algorithms (math, sorting, rendering, etc.). These are tested with zero dependencies or mocks. Focus on algorithmic correctness.
- **State Layer (The Atelier):** Reactive data containers. We test their initial states, reactive projections (`$derived`), and state transitions.
- **Service Layer (The Crafting):** Containers for **Business Logic & Rules**. We test these by mocking the global `editor` state and verifying that business rules are enforced and side effects occur correctly.
- **Engine Layer (The Infrastructure):** **Orchestrators & Entry-points**. We test their ability to normalize inputs and correctly delegate to Services or Logic. Requires integration tests to ensure physical events map correctly to semantic intents.

---

## 2. Technology Stack

- **Runner:** [Vitest](https://vitest.dev/)
- **Environment:** Node.js (with `jsdom` for UI-adjacent logic)
- **Mocking:** Vitest's built-in `vi` utility.

---

## 3. Directory Structure

Tests are located in `src/tests/` and mirror the structure of `src/lib/`:

```text
src/tests/
├── logic/          # Tests for src/lib/logic/
├── services/       # Tests for src/lib/engine/services/
└── state/          # Tests for src/lib/state/
```

---

## 4. Writing Tests

### 4.1 Testing Logic (Pure Functions)

Since the Logic Layer is pure math, tests are straightforward:

```typescript
import { describe, it, expect } from 'vitest';
import { Geometry } from '../../lib/logic/geometry.js';

describe('Geometry', () => {
	it('should calculate the center of a grid', () => {
		const center = Geometry.getCenter(32, 32);
		expect(center).toEqual({ x: 16, y: 16 });
	});
});
```

### 4.2 Testing Services (Mocking the State)

Services interact with the global `editor` state. We mock this state to isolate the service logic:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { DrawService } from '../../lib/engine/services/draw.js';

// Mock the editor singleton
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		canvas: {
			/* mock methods */
		},
		cursor: { pos: { x: 0, y: 0 } }
	}
}));

describe('DrawService', () => {
	it('should update the canvas on draw', () => {
		const service = new DrawService();
		service.draw();
		// Assertions...
	});
});
```

### 4.3 Testing State (Reactivity)

When testing Svelte 5 Runes, ensure you are testing the **behavior** of the state container:

```typescript
import { describe, it, expect } from 'vitest';
import { CanvasState } from '../../lib/state/canvas.svelte.js';

describe('CanvasState', () => {
	it('should derive center correctly', () => {
		const canvas = new CanvasState(32, 32);
		expect(canvas.center).toEqual({ x: 16, y: 16 });
	});
});
```

---

## 5. Best Practices for Baristas

1.  **AAA Pattern:** Arrange, Act, Assert. Keep your tests clean and readable.
2.  **Isolation:** Tests must not depend on each other. Use `beforeEach` to reset mocks and state.
3.  **No Magic Values:** Use descriptive variable names for test data.
4.  **English Only:** All test descriptions and comments must be in English.
5.  **Professional DocBlocks:** Ensure any complex test helpers are documented.

---

## 6. Execution

Run the full test suite before every commit:

```bash
npm run test
```

To run tests in watch mode during development:

```bash
npx vitest
```

---

_"A well-tested brew is a brew you can trust."_
