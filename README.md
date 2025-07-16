# News Hub

Aplikasi web open source untuk menampilkan berita terbaru dari seluruh dunia menggunakan [NewsAPI](https://newsapi.org/). Dibangun dengan Next.js (App Router), TypeScript, dan Ant Design untuk tampilan modern dan responsif.

## Fitur
- List view: Daftar berita terbaru, filter kategori, dan pencarian berita.
- Detail view: Lihat detail berita, gambar, tanggal, dan author.
- Loading & error handling yang user-friendly.
- UI/UX modern dengan Ant Design.

## Instalasi
1. **Install dependencies:**
   ```bash
   npm install
   ```
   Jika error pakai
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Dapatkan API Key dari [NewsAPI](https://newsapi.org/)**
3. **Buat file `.env.local` di root project:**
   ```env.local
   NEWS_API_KEY=masukkan_api_key_anda_disini
   ```
4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
5. **Demo**
   ```bash
   Jalankan secara lokal di `http://localhost:3000`
   ```

## Testing
Jalankan semua test dengan:
```bash
npm run test
```
- Mock `window.matchMedia` sudah otomatis aktif di semua test (lihat `jest.setup.js`).
- Jika ada error terkait Ant Design dan matchMedia, pastikan tidak mengubah setup Jest dan mock.

## Build Production
```bash
npm run build
npm run start
```
Production harusnya berjalan di `http://localhost:3000`

## Struktur Project
```
app/
  page.tsx           # List berita (harus diawali 'use client')
  article/[url]/     # Detail berita (berdasarkan url, bukan title)
  layout.tsx         # Layout root (harus import React)
components/          # Komponen UI
lib/                 # Helper/API
styles/              # Styling
```

## Stack Teknologi
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [NewsAPI](https://newsapi.org/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)

## Test Component Jest Passed + Test Algoritma
- File Component Jest Passed ada pada file `Test_with_jest.png`
- File hasil test algoritma berada di dalam file `eigen_test_algoritma.zip`
