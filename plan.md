== Feature ==
Core Blocking Engine (Pemblokiran Utama):
- Network-Level Filtering: Memblokir request iklan, script pelacak, dan iframe berbahaya sebelum dimuat menggunakan API declarativeNetRequest (Manifest V3).
- DOM Dynamic Cleaner: Menghapus elemen iklan visual yang lolos dari pemblokiran jaringan secara otomatis menggunakan MutationObserver.
- Anti-Adblock Bypass Support: Menyembunyikan elemen iklan tanpa merusak tata letak (layout) utama halaman web.

Customization & Interactive Tools (Fitur Interaktif):
- Element Zapper (Visual Blocker): Fitur pemilih elemen interaktif untuk menghapus elemen pengganggu (div, banner, pop-up) secara manual melalui satu klik.
- Domain Rules Persistence: Menyimpan daftar elemen yang di-zap ke dalam chrome.storage.local berdasarkan domain web, sehingga elemen tersebut tidak muncul lagi saat dikunjungi kembali.
- Element Rules Manager: Menu pengelolaan untuk melihat, menghapus, atau mereset daftar aturan selector elemen yang pernah di-zap per situs web.

User Interface & Control (Antarmuka Pengguna):
- Global Toggle Switch: Tombol aktivasi instan untuk menyalakan atau mematikan seluruh fungsi pemblokir iklan kapan saja.
- Live Blocking Counter: Menampilkan statistik jumlah iklan dan elemen pengganggu yang berhasil diblokir secara real-time.
- Whitelisting System: Fitur untuk mengecualikan situs web tertentu dari pemblokiran agar fungsi situs tetap berjalan normal jika dibutuhkan.

Privacy & Security (Keamanan Data):
- Zero-Logs Policy: Tidak mencatat, menyimpan, maupun mengirimkan riwayat penjelajahan (browsing history) pengguna ke server luar.
- Local Processing: Seluruh pemrosesan filter dan penyimpanan aturan dilakukan 100% secara lokal di dalam browser pengguna.


== Roadmap ==
Tahap 1: Setup & Arsitektur Dasar:
- Struktur Proyek: Buat folder proyek dan siapkan file dasar (manifest.json, background.js, content.js, popup.html, popup.js).
- Manifest V3 Config: Daftarkan izin declarativeNetRequest, storage, activeTab, serta skrip utama di manifest.json.
- Testing Pipeline: Muat folder ekstensi ke browser via chrome://extensions (Developer Mode) untuk memastikan tidak ada eror parsing.

Tahap 2: Core Blocking Engine (Jaringan & DOM):
- Network Rules (rules.json): Buat daftar aturan awal untuk memblokir domain iklan populer (seperti Google Ads, DoubleClick).
- DOM Cleaner (content.js): Tulis fungsi penyeleksi CSS untuk menyembunyikan kontainer iklan umum (.adsbygoogle, [id^="div-gpt-ad"]).
- Observer Integration: Pasang MutationObserver agar iklan dinamis yang muncul belakangan (lazy loading) langsung terhapus.

Tahap 3: Fitur Element Zapper & Storage:
- Visual Selector: Buat logika hover effect (garis luar merah) pada elemen web saat mode Zapper aktif.
- Unique Selector Generator: Tulis fungsi JS untuk mengekstrak ID/Class unik dari elemen yang diklik pengguna.
- Storage Sync: Simpan selector unik tersebut ke chrome.storage.local berdasarkan window.location.hostname.
- Auto-Apply Rule: Buat logika untuk membaca memori storage dan menyembunyikan elemen tersimpan setiap kali halaman dimuat ulang.

Tahap 4: UI & State Management (Popup):
- Interface Layout: Desain tampilan popup.html menggunakan CSS/Tailwind (tombol Toggle ON/OFF, statistik counter, tombol Zap Element).
- Message Passing: Hubungkan popup.js dengan content.js menggunakan chrome.tabs.sendMessage untuk mengaktifkan mode Zapper dari popup.
- Global Toggle & Whitelist: Tambahkan logika untuk menyalakan/mematikan pemblokiran per domain.

Tahap 5: Pengelolaan Aturan & Polishing:
- Zapper Manager: Buat halaman sederhana di popup/options untuk melihat dan menghapus daftar elemen yang pernah di-zap.
- Code Refactoring: Merapikan struktur kode, menambahkan komentar penjelasan di fungsi-fungsi penting, dan memperbaiki edge cases.
- Dokumentasi Portofolio: Tulis file README.md yang lengkap (fitur, tech stack, cara instalasi, dan screenshot/GIF demo).