# Audit PT CBA - Visualisasi Dana 3 Miliar

Aplikasi web untuk visualisasi dan tracking audit dana PT CBA senilai 3 miliar rupiah.

## Fitur

- 📊 **Tabel Audit Interaktif** - CRUD operations untuk data transaksi
- 💰 **Mapping Alur Dana** - Visualisasi distribusi dana dengan status
- 📝 **Langkah-langkah Audit** - Panduan sistematis proses audit
- ❓ **Pertanyaan Kunci** - Daftar pertanyaan penting untuk investigasi

## Deployment ke GitHub Pages

### Langkah 1: Setup Repository
1. Buat repository baru di GitHub dengan nama `audit-cba`
2. Push semua file ke repository tersebut

### Langkah 2: Konfigurasi GitHub Pages
1. Masuk ke repository di GitHub
2. Klik **Settings** > **Pages**
3. Di bagian **Source**, pilih **GitHub Actions**

### Langkah 3: Update Konfigurasi
Edit file `vite.config.ts` dan ganti `'/audit-cba/'` dengan nama repository Anda:

\`\`\`typescript
export default defineConfig({
  plugins: [react()],
  base: '/nama-repository-anda/',  // Ganti dengan nama repository
})
\`\`\`

### Langkah 4: Deploy
1. Push ke branch `main`
2. GitHub Actions akan otomatis build dan deploy
3. Website akan tersedia di: `https://username.github.io/nama-repository/`

## Development

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### Build untuk Production
\`\`\`bash
npm run build
\`\`\`

### Preview Build
\`\`\`bash
npm run preview
\`\`\`

## Tech Stack

- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS untuk styling
- ⚡ Vite untuk building dan development
- 🚀 GitHub Pages untuk hosting
- 🔧 GitHub Actions untuk CI/CD

## Status Audit

- 🟢 **Verified** - Terdokumentasi lengkap
- 🟡 **Partial** - Perlu konfirmasi tambahan
- 🟠 **Risk** - Validitas diragukan
- 🔴 **Critical** - Prioritas investigasi tinggi