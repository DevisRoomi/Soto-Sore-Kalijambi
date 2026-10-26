# Dokumentasi Perancangan Web
## Soto Sore Kalijambi — AI Kitchen Order

**Versi:** 1.0  
**Target selesai:** 1 November 2026  
**Status:** Perancangan awal  
**Pemilik usaha:** Soto Sore Kalijambi

---

## 1. Ringkasan Proyek

Sistem berupa landing page profil warung yang dilengkapi fitur **Smart Kitchen AI**. Fitur ini menerima pesanan pelanggan dalam bentuk teks bebas, lalu mengubahnya menjadi tiket dapur terstruktur.

Sistem **bukan kasir** dan **tidak menghitung harga**. Fokus sistem:

- Memperkenalkan Soto Sore Kalijambi.
- Menampilkan menu dan harga sebagai informasi.
- Mengurangi salah baca pesanan dapur.
- Mengubah teks pesanan acak menjadi daftar racikan.
- Menampilkan tiket thermal yang dapat dicentang koki.
- Menyediakan akses publik setelah deployment.

### Masalah

Pesanan pelanggan sering disampaikan dengan bahasa campuran, singkatan, jumlah tidak berurutan, dan instruksi khusus. Contoh:

> Bang soto gede 2 yg satu ga pake kecap, soto kecil 1, mendoan 4, es teh 2, es susu 1

Cara manual berisiko menyebabkan jumlah, varian, atau catatan racikan terlewat.

### Solusi

Pelanggan atau petugas memasukkan pesanan ke satu kotak teks. AI mengekstrak isi pesanan menjadi JSON terstruktur dengan tiga kategori:

1. Soto
2. Minuman
3. Pelengkap

JSON kemudian dirender sebagai tiket dapur. Koki mencentang item setelah selesai diracik.

---

## 2. Tujuan dan Indikator Keberhasilan

### Tujuan

- Membuat profil digital warung yang menarik dan responsif.
- Menyajikan menu dengan informasi jelas.
- Menghasilkan tiket dapur dari pesanan teks.
- Menjaga alur kerja sesingkat mungkin untuk petugas warung.
- Menyediakan QR Code menuju URL publik.

### Indikator keberhasilan

- Landing page dapat dibuka di desktop dan HP.
- Tidak ada horizontal overflow pada viewport mobile.
- Menu tampil benar tanpa salah harga.
- Input pesanan valid menghasilkan tiket dapur.
- Instruksi khusus tetap terlihat pada tiket.
- Item tiket bisa dicentang.
- Input tidak valid ditolak dengan pesan jelas.
- Respons AI target kurang dari 5 detik saat API tersedia.
- Web berhasil diakses melalui URL deployment.
- QR Code dapat dipindai dan membuka URL yang sama.

---

## 3. Target Pengguna dan Peran

### Pengunjung / Pelanggan

- Melihat profil warung.
- Melihat menu dan harga.
- Mencoba fitur simulasi pesanan.
- Memindai QR Code.

### Petugas / Koki

- Memasukkan pesanan pelanggan.
- Membaca tiket dapur.
- Mencentang item yang selesai.
- Membaca instruksi khusus.

### Administrator teknis

- Mengatur API AI dan environment variable.
- Mengubah menu.
- Melakukan deployment.
- Memeriksa log error.
- Membuat QR Code setelah URL publik tersedia.

Tidak ada modul kasir, pembayaran, stok, laporan keuangan, atau login pada versi pertama.

---

## 4. Struktur Halaman

### 4.1 Navbar

- Logo/nama: Soto Sore Kalijambi.
- Link: Beranda, Menu, Smart Kitchen, Tentang.
- Tombol utama: Coba Smart Kitchen.

### 4.2 Hero section

Pesan utama:

> Soto hangat, rasa yang pulang.

Isi:

- Foto utama `soto 1.jpeg`.
- Video latar muted sebagai opsi enhancement.
- Deskripsi singkat warung.
- Tombol `Lihat Menu`.
- Tombol `Buat Tiket Dapur`.

Hero harus lolos tes 5 detik: pengunjung langsung tahu nama usaha, produk, dan aksi utama.

