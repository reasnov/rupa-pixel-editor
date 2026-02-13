# Blueprint 07: The Swift Weaver (Advanced Drawing Tools)

## 1. Executive Summary

Blueprint 07 bertujuan untuk meningkatkan efisiensi menggambar dan mengurangi kelelahan fisik artisan saat menggunakan antarmuka berbasis keyboard. Fokus utamanya adalah pengenalan alat pengisian otomatis (Dye Soak) dan sistem seleksi yang lebih fleksibel (Binding Thread).

---

## 2. Terminology & Metaphors

| Technical Term      | Artisan Term       | Philosophy                                                      |
| :------------------ | :----------------- | :-------------------------------------------------------------- |
| **Flood Fill**      | **Dye Soak**       | Pewarna yang meresap ke serat kain hingga terhalang motif lain. |
| **Lasso Selection** | **Binding Thread** | Mengikat sekumpulan serat menjadi satu kesatuan motif.          |
| **Recolor**         | **Fiber Bleach**   | Mengganti pigmen motif tanpa merusak struktur tenunan.          |
| **Magic Wand**      | **Spirit Pick**    | Memilih serat dengan resonansi warna yang sama secara otomatis. |

---

## 3. Core Mechanics (Keyboard-First)

### 3.1 Dye Soak (Flood Fill)

- **Shortcut**: `F` (Fill).
- **Behavior**: Algoritma Breadth-First Search (BFS) yang menyebar dari posisi **Needle**.
- **Constraint**: Mengisi area kosong (`null`) atau warna yang sama hingga menyentuh batas warna yang berbeda.

### 3.2 Fiber Bleach (Recoloring)

- **Shortcut**: `Alt + R`.
- **Behavior**: Mengganti semua unit warna yang identik dengan warna di bawah Needle menjadi **Active Dye** saat ini di seluruh kanvas atau area seleksi.

### 3.3 Binding Thread (Poly-Lasso)

- **Workflow**:
  1. Tekan `Shift + Enter` untuk mulai mengikat.
  2. Gerakkan Needle ke sudut-sudut motif, tekan `Enter` untuk menandai titik.
  3. Tekan `F` untuk mengisi area di dalam ikatan titik-titik tersebut.

---

## 4. Implementation Goals (v0.5.0-alpha)

1. Implementasi `DyeService.soak()` (Flood Fill logic).
2. Implementasi `ManipulationService.bleach()` (Recolor logic).
3. Integrasi ke `LoomPad` intent mapping.
