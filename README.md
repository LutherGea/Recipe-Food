1. Deskripsi Proyek

    RecipePal dibuat untuk memenuhi tugas UAS mata kuliah *Kerangka Kerja Pengembangan Antarmuka Website*. Aplikasi ini menampilkan kumpulan resep makanan dari API atau dummy data lokal, memungkinkan pengguna untuk menandai resep favorit, memberikan rating, dan menulis catatan pribadi.


2. API yang Digunakan

    "Spoonacular API"
    Endpoint yang digunakan:  
    - `https://api.spoonacular.com/recipes/complexSearch`
    - `https://api.spoonacular.com/recipes/{id}/information`  
    Fallback ke dummy data akan dilakukan jika API gagal.


3. Fitur-Fitur Utama

    1. Pencarian resep
    2. Jelajahi resep berdasarkan kategori
    3. Tambah ke favorit
    4. Catatan pribadi untuk tiap resep
    5. Beri rating resep
    6. Autentikasi login (dummy)
    7. Data favorit disimpan di LocalStorage
    8. Dukungan tema gelap/terang
    9. Notifikasi interaktif dengan toast



4. Struktur Halaman & Routing

        recipe-pal-frontend/
    ├── public/
    │   ├── favicon.ico
    │   ├── placeholder.svg
    │   ├── robots.txt
    │
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx                 # Komponen navigasi utama
    │   │   └── ui/                        # Komponen dari shadcn/ui
    │   │       └── ...                   
    │
    │   ├── contexts/
    │   │   ├── AuthContext.tsx           # Konteks autentikasi global
    │   │   └── FavoritesContext.tsx      # Konteks favorit global
    │
    │   ├── hooks/
    │   │   └── use-toast.ts              # Custom hook untuk toast notifikasi
    │
    │   ├── pages/                        # Semua halaman utama
    │   │   ├── Home.tsx                  # Beranda resep
    │   │   ├── Search.tsx                # Halaman pencarian resep
    │   │   ├── Categories.tsx            # Halaman kategori resep
    │   │   ├── RecipeDetail.tsx          # Halaman detail resep
    │   │   ├── Favorites.tsx             # Halaman daftar favorit
    │   │   ├── Login.tsx                 # Halaman login (dummy)
    │   │   └── NotFound.tsx              # Halaman 404 jika route tidak ditemukan
    │
    │   ├── services/
    │   │   └── api.ts                    # Fungsi pemanggilan API / dummy fetch
    │
    │   ├── App.tsx                       # Entry point utama React + Routing
    │   ├── main.tsx                      # Root rendering React DOM
    │   ├── index.css                     # Styling global
    │   └── vite-env.d.ts                 # Deklarasi lingkungan Vite
    │
    ├── .env                              # Environment variables (API Key, dll)
    ├── .gitignore                        # File dan folder yang diabaikan Git
    ├── package.json                      # Dependency dan script npm
    ├── tsconfig.json                     # Konfigurasi TypeScript
    ├── tailwind.config.ts                # Konfigurasi TailwindCSS
    ├── vite.config.ts                    # Konfigurasi build tool Vite
    └── README.md                         # Dokumentasi proyek


5. Cara Menjalankan Secara Lokal

    1. Clone repository dari github
    2. Install dependency dengan mengetik "npm install"
    3. Jalankan development server "npm run dev"
    4. Buka di browser (Chrome/Microsoft Edge) dengan alamat sesuai dengan localhost yanbg tertera
