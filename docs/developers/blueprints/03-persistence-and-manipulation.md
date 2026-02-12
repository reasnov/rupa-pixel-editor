# Blueprint 03: Persistence & Linen Manipulation (v0.3.0)

## 1. Goal

To evolve the studio from a temporary sketchpad into a professional workspace by implementing native file handling, dynamic canvas resizing, and selection-based pattern manipulation.

---

## 2. Atelier Filing System (Persistence)

### 2.1 The `.rupa` Format

A dedicated JSON schema for saving project data.

```json
{
	"version": "0.3.0",
	"metadata": {
		"name": "Untitled Stitch",
		"created": "ISO-TIMESTAMP",
		"lastModified": "ISO-TIMESTAMP"
	},
	"dimensions": {
		"width": 32,
		"height": 32
	},
	"palette": ["#Hex", "..."],
	"pixelData": ["#Hex", "..."]
}
```

### 2.2 Electron Bridge (Native IO)

- **Save/Open Dialogs**: Use Electron's `dialog.showSaveDialog` and `showOpenDialog` via a context bridge.
- **File System**: The `fs` module will handle the actual writing/reading of `.rupa` files.

### 2.3 Atelier Auto-Backup (Temporary)

- **Cadence**: Every 10 minutes.
- **Mechanism**: Use `IndexedDB` (for web) and a hidden `temp.rupa` file in the app data directory (for Electron).
- **UX**: A subtle "Threading backup..." message will appear momentarily in the status tag.

---

## 3. Linen Resizing (Dynamic Grid)

### 3.1 Re-anchoring Logic

When resizing the linen, the existing "stitches" must remain relative to their anchor point (default: Top-Left).

- **Expansion**: Append new empty hex values to the array rows.
- **Contraction (Cropping)**: Slice the array rows. A warning modal must appear if non-empty pixels are detected in the "cut zone."

### 3.2 Rotation & Symmetry

- **Flip**: Logic for Horizontal (reversing rows) and Vertical (reversing columns).
- **Rotate**: 90-degree clockwise transformation of the flat `pixelData` array.

---

## 4. The Shifting Needle (Pattern Manipulation)

### 4.1 Selection Translation

While in **Block Mode (Shift + Alt)**, users can move the selected area using Arrow Keys.

- **Live Movement**: The selection outline moves instantly.
- **Commit**: Pressing `Enter` or releasing the keys "re-stitches" the pattern at the new location, clearing the original source area.

### 4.2 Pattern Clipboard

- **Copy (`Ctrl + C`)**: Capture the hex data within the current selection without altering the linen.
- **Cut (`Ctrl + X`)**: Capture the hex data within the current selection and immediately clear (unstitch) the source area.
- **Paste (`Ctrl + V`)**: Place the captured pattern at the current cursor position.

---

## 5. UI Requirements

- **Project Metadata HUD**: Display the project name and "Last Saved" timestamp in the side panel.
- **The Archives Modal**: A simple UI to see a list of recent files or backups.
- **Resize Dialog**: A meditative modal for entering new dimensions with a "Loom Preview."

---

## 6. Implementation Strategy

1.  **Phase A**: Implement the Electron Context Bridge and the `.rupa` file schema.
2.  **Phase B**: Integrate the 10-minute `setInterval` for Auto-Backup.
3.  **Phase C**: Develop the `re-stitch` algorithms for resizing and rotation.
4.  **Phase D**: Add Selection Translation (Moving blocks).