### 4.3 Profil singkat

Menjelaskan Soto Sore Kalijambi sebagai warung dengan sajian soto ayam, minuman hangat/es, dan pelengkap.

### 4.4 Daftar menu

Menu dikelompokkan menjadi Soto, Minuman, dan Pelengkap. Harga ditampilkan dalam format Rupiah.

### 4.5 Smart Kitchen AI

Komponen:

- Textarea pesanan.
- Contoh input.
- Tombol `Buat Tiket`.
- Status proses.
- Pesan error.
- Tiket thermal hasil ekstraksi.
- Checkbox per item.
- Tombol reset.

### 4.6 Galeri

- Foto utama landscape.
- Foto pendukung portrait yang sudah dicrop dan diberi color grading.
- Tidak menampilkan kalender, QR acak, wadah, kaki, atau meja yang mengganggu.

### 4.7 Footer

- Nama usaha.
- Alamat/kontak jika nanti tersedia.
- QR Code URL publik.
- Catatan bahwa fitur AI adalah alat bantu pencatatan pesanan.

---

## 5. Data Master Menu

### Soto

| Nama | Alias input | Harga informasi |
|---|---|---:|
| Soto Ayam Porsi Besar | soto besar, soto gede | Rp8.000 |
| Soto Ayam Porsi Kecil | soto kecil | Rp4.000 |

### Minuman

| Nama | Alias input | Varian | Harga informasi |
|---|---|---|---:|
| Teh | teh, es teh, teh hangat | Es / Hangat | Rp3.000 |
| Jeruk | jeruk, es jeruk, jeruk hangat | Es / Hangat | Rp4.000 |
| Susu | susu, es susu, susu hangat | Es / Hangat | Rp4.000 |

### Pelengkap

| Nama | Alias input | Harga informasi |
|---|---|---:|
| Gorengan | gorengan, mendoan | Rp1.000 |
| Tusukan | tusukan, sate | Rp3.000 |
| Krupuk | krupuk, kerupuk | Rp1.000 |
| Pangsit | pangsit | Rp1.500 |

Harga hanya untuk informasi landing page. Backend AI tidak menghitung total.

---

## 6. Alur Pengguna

1. Pengunjung membuka landing page.
2. Pengunjung melihat hero dan menu.
3. Pengunjung membuka Smart Kitchen.
4. Pengunjung mengetik atau menempelkan pesanan.
5. Frontend mengirim teks ke endpoint backend.
6. Backend memvalidasi panjang dan isi input.
7. Backend mengirim prompt terstruktur ke provider AI.
8. Backend memvalidasi JSON balasan AI.
9. Frontend menampilkan tiket thermal.
10. Koki mencentang item yang selesai.
11. Koki membaca catatan khusus.
12. Petugas menekan reset untuk pesanan berikutnya.

Jika AI gagal atau JSON tidak valid, UI menampilkan error dan tidak mencetak tiket palsu.

---

## 7. Spesifikasi Fitur Smart Kitchen AI

### Input

- Satu textarea.
- Minimal 3 karakter.
- Maksimal 2.000 karakter.
- Teks wajib dikirim melalui HTTPS saat production.
- Jangan kirim API key ke browser.

### Prompt backend

```text
Kamu adalah sistem dapur Soto Sore Kalijambi.
Ekstrak pesanan pelanggan menjadi JSON valid saja.
Gunakan tiga kategori: Soto, Minuman, Pelengkap.
Catat nama item, qty, varian minuman jika ada, dan instruksi khusus.
Jangan menghitung harga.
Jangan menambah item yang tidak disebut pelanggan.
Jika jumlah tidak disebut, gunakan qty 1.
Jika item tidak dikenali, masukkan ke unknown_items dan jangan tebak.

Format JSON wajib:
{
  "Soto": [{"item": "", "qty": 0, "catatan": ""}],
  "Minuman": [{"item": "", "qty": 0, "varian": "", "catatan": ""}],
  "Pelengkap": [{"item": "", "qty": 0, "catatan": ""}],
  "unknown_items": []
}
```

### Contoh input uji

