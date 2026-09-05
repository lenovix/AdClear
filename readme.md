# AdClear - Fast & Lightweight Ad Blocker Extension

**AdClear** adalah ekstensi browser berbasis **Manifest V3** yang dirancang untuk memblokir iklan, skrip pelacak, serta elemen pengganggu pada halaman web secara cepat dan efisien.

## 🌟 Fitur Utama

- **Network-Level Filtering:** Memblokir *request* iklan, analytics, dan skrip pelacak secara otomatis menggunakan Chrome `declarativeNetRequest` API.
- **Interactive Element Zapper:** Fitur pemilih elemen visual yang memungkinkan pengguna menyembunyikan *div* atau banner pengganggu secara manual.
- **Domain-Based Persistence:** Aturan penyembunyian elemen disimpan secara otomatis di `chrome.storage.local` berdasarkan domain.
- **Real-Time Control:** UI Popup interaktif dengan indikator statistik dan tombol *Reset* untuk mengembalikan elemen yang terhapus.
- **Privacy-Focused:** 100% pemrosesan dilakukan secara lokal di browser tanpa pengumpulan data (*Zero-Logs*).

## 🛠️ Tech Stack

- **Core Engine:** JavaScript (ES6+), Manifest V3 API (`declarativeNetRequest`, `storage`, `action`)
- **Content Scripting:** DOM Manipulation, `MutationObserver`
- **UI & Styling:** HTML5, CSS3

## 🚀 Cara Instalasi (Developer Mode)

1. Clone repository ini atau unduh file source code.
2. Buka Google Chrome / Microsoft Edge / Opera.
3. Buka halaman ekstensi via `chrome://extensions/`.
4. Aktifkan **Developer mode** di pojok kanan atas.
5. Klik **Load unpacked** dan pilih folder proyek `AdClear`.

---
*Dibuat untuk portofolio pengembangan ekstensi browser modern.*