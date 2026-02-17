# Blueprint 03: Persistence & Manipulation

## 1. Goal

To evolve **Rupa Pixel Editor** from a temporary sketchpad into a professional workspace by implementing native file handling (Storage), dynamic canvas resizing (Foam Crafting), and selection-based manipulation.

---

## 2. File System (Persistence)

### 2.1 The `.rupa` Format (The Recipe)

A dedicated JSON schema for project data.

```json
{
	"version": "0.3.0",
	"metadata": {
		"name": "Untitled Project",
		"created": "ISO-TIMESTAMP",
		"lastModified": "ISO-TIMESTAMP"
	},
	"dimensions": {
		"width": 32,
		"height": 32
	},
	"palette": ["#Hex", "..."],
	"pixels": ["#Hex", "..."]
}
```

### 2.2 Native IO

- **Implementation:** Uses Electron IPC to bridge with the native file system.
- **Service:** Managed by `PersistenceService` in `src/lib/engine/services/persistence.ts`.

---

## 3. Canvas Manipulation (Dynamic Grid)

### 3.1 Resizing Logic

When resizing the canvas (The Foam), existing pixels must remain relative to the anchor.

- **Implementation:** `ManipulationService.resize()` handles the array reallocation and coordinate mapping.

### 3.2 Rotation & Reflection

- **Service:** `ManipulationService` provides `flip()` and `rotate()` methods.

---

## 4. Pattern Manipulation (The Etcher's Skill)

### 4.1 Selection Translation

- **Mode:** Managed by `InputEngine` and `ModeEngine` (Stance).
- **Technical Detail:** Users can define a selection (Focus Area) and move the pixels using the keyboard.

### 4.2 Clipboard

- **Implementation:** `ClipboardService` manages an internal `clipboard` state in the project.
- **Technical Details:** Supports Copy, Cut, and Paste of pixel arrays with dimension data.

---

## 5. UI Requirements

- **Metadata HUD:** Display project name and save status.
- **Modals:** Technical dialogs for resizing and file management, themed with Barista motifs.