```text
Bang soto gede 2 yg satu ga pake kecap, soto kecil 1, mendoan 4, es teh 2, es susu 1
```

### Ekspektasi minimum

- Soto Ayam Porsi Besar — qty 2 — satu catatan `tanpa kecap`.
- Soto Ayam Porsi Kecil — qty 1.
- Gorengan/mendoan — qty 4.
- Teh — qty 2 — varian es.
- Susu — qty 1 — varian es.

Catatan: istilah `mendoan` dipetakan ke kategori Gorengan hanya jika alias tersebut dikonfirmasi sebagai menu yang sama. Jika belum dikonfirmasi, tampilkan sebagai `unknown_items` agar sistem tidak mengarang.

### Format tiket thermal

Header:

- SOTO SORE KALIJAMBI
- AI KITCHEN TICKET
- Waktu pembuatan

Isi:

- Checkbox selesai.
- Nama item.
- Jumlah.
- Varian minuman.
- Catatan khusus.

Footer:

- `Periksa tiket sebelum diracik.`

---

## 8. API dan Validasi

### `GET /api/health`

Response 200:

```json
{"status":"ok"}
```

### `POST /api/orders/parse`

Request:

```json
{"text":"es teh 2, soto gede 1 tanpa seledri"}
```

Response sukses 200:

```json
{
  "Soto": [{"item":"Soto Ayam Porsi Besar","qty":1,"catatan":"tanpa seledri"}],
  "Minuman": [{"item":"Teh","qty":2,"varian":"Es","catatan":""}],
  "Pelengkap": [],
  "unknown_items": []
}
```

Response validasi 400:

```json
{"error":"Pesanan wajib diisi dan harus berupa teks."}
```

Response provider gagal 502:

```json
{"error":"Layanan AI sedang tidak tersedia. Coba lagi."}
```

### Aturan keamanan

- API key hanya di server.
- Batasi panjang input.
- Rate limit endpoint production.
- Jangan menyimpan pesanan pelanggan tanpa kebutuhan jelas.
- Escape output sebelum render jika memakai HTML.
- Validasi ulang JSON dari provider AI.
- Jangan percaya nama item, qty, atau catatan dari model tanpa schema validation.

---

## 9. Rancangan Teknologi

### Pilihan awal

- Frontend: HTML semantik, CSS responsive, JavaScript native.
- Backend: Bun `Bun.serve()` atau Node.js native.
- Database: tidak diperlukan untuk MVP jika tiket tidak disimpan.
- AI: provider API melalui backend.
- Deployment: Netlify atau Vercel.
- QR Code: dibuat setelah URL deployment final tersedia.

### MySQL

MySQL **belum diperlukan**. Sistem versi pertama tidak butuh akun, transaksi, stok, atau histori pesanan. Database baru ditambahkan jika diperlukan:

- Histori tiket.
- Dashboard admin.
- Pengelolaan menu melalui panel.
- Statistik pesanan.
- Multi-user dan audit log.

Jika fitur tersebut diminta, gunakan SQLite untuk MVP lokal atau MySQL/PostgreSQL untuk deployment multi-user. Jangan mengaktifkan MySQL sebelum kebutuhan penyimpanan disetujui.

---

## 10. Rancangan Visual

### Arah desain

Premium, hangat, bersih, dan menggugah selera. Referensi nuansa: editorial restoran modern seperti Zomato, tetapi identitas tetap warung lokal Soto Sore Kalijambi.

### Warna

- Dominan: krem hangat `#FFF8ED`.
- Struktur: cokelat gelap `#2A1B12`.
- Aksen: kuning kuah `#E9A227`.
- Aksen sekunder: merah cabai `#A93622`.
- Surface tiket: putih `#FFFFFF`.
- Teks sekunder: cokelat abu `#75675D`.

Gunakan prinsip 60-30-10. Aksen kuning/merah hanya untuk CTA, label, dan focal point.

### Tipografi

- Heading: serif display hangat atau font display yang mudah dibaca.
- Body: sans-serif dengan keterbacaan tinggi.
- Maksimal dua keluarga font.
- Body 16–18 px.
- Line-height body 1.5–1.65.
- Lebar paragraf maksimal 65ch.

