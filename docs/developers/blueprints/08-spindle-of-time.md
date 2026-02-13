# Blueprint 08: The Spindle of Time (Animation Engine)

## 1. Executive Summary

Blueprint 08 mentransformasi Rupa dari editor gambar statis menjadi studio animasi. Memanfaatkan struktur **Folio** yang sudah ada, sistem ini akan memperkenalkan kontrol waktu dan pratinjau gerak (Playback).

---

## 2. Terminology & Metaphors

| Technical Term     | Artisan Term      | Philosophy                                             |
| :----------------- | :---------------- | :----------------------------------------------------- |
| **Timeline**       | **The Spindle**   | Poros tempat benang waktu digulung.                    |
| **Playback**       | **The Pulse**     | Jantung studio yang menentukan kecepatan rotasi waktu. |
| **Onion Skinning** | **Ghost Threads** | Bayangan benang dari masa lalu dan masa depan.         |
| **Frame Rate**     | **Weave Pace**    | Kerapatan detak jantung animasi.                       |

---

## 3. Architecture

### 3.1 The Spindle UI

- Panel horizontal yang menampilkan urutan **Frames**.
- Navigasi cepat antar frame menggunakan `Alt + PageUp/Down`.

### 3.2 Ghost Threads (Onion Skinning)

- Merender frame `n-1` (merah transparan) dan `n+1` (hijau transparan) di bawah layer aktif untuk panduan visual gerakan.

### 3.3 The Pulse (Playback Engine)

- Menjalankan loop waktu yang mengganti frame aktif secara otomatis berdasarkan durasi per frame.

---

## 4. Implementation Goals (v0.5.0-beta)

1. Pembuatan komponen `SpindlePanel` (Timeline).
2. Implementasi logic `OnionSkinning` pada `Linen.svelte`.
3. Integrasi ekspor **Animated GIF** dan **Sprite Sheet**.
