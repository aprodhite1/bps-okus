# SIKALIS

Aplikasi Manajemen Kegiatan adalah platform web untuk mengelola, memantau, dan mengevaluasi kegiatan dalam organisasi. Aplikasi ini dibangun dengan Next.js, Firebase, dan TypeScript, dengan antarmuka yang responsif dan mendukung mode gelap/terang.

✨ Fitur Utama
🎯 Manajemen Kegiatan

Dashboard Kegiatan - Melihat semua kegiatan yang aktif

Filter Status - Memfilter berdasarkan status (draft, published, selesai)

Progress Tracking - Memantau progress per pegawai dan keseluruhan

Penandaan Selesai - Admin dapat menandai kegiatan sebagai selesai


👥 Manajemen Pengguna

Multi-role System - User, Admin, dan Superadmin

Protected Routes - Akses berdasarkan role pengguna

Progress Individual - Setiap user dapat mengupdate progress mereka


📊 Monitoring dan Reporting

Statistik Real-time - Progress keseluruhan dan per kegiatan

Excel Export - Download data feedback dalam format Excel

Multiple Feedback - Sistem feedback berbasis array untuk multiple input


💬 Sistem Feedback

Feedback Detail - Saran, tindak lanjut, dan bukti dukung

Halaman Terpisah - Form feedback yang dedicated


🛠️ Teknologi yang Digunakan

Frontend

Next.js 14 - React framework dengan App Router

TypeScript - Type safety dan maintainability

Tailwind CSS - Styling dan responsive design

Firebase Client SDK - Client-side operations


Backend & Database

Firebase Firestore - Database real-time

Firebase Auth - Authentication system

Firebase Security Rules - Database security


Development Tools

ESLint - Code linting

Prettier - Code formatting


## Installation

### Prerequisites

🔧 Installation & Setup

Prerequisites

Node.js 18+

npm atau yarn

Akun Firebase


### Cloning the Repository

Clone the repository using the following command:


```bash
git clone https://github.com/aprodhite1/bps-okus
```

> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
    > Use `--legacy-peer-deps` flag if you face peer-dependency error during installation.

2. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```