### Responsive

- Mobile: 360–767 px.
- Tablet: 768–1023 px.
- Desktop: 1024 px ke atas.
- Touch target minimal 44×44 px.
- Tidak boleh ada horizontal scroll.

---

## 11. Rencana Pengolahan Aset Foto

### Foto utama — `soto 1.jpeg`

Gunakan sebagai hero. Foto sudah paling kuat secara komposisi: mangkuk dominan, kuah keemasan, garnish berwarna, dan sendok bebek kuning sebagai ciri khas.

Perbaikan yang disarankan:

- Buat crop 16:9.
- Sediakan ruang kosong di sisi kiri atau kanan untuk teks.
- Kurangi distraksi sendok jika bertabrakan dengan teks.
- Naikkan brightness kuah dan suwiran ayam secara selektif.
- Pertahankan warm tone, tetapi jangan sampai terlalu oranye.
- Tambahkan uap hanya jika hasil terlihat alami.

### Foto pendukung — `soto 2.jpeg`

Masalah: kalender 2026, QR/sign, jendela terang, wadah, plastik, dan kaki terlihat di latar.

Treatment:

- Crop 4:5 atau square.
- Pertahankan mangkuk penuh.
- Hapus objek latar dengan healing/clone/generative fill.
- Netralisasi cast magenta.
- Turunkan highlight jendela.
- Naikkan detail garnish secara selektif.
- Jangan oversaturate kuah.

### Foto pendukung — `soto 3.jpeg`

Masalah: meja hijau berpola, wadah, kaki/pakaian, glare flash, dan fokus agak lembut.

Treatment:

- Crop 4:5 atau square.
- Hapus wadah dan objek di tepi.
- Netralisasi cast hijau.
- Turunkan highlight mangkuk dan sendok.
- Tambahkan sharpening ringan pada makanan saja.
- Kurangi saturasi hijau meja.
- Hindari clarity berlebihan.

### Prompt enhancement foto

```text
Enhance this Indonesian chicken soto food photograph for a premium warm restaurant website. Preserve the original bowl, ingredients, garnish, spoon, and food identity. Improve sharpness, texture, white balance, natural golden broth color, and appetizing warm light. Remove distracting background objects, clutter, plastic, calendars, containers, people, stains, and random QR signs. Keep the food realistic. Do not invent ingredients, change the bowl shape, add text, add logos, or make the broth unnaturally saturated. Leave clean negative space for website copy when requested. Commercial food photography, natural steam, clean editorial composition, high detail.
```

AI enhancement wajib dibandingkan dengan foto asli. Jangan memakai hasil jika bentuk makanan menjadi palsu atau detail penting berubah.

---

## 12. Spesifikasi Video Hero 5 Detik

### Output

- Format MP4.
- 16:9 landscape.
- Target 1920×1080.
- Durasi 5 detik.
- 24 atau 30 fps.
- Tanpa suara.
- Loop halus jika memungkinkan.
- File dikompresi agar tidak memperlambat halaman.
- Sediakan poster image untuk kondisi video belum dimuat.

### Storyboard

- 0.0–1.8 detik: close-up kuah soto kuning keemasan mendidih pelan.
- 1.8–3.8 detik: kuah dituangkan perlahan ke mangkuk berisi suwiran ayam, tauge, bihun, dan garnish.
- 3.8–5.0 detik: uap panas naik, kamera menahan hero shot.

### Prompt video

```text
Premium cinematic food commercial, close-up Indonesian chicken soto in a clean warm restaurant kitchen. Golden turmeric broth gently simmering, slow motion ladle pouring hot broth into a white bowl filled with shredded chicken, bean sprouts, noodles, scallions, cilantro, lime, and fried shallots. Natural steam rises beautifully. Warm amber light, shallow depth of field, elegant editorial restaurant style, clean background, realistic food texture, stable camera, appetizing but authentic, landscape 16:9, 5 seconds, no text, no logo, no people, no audio.
```

Jika generator video tidak tersedia, gunakan foto hero sebagai poster sementara. Jangan menyatakan video selesai sebelum file MP4 benar-benar ada dan bisa diputar.

---

## 13. Deployment

### Netlify

1. Pastikan project dapat dijalankan lokal.
2. Jalankan build jika project memakai bundler.
3. Deploy folder output ke Netlify.
4. Periksa status build `Success`.
5. Atur environment variable AI di dashboard Netlify.
6. Tes URL production dari mode incognito.

### Vercel

1. Import repository atau upload project.
2. Atur framework dan build command sesuai manifest.
3. Tambahkan environment variable AI.
4. Deploy.
5. Periksa deployment status `Ready`.
6. Tes URL production dari mode incognito.

API key tidak boleh ditulis di file frontend, HTML, JavaScript browser, atau repository publik.

---

## 14. QR Code

QR Code dibuat setelah URL final aktif. Syarat:

- PNG resolusi tinggi minimal 1.000×1.000 px.
- Margin putih cukup.
- Kontras hitam-putih kuat.
- URL tidak berubah setelah dicetak.
- Tes scan memakai minimal dua perangkat.
- Letakkan di footer dan siapkan file terpisah untuk laporan/cetak.

Placeholder URL:

```text
https://URL-PRODUCTION-DI-SINI
```

QR Code belum dapat dibuat final sebelum URL Netlify/Vercel diberikan atau deployment berhasil.

---

## 15. QA dan Acceptance Test

### Functional

- [ ] `/api/health` mengembalikan 200.
- [ ] Input kosong ditolak 400.
- [ ] Input terlalu panjang ditolak.
- [ ] Pesanan normal menghasilkan tiket.
- [ ] Qty benar.
- [ ] Varian es/hangat benar.
- [ ] Catatan khusus tampil.
- [ ] Item unknown tidak ditebak.
- [ ] Checkbox dapat dicentang.
- [ ] Reset mengosongkan tiket.
- [ ] Provider AI error menampilkan fallback.

### Visual

- [ ] Hero terbaca dalam 5 detik.
- [ ] Foto tidak pecah pada desktop.
- [ ] Foto portrait tidak menampilkan objek mengganggu.
- [ ] Tiket terlihat seperti thermal paper.
- [ ] Kontras teks memenuhi WCAG AA.
- [ ] Touch target minimal 44 px.
- [ ] Tidak ada horizontal overflow.

### Runtime

- [ ] Tes desktop.
- [ ] Tes mobile viewport.
- [ ] Tes incognito production.
- [ ] Tes jaringan lambat.
- [ ] Tes API key tidak terlihat di browser.
- [ ] Ukur respons AI target di bawah 5 detik.
- [ ] Pastikan console tidak memiliki error kritis.
- [ ] Pastikan QR Code membuka URL production.

### Bukti penyerahan

- Screenshot desktop.
- Screenshot mobile.
- Screenshot tiket hasil uji.
- URL production.
- QR Code PNG.
- Video demo maksimal 2 menit.
- Berita acara serah terima.

---

## 16. Status Saat Ini

- [x] Dokumen perancangan dibuat.
- [x] Data menu dan harga dirangkum.
- [x] Kebutuhan AI dirumuskan.
- [x] Rencana visual foto dirumuskan.
- [x] Prompt enhancement foto dibuat.
- [x] Prompt video 5 detik dibuat.
- [x] Kebutuhan deployment dan QR Code dirumuskan.
- [ ] Website frontend dibuat.
- [ ] Backend AI dibuat.
- [ ] Foto hasil enhancement dibuat.
- [ ] Video MP4 dibuat.
- [ ] Deployment Netlify/Vercel dilakukan.
- [ ] QR Code final dibuat.
- [ ] QA end-to-end dilakukan.

---

## 17. Kebutuhan Sebelum Implementasi

1. API key provider AI, jika fitur AI production benar-benar dipakai.
2. Konfirmasi alias `mendoan` = `gorengan`.
3. URL deployment setelah Netlify/Vercel selesai.
4. Alamat, nomor WhatsApp, jam buka, dan titik lokasi jika ingin ditampilkan.
5. Persetujuan apakah pesanan boleh disimpan atau hanya diproses sementara.

**MySQL belum perlu diaktifkan untuk tahap awal.**

