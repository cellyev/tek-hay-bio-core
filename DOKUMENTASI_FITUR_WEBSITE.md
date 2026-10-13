# Dokumentasi Fitur Website Profil Klenteng Tek Hay Bio

---

## 1. Pendahuluan

### 1.1 Latar Belakang
Klenteng Tek Hay Bio, Semarang, merupakan salah satu cagar budaya dan tempat ibadah bersejarah bagi masyarakat Tionghoa dan penganut Tridharma di Kota Semarang. Sebagai warisan leluhur yang kaya akan nilai historis, spiritualitas, arsitektur klasik, serta tradisi keagamaan dan kebudayaan, Klenteng Tek Hay Bio memerlukan media komunikasi modern untuk mendokumentasikan dan mempublikasikan identitasnya kepada khalayak luas.

Melalui pengembangan website profil digital berbasis web modern, seluruh rekam jejak sejarah, informasi kegiatan ibadah, layanan sosial-keagamaan, artikel berita, dan dokumentasi visual klenteng dapat diakses secara terbuka, transparan, dan terpercaya oleh umat, peneliti, wisatawan, maupun masyarakat umum.

### 1.2 Tujuan Dokumentasi
Dokumen ini disusun untuk memberikan gambaran komprehensif, akurat, dan terstruktur mengenai seluruh fitur fungsional serta halaman yang telah diimplementasikan dalam sistem website profil Klenteng Tek Hay Bio. Dokumen ini bertujuan untuk:
1. Menjadi acuan fungsional bagi pengurus dan administrator klenteng dalam mengoperasikan panel pengelolaan konten (*Content Management System*).
2. Memberikan pemahaman menyeluruh bagi tim pengembang (*developer*) dan penguji sistem mengenai arsitektur fitur, keterkaitan data, serta batasan sistem yang ada.
3. Menyediakan dokumentasi akademik dan teknis formal yang dapat dipertanggungjawabkan untuk keperluan evaluasi proyek, laporan kemajuan, dan pengujian kelayakan sistem.

### 1.3 Ruang Lingkup
Dokumentasi ini mencakup:
- **Analisis Fitur Publik:** Semua interaksi, penyajian konten, navigasi, dan fitur yang dapat diakses oleh pengunjung umum pada website tanpa memerlukan proses autentikasi.
- **Analisis Fitur Administratif:** Seluruh alur kerja dan operasional pada dashboard custom admin, mencakup autentikasi, manajemen konten berita, kategori, kegiatan, layanan, sejarah, galeri media, informasi kontak, konfigurasi beranda, serta pembagian kewenangan pengguna.
- **Inventarisasi Halaman & Rute:** Pemetaan seluruh rute (*routing*) aplikasi Next.js (App Router), baik halaman publik dwibahasa (Indonesia & Inggris) maupun antarmuka administratif.
- **Matriks Fungsional & Keterbatasan:** Evaluasi objektif tingkat kelengkapan operasi CRUD (*Create, Read, Update, Delete*), proteksi referensi media, mekanisme revalidasi *cache*, serta catatan fitur yang belum diimplementasikan secara penuh.

### 1.4 Gambaran Umum Website
Website profil Klenteng Tek Hay Bio dibangun menggunakan fondasi teknologi modern:
- **Framework Aplikasi:** Next.js (App Router) dengan TypeScript dan arsitektur Server Components (RSC) serta Server Actions untuk mutasi data yang aman dan cepat.
- **Content Management System (CMS):** Payload CMS (v3) berbasis *headless architecture* yang terintegrasi langsung dalam siklus hidup (*monorepo runtime*) Next.js.
- **Basis Data:** MongoDB dengan konektor Mongoose Adapter.
- **Penyimpanan Media:** Integrasi Vercel Blob Storage serta penyimpanan lokal multi-koleksi media tersegregasi.
- **Antarmuka Pengguna:** Custom Admin Dashboard berbasis Tailwind CSS yang dirancang khusus untuk kenyamanan pengurus klenteng, dilengkapi editor teks kaya (*Lexical Rich Text Editor*) dan sistem pemilih media interaktif.
- **Dukungan Dwibahasa (*Localization*):** Dukungan penuh bahasa Indonesia (`id`) sebagai bahasa utama dan bahasa Inggris (`en`) sebagai bahasa internasional, dengan mekanisme fallback cerdas.

---

## 2. Gambaran Umum Sistem

### 2.1 Website Publik
Website publik merupakan antarmuka digital yang diakses oleh masyarakat umum. Antarmuka ini dirancang dengan estetika oriental-kontemporer yang khidmat, bersih, dan responsif untuk berbagai perangkat (desktop, tablet, dan smartphone).

Fungsi utama website publik meliputi:
- Menyajikan profil, visi, identitas, dan keunikan Klenteng Tek Hay Bio.
- Menampilkan garis waktu (*historical timeline*) perjalanan klenteng secara kronologis.
- Menginformasikan jadwal agenda kegiatan ritual, kebudayaan, dan sosial mendatang.
- Menjelaskan layanan keagamaan dan fasilitas yang tersedia untuk umat.
- Menyediakan artikel berita terkini, pengumuman, dan arsip publikasi klenteng.
- Menampilkan arsip foto visual arsitektur, interior, dan tradisi.
- Menyediakan panduan alamat fisik, jam kunjungan, nomor kontak (WhatsApp), email, serta integrasi peta lokasi interaktif.

### 2.2 Admin Dashboard
Sistem menyediakan antarmuka khusus pengelolaan konten yang terpisah dari tampilan publik. Menariknya, sistem ini mengimplementasikan **dua lapis panel administrasi**:
1. **Custom Admin Dashboard (`/admin`):** Antarmuka utama yang dirancang khusus (*custom-built*) dengan komponen modern, navigasi berbahasa Indonesia, tab pengelolaan bahasa terpadu, dan formulir yang disederhanakan agar mudah digunakan oleh pengurus klenteng sehari-hari.
2. **Payload Native Admin (`/admin-payload`):** Antarmuka bawaan Payload CMS yang berfungsi sebagai pusat kendali tingkat lanjut (*advanced administration*), manajemen skema, dan operasional darurat bagi pengembang sistem.

### 2.3 Pengguna dan Hak Akses
Sistem mengimplementasikan kontrol akses berbasis peran (*Role-Based Access Control* / RBAC) yang ketat pada tingkat Payload Collection `users` maupun Server Actions:

| Peran (*Role*) | Deskripsi & Hak Akses | Ruang Lingkup Kewenangan |
|---|---|---|
| **Super Admin** (`super_admin`) | Tingkat kewenangan tertinggi sistem. Memiliki akses penuh terhadap seluruh fitur konten dan pengaturan sistem. | - Mengelola semua konten (Berita, Kategori, Kegiatan, Layanan, Galeri).<br>- Mengubah Pengaturan Global (Informasi Website, Sejarah, Beranda).<br>- Mengakses daftar pengguna (`/admin/pengguna`) dan membuat pengguna baru.<br>- Mengakses halaman pengaturan lanjutan (`/admin/pengaturan`) dan Payload Admin asli. |
| **Editor** (`editor`) | Tingkat kewenangan operasional harian konten. | - Membuat, membaca, memperbarui, dan menghapus Berita, Kegiatan, dan Layanan.<br>- Mengunggah dan mengelola media pada Galeri.<br>- Mengubah konten Halaman Sejarah.<br>- **Dilarang** mengubah Identitas Website / Kontak Klenteng.<br>- **Dilarang** mengakses daftar akun pengguna (`/admin/pengguna`).<br>- **Dilarang** membuka halaman pengaturan sistem (`/admin/pengaturan`). |
| **Pengunjung Publik** (*Guest*) | Pengguna umum tanpa login (*unauthenticated*). | - Hanya memiliki hak baca (*read-only*) terhadap konten yang berstatus `published`. |

### 2.4 Hubungan Pengelolaan Konten dengan Website Publik
Data yang dimasukkan atau diperbarui oleh administrator di dashboard terhubung langsung dengan website publik melalui arsitektur terpadu:
1. **Pemisahan Status Draft dan Publikasi:** Pada koleksi Berita, Kegiatan, dan Layanan, konten memiliki atribut status `draft` dan `published`. Konten berstatus `draft` hanya dapat dilihat di Admin Dashboard dan **tidak akan dirender** pada halaman website publik.
2. **On-Demand Cache Revalidation:** Sistem memanfaatkan hooks `afterChange` dan `afterDelete` pada Payload CMS (`src/payload/hooks/revalidate.ts`). Setiap kali ada perubahan data (simpan/hapus), Next.js secara otomatis merevalidasi jalur halaman terkait (`revalidatePath`), sehingga perubahan data langsung tampil pada website publik tanpa perlu menunggu *rebuild* aplikasi atau *restart server*.
3. **Penyimpanan Terstruktur Rich Text:** Konten artikel, sejarah, dan deskripsi kegiatan menggunakan struktur JSON berbasis Lexical Editor. Di sisi publik, komponen `RichText` merender node Lexical menjadi elemen semantik HTML yang rapi dan aman dari serangan XSS.
4. **Relasi Data Antar-Entitas:** Berita dapat berelasi dengan Kategori (`categories`), Penulis (`users`), dan Gambar Unggulan (`news-media`). Saat berita ditampilkan di publik, relasi kategori dan gambar di-resolve secara dinamis.

### 2.5 Dukungan Bahasa (*Localization*)
Website dirancang dengan arsitektur dwibahasa bawaan (*first-class internationalization*):
- **Kode Bahasa yang Didukung:** Bahasa Indonesia (`id`) sebagai bahasa default (*fallback*), dan Bahasa Inggris (`en`).
- **Pola Routing Publik:** Semua rute publik memiliki prefix kode bahasa di URL, misalnya `/id/berita` untuk bahasa Indonesia dan `/en/news` untuk bahasa Inggris.
- **Pemisahan URL Semantik:** Rute publik tidak hanya mengubah parameter bahasa, tetapi juga menggunakan slug URL yang disesuaikan secara semantik dengan bahasa yang bersangkutan (misal: `/id/tentang-kami` berpasangan dengan `/en/about`; `/id/kegiatan` berpasangan dengan `/en/activities`).
- **Pengelolaan Bahasa di Dashboard:** Formulir admin menyediakan komponen `LocaleTabs` (tab ID dan EN). Administrator dapat mengisi teks versi Indonesia dan versi Inggris dalam satu layar kerja tanpa berpindah halaman. Jika teks bahasa Inggris tidak diisi, sistem Payload CMS secara otomatis menggunakan data bahasa Indonesia sebagai *fallback*.

---

## 3. Dokumentasi Fitur Website Publik

### 3.1 Homepage (Beranda)
- **URL / Rute Aktual:** `/[locale]` (misal: `http://localhost:3000/id` dan `http://localhost:3000/en`)
- **Tujuan Halaman:** Menjadi pintu gerbang informasi utama yang memberikan impresi visual klenteng, ringkasan sejarah, keunikan arsitektur, serta menampilkan sorotan kegiatan dan berita terbaru.
- **Sumber Data:** Payload Global `home-page`, `site-settings`, `contact-information`, `history`, serta query otomatis 3 data teratas dari koleksi `services`, `activities`, `posts`, dan 6 gambar dari `gallery-media`.
- **Komponen & Bagian Konten:**
  1. **Hero Section (`HomeHero.tsx`):** Menampilkan judul utama klenteng, slogan (*tagline*), gambar latar belakang sinematik, serta tombol panggilan aksi (*Call-to-Action*) menuju halaman Sejarah dan Kontak.
  2. **Introduction Section (`HomeHero.tsx`):** Blok teks sambutan hangat yang memperkenalkan eksistensi Klenteng Tek Hay Bio dengan tautan penjelajahan ke Tentang Kami.
  3. **Short History Section (`HomeHistory.tsx`):** Ringkasan sejarah klenteng ("Jejak Waktu") berdampingan dengan arsip visual dan tombol pintas ke linimasa sejarah lengkap.
  4. **Uniqueness Section (`HomeHistory.tsx`):** Bagian berlatar gelap yang menyajikan nilai luhur, filosofi arsitektur, dan warisan tradisi melalui kartu visual fitur keunikan.
  5. **Services Section (`HomeLists.tsx`):** Menampilkan maksimal 3 kartu layanan unggulan yang berstatus `published` dengan urutan `sortOrder`.
  6. **Activities Section (`HomeLists.tsx`):** Menampilkan maksimal 3 agenda kegiatan ritual/budaya mendatang, lengkap dengan kalender tanggal dan lokasi.
  7. **News Section (`HomeLists.tsx`):** Menampilkan maksimal 3 artikel berita terbaru yang sudah diterbitkan.
  8. **Gallery Preview Section (`HomeCTA.tsx`):** Kolase 6 foto dokumentasi visual terbaru dengan efek *hover overlay*.
  9. **Location CTA Section (`HomeCTA.tsx`):** Kartu ajakan berkunjung yang merangkum alamat, jam operasional, tombol pembuka Google Maps, dan peta lokasi interaktif.
- **Fitur Pengunjung:** Penjelajahan informasi terpadu, navigasi langsung ke halaman detail, pengalihan bahasa instan melalui Navbar, serta tautan langsung ke Google Maps dan WhatsApp.

### 3.2 Tentang Kami
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/tentang-kami` (misal: `/id/tentang-kami`)
  - Versi EN: `/[locale]/about` (misal: `/en/about`)
- **Tujuan Halaman:** Menyajikan profil naratif yang mendalam mengenai filosofi, latar belakang pendirian, dan identitas Klenteng Tek Hay Bio.
- **Sumber Data:** Payload Global `history` (`title`, `shortDescription`, dan `content`).
- **Komponen Utama:**
  - `PageHeader`: Menampilkan judul halaman dan deskripsi pembuka profil.
  - `RichText`: Merender isi narasi sejarah dan profil secara lengkap dalam tipografi artikel yang nyaman dibaca.
- **Fitur Pengunjung:** Membaca profil resmi klenteng dalam bahasa Indonesia atau Inggris.

### 3.3 Sejarah Klenteng
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/sejarah` (misal: `/id/sejarah`)
  - Versi EN: `/[locale]/history` (misal: `/en/history`)
- **Tujuan Halaman:** Mendokumentasikan perjalanan historis Klenteng Tek Hay Bio dari masa awal pendirian hingga era modern dalam bentuk visual kronologis.
- **Sumber Data:** Payload Global `history` (khususnya field array `timeline`).
- **Komponen Utama:**
  - Garis Waktu Interaktif (*Vertical Timeline*): Garis vertikal dengan simpul tahun yang menghubungkan peristiwa demi peristiwa.
  - Kartu Peristiwa Kronologis: Menampilkan angka tahun, lencana status verifikasi sejarah, judul peristiwa, uraian deskriptif, dan foto dokumen/arsip peninggalan.
- **Perilaku Khusus:** Jika suatu peristiwa memiliki status verifikasi `under_research`, sistem menampilkan label khusus (*badge*) "Dalam Penelitian" (ID) atau "Under Research" (EN), memberikan transparansi akademik kepada pengunjung mengenai keabsahan data sejarah.

### 3.4 Berita
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/berita` (misal: `/id/berita`)
  - Versi EN: `/[locale]/news` (misal: `/en/news`)
- **Tujuan Halaman:** Menampilkan daftar artikel warta, liputan acara, dan pengumuman resmi klenteng kepada publik.
- **Sumber Data:** Koleksi `posts` dengan kondisi filter `status = 'published'` dan diurutkan berdasarkan `publishedAt` terbaru secara menurun (`-publishedAt`).
- **Komponen Utama:**
  - Kisi Artikel (*Article Grid*): Menampilkan kartu berita dengan aspek rasio gambar 3:2, tanggal publikasi yang diformat lokal, lencana kategori, judul berita, dan ringkasan kutipan (*excerpt*).
  - Komponen Paginasi (`Pagination.tsx`): Navigasi perpindahan halaman berita jika jumlah artikel melebihi batas batas (default 9 artikel per halaman).
- **Fitur Pengunjung:** Memilih artikel untuk dibaca selengkapnya, melihat kategori artikel, dan berpindah halaman melalui kontrol nomor halaman, tombol *Previous*, dan *Next*.

### 3.5 Detail Berita
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/berita/[slug]` (misal: `/id/berita/perayaan-tahun-baru-imlek-2576`)
  - Versi EN: `/[locale]/news/[slug]` (misal: `/en/news/chinese-new-year-celebration-2576`)
- **Tujuan Halaman:** Menyajikan isi artikel berita secara lengkap dan mendalam.
- **Sumber Data:** Dokumen tunggal dari koleksi `posts` yang dicocokkan berdasarkan `slug` dan `locale` aktif.
- **Komponen Utama:**
  - Tombol Navigasi Kembali: Tautan breadcrumb cepat untuk kembali ke daftar berita.
  - Header Berita: Menampilkan tanggal publikasi lengkap dengan hari, nama kategori, dan judul utama bertipografi besar.
  - Gambar Utama (*Featured Image*): Penayangan gambar utama artikel dalam rasio video (16:9) berkualitas tinggi.
  - Kutipan Pembuka (*Lead Excerpt*): Paragraf penjelas yang disorot dengan gaya tipografi miring (*italic*).
  - Konten Rich Text: Isi artikel lengkap dengan dukungan paragraf, subjudul (H1-H6), daftar berpoin/bernomor, kutipan (*blockquote*), garis pembatas, tautan eksternal, dan gambar sisipan.
- **Perilaku Khusus:** Jika slug berita tidak ditemukan atau status berita masih berstatus `draft`, server langsung melempar respon `notFound()` (halaman 404), mencegah kebocoran konten yang belum dipublikasikan.

### 3.6 Galeri
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/galeri` (misal: `/id/galeri`)
  - Versi EN: `/[locale]/gallery` (misal: `/en/gallery`)
- **Tujuan Halaman:** Menampilkan repositori dokumentasi foto visual keindahan klenteng, ornamen, upacara, dan kegiatan keagamaan.
- **Sumber Data:** Koleksi `gallery-media` diurutkan berdasarkan `-updatedAt` dengan paginasi (12 foto per halaman).
- **Komponen Utama:**
  - Grid Galeri Responsif: Penataan foto dalam format kotak 1:1 (2 kolom di mobile, 3 kolom di tablet, 4 kolom di desktop).
  - Hover Overlay Interaktif: Efek transisi saat kursor diarahkan ke foto yang menampilkan judul foto/alt text dan kategori foto (misal: *Building*, *Interior*, *Activities*, *History*, *Traditions*).
  - Komponen Paginasi: Kontrol navigasi halaman galeri.
- **Fitur Pengunjung:** Eksplorasi foto visual beresolusi tinggi dengan penyesuaian ukuran otomatis melalui komponen `MediaImage`.

### 3.7 Kegiatan
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/kegiatan` (misal: `/id/kegiatan`)
  - Versi EN: `/[locale]/activities` (misal: `/en/activities`)
- **Tujuan Halaman:** Menginformasikan jadwal agenda kegiatan klenteng, baik ritual keagamaan, perayaan tradisi, maupun bakti sosial.
- **Sumber Data:** Koleksi `activities` dengan status `published`, diurutkan berdasarkan tanggal pelaksanaan terbaru (`-date`), dengan batas 9 kegiatan per halaman.
- **Komponen Utama:**
  - Kartu Kegiatan Interaktif: Kartu kegiatan yang dilengkapi lencana tanggal khusus di sudut gambar (menampilkan angka tanggal dan singkatan bulan), jenis kegiatan (*Ritual*, *Cultural*, atau *Other*), judul kegiatan, lokasi kegiatan dengan ikon penanda, serta ringkasan singkat.
  - Kontrol Paginasi.
- **Fitur Pengunjung:** Klik kartu kegiatan untuk membuka detail lengkap acara, mencatat waktu dan lokasi pelaksanaan.

### 3.8 Detail Kegiatan
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/kegiatan/[slug]` (misal: `/id/kegiatan/sembahyang-keberkahan-cap-go-meh`)
  - Versi EN: `/[locale]/activities/[slug]` (misal: `/en/activities/cap-go-meh-blessing-ritual`)
- **Tujuan Halaman:** Menyajikan rincian teknis, tata cara, makna filosofis, dan panduan lengkap suatu agenda kegiatan.
- **Sumber Data:** Dokumen tunggal dari koleksi `activities` berdasarkan parameter `slug`.
- **Komponen Utama:**
  - Hero Header Sinematik: Banner visual berukuran besar (tinggi 40-60vh) dengan gambar latar kegiatan bergradasi gelap.
  - Informasi Meta: Menampilkan badge jenis kegiatan, hari dan tanggal pelaksanaan terformat lengkap, serta penanda lokasi (misal: "Altar Utama Klenteng Tek Hay Bio").
  - Paragraf Pengantar (*Lead Paragraph*): Teks deskripsi pembuka berukuran besar.
  - Konten Penjelasan Acara: Uraian rinci yang dirender melalui Lexical Rich Text.

### 3.9 Layanan
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/layanan` (misal: `/id/layanan`)
  - Versi EN: `/[locale]/services` (misal: `/en/services`)
- **Tujuan Halaman:** Menyajikan panduan layanan keagamaan, konsultasi spiritual/tridharma, dan fasilitas klenteng yang dapat dimanfaatkan oleh umat dan masyarakat.
- **Sumber Data:** Koleksi `services` dengan filter `status = 'published'` dan diurutkan berdasarkan `sortOrder`.
- **Komponen Utama:**
  - Tampilan Kartu Layanan Bergantian (*Alternating Two-Column Layout*): Setiap layanan ditampilkan secara detail dengan foto representatif di satu sisi dan penjelasan lengkap di sisi lainnya dengan pola zig-zag.
  - Penanda Ketersediaan: Jika layanan memiliki tanda `availability = 'unavailable'`, sistem menampilkan lencana merah "Tidak Tersedia" (ID) atau "Unavailable" (EN).
  - Rich Text Uraian Layanan: Prosedur, ketentuan, dan penjelasan layanan langsung disajikan secara utuh di halaman ini.
  - Paginasi Layanan.
- **Catatan Implementasi Khusus:** Pada sistem saat ini, **tidak ada rute detail terpisah** `/layanan/[slug]`. Seluruh detail deskripsi layanan telah dirancang untuk langsung dibaca di halaman utama Layanan (`/layanan` atau `/services`).

### 3.10 Kontak dan Lokasi
- **URL / Rute Aktual:**
  - Versi ID: `/[locale]/kontak` (misal: `/id/kontak`)
  - Versi EN: `/[locale]/contact` (misal: `/en/contact`)
- **Tujuan Halaman:** Menyediakan saluran komunikasi resmi, alamat fisik, jam kunjungan, dan panduan navigasi geografis bagi peziarah atau pengunjung.
- **Sumber Data:** Payload Global `contact-information`.
- **Komponen Utama:**
  - Blok Alamat Fisik: Alamat lengkap klenteng dilengkapi tombol cepat "Buka di Google Maps" yang membuka aplikasi peta eksternal.
  - Blok Jam Operasional: Panduan waktu berkunjung bagi umat dan wisatawan (misal: "Setiap Hari 06.00 - 18.00 WIB").
  - Saluran Komunikasi Terpadu:
    - Nomor WhatsApp / Telepon: Dilengkapi logika otomatis sanitasi nomor telepon yang mengubah format lokal `08...` menjadi tautan pesan WhatsApp langsung (`https://wa.me/628...`).
    - Alamat Email: Tautan `mailto:` untuk mengirim pesan elektronik langsung.
    - Media Sosial: Tautan ke akun media sosial klenteng (Instagram, Facebook, YouTube, dll.).
  - Peta Lokasi Interaktif: Wadah peta responsif dengan fallback 3 tingkat:
    1. Menggunakan kode `<iframe>` Embed kustom jika diisi administrator.
    2. Menggunakan koordinat presisi Latitude dan Longitude jika kode embed kosong.
    3. Menggunakan fallback pencarian Google Maps statis untuk nama Klenteng Tek Hay Bio Semarang.

### 3.11 Halaman Publik Lainnya
1. **Root Redirect (`src/app/(frontend)/page.tsx`):** Rute root website (`/`) secara otomatis mengalihkan (*server-side redirect*) pengunjung ke bahasa default yaitu `/id`.
2. **Halaman Tidak Ditemukan (`src/app/(frontend)/not-found.tsx`):** Menangani kesalahan 404 secara elegan dengan pesan kesalahan dwibahasa dan tombol navigasi kembali ke beranda.
3. **Peta Situs (*Sitemap XML*) (`src/app/sitemap.ts`):** Rute `/sitemap.xml` yang secara otomatis mengindeks seluruh rute statis dan artikel dinamis untuk optimasi mesin pencari (SEO).
4. **Robot Crawling (*Robots TXT*) (`src/app/robots.ts`):** Rute `/robots.txt` yang mengatur izin perayapan mesin pencari serta menyertakan tautan peta situs.

---

## 4. Dokumentasi Fitur Admin Dashboard

### 4.1 Login dan Autentikasi
- **URL / Rute Aktual:** `/admin/login`
- **Pengguna yang Mengakses:** Calon Super Admin (saat pertama kali instalasi) dan seluruh staf pengelola terdaftar (`super_admin` & `editor`).
- **Data yang Dikelola:** Email, kata sandi (*password*), nama pengguna.
- **Fitur & Alur Penggunaan:**
  1. **Deteksi Pengguna Pertama (*First User Setup*):**
     - Saat sistem dibuka dan basis data mendeteksi belum ada satu pun akun pengguna terdaftar (`totalUsers === 0`), halaman login secara otomatis beralih menampilkan formulir `CreateFirstUserForm` ("Setup Awal").
     - Formulir meminta Nama, Email, dan Password. Saat disubmit, sistem memanggil API `/api/users/first-register` yang secara otomatis menetapkan peran akun tersebut sebagai `super_admin`.
     - Setelah akun berhasil dibuat, sistem langsung melakukan login otomatis dan mengarahkan pengguna ke `/admin`.
  2. **Login Admin Standar:**
     - Jika pengguna sudah terdaftar, halaman menampilkan formulir `LoginForm`.
     - Pengguna memasukkan email dan password, yang diverifikasi melalui endpoint autentikasi Payload (`POST /api/users/login`).
     - Token autentikasi disimpan dalam *HTTP-only cookie* yang aman. Jika berhasil, pengguna diarahkan ke `/admin`.
  3. **Logout:**
     - Tombol Logout tersedia di sidebar kiri bawah `AdminShell`.
     - Mengirim request `POST /api/users/logout` untuk memusnahkan sesi cookie, lalu mengarahkan kembali ke `/admin/login`.

### 4.2 Dashboard Utama
- **URL / Rute Aktual:** `/admin`
- **Tujuan:** Pusat pantauan ringkas aktivitas website dan statistik data secara *real-time*.
- **Data yang Ditampilkan:**
  - Ucapan selamat datang personal sesuai email pengguna yang sedang aktif.
  - Kartu Metrik Ringkasan:
    - **Total Berita:** Menghitung seluruh artikel pada koleksi `posts`.
    - **Total Kegiatan:** Menghitung seluruh agenda pada koleksi `activities`.
    - **Total Layanan:** Menghitung jumlah fasilitas pada koleksi `services`.
    - **Total Media:** Menghitung jumlah berkas foto pada koleksi `gallery-media`.
  - Panel **Berita Terbaru:** Daftar 5 berita terakhir yang dibuat, menampilkan judul, kutipan, dan lencana status (`Publik` berwarna hijau atau `Draft` berwarna abu-abu).
  - Panel **Status Konten:** Menampilkan jumlah artikel yang saat ini masih berstatus `draft`.
  - Tombol Aksi Cepat: Tombol "+ Berita Baru" di sudut kanan atas untuk langsung menuju formulir pembuatan artikel.

### 4.3 Pengelolaan Berita
- **URL / Rute Terkait:**
  - Daftar Berita: `/admin/berita`
  - Tambah Berita: `/admin/berita/tambah`
  - Edit Berita: `/admin/berita/[id]`
- **Pengguna yang Memiliki Akses:** `super_admin` dan `editor`.
- **Data yang Dikelola:**
  - Judul Artikel (`title`) — Terlokalisasi (ID & EN).
  - Slug URL (`slug`) — Terlokalisasi (ID & EN), dengan generator otomatis dan jaminan keunikan.
  - Ringkasan Kutipan (`excerpt`) — Terlokalisasi (ID & EN).
  - Konten Utama (`content`) — Rich Text Editor Lexical terlokalisasi (ID & EN).
  - Gambar Unggulan (`featuredImage`) — Relasi ke koleksi `news-media`.
  - Kategori Berita (`category`) — Relasi ke koleksi `categories`.
  - Penulis (`author`) — Relasi ke koleksi `users`.
  - Status Publikasi (`status`) — Pilihan: `draft` atau `published`.
  - Waktu Publikasi (`publishedAt`) — Input datetime-local.
- **Operasi yang Didukung:**
  - **Create:** Membuat berita baru melalui form `NewsForm.tsx` via Server Action `saveNewsAction`.
  - **Read:** Melihat daftar berita dengan tabel informatif (kolom: Kotak Pilihan Hapus Massal, Judul, Kategori, Status, Tanggal Pembuatan, dan Aksi).
  - **Update:** Memperbarui data berita dan beralih antar-bahasa ID/EN melalui tab.
  - **Delete:** Menghapus berita secara tunggal via komponen `DeleteActionClient` atau tombol hapus di dalam form edit.
  - **Bulk Delete:** Menghapus banyak berita sekaligus melalui fitur `BulkDeleteCheckbox`, `BulkDeleteSelectAll`, dan `BulkDeleteButton` (`deleteManyNewsAction`).
  - **Publish/Unpublish:** Mengubah status antara `draft` dan `published` sewaktu-waktu.

### 4.4 Pengelolaan Kategori Berita
- **URL / Rute Terkait:**
  - Daftar Kategori: `/admin/kategori-berita`
  - Tambah Kategori: `/admin/kategori-berita/tambah`
  - Edit Kategori: `/admin/kategori-berita/[id]`
- **Pengguna yang Memiliki Akses:** `super_admin` dan `editor`.
- **Data yang Dikelola:** Nama Kategori (`title` ID & EN), Slug URL, dan Deskripsi Kategori (`description` ID & EN).
- **Operasi yang Didukung:**
  - **Create:** Tambah kategori baru melalui `CategoryForm.tsx` (dikirim via `POST /api/categories`).
  - **Read:** Menampilkan tabel kategori (Nama, Slug, Tanggal Dibuat, Tombol Edit).
  - **Update:** Mengubah nama atau deskripsi kategori (`PATCH /api/categories/[id]`).
  - **Delete:** Menghapus kategori melalui tombol Hapus di halaman edit (`DELETE /api/categories/[id]`).

### 4.5 Pengelolaan Galeri dan Media
- **URL / Rute Aktual:** `/admin/galeri`
- **Pengguna yang Memiliki Akses:** `super_admin` dan `editor`.
- **Konsep Arsitektur Media Tersegregasi:** Berbeda dengan CMS konvensional yang mencampur seluruh gambar dalam satu folder, sistem ini membagi media ke dalam 6 koleksi independen guna mencegah kesalahan relasi:
  1. `gallery-media` (Galeri Utama untuk website publik)
  2. `news-media` (Gambar khusus artikel berita)
  3. `activity-media` (Gambar khusus agenda kegiatan)
  4. `service-media` (Gambar khusus fasilitas & layanan)
  5. `history-media` (Gambar khusus arsip sejarah & linimasa)
  6. `site-media` (Logo, ikon keunikan, dan aset website)
- **Operasi yang Didukung:**
  - **Upload Media:** Unggah berkas gambar langsung melalui form unggah (`POST /api/${collection}`).
  - **Read / Filter Kategori Media:** Tab navigasi atas untuk berpindah antar-koleksi media (`?collection=...`).
  - **Update Metadata:** Mengklik kartu gambar membuka modal detail untuk menyunting *Alt Text*, *Judul*, *Kategori Galeri* (*building*, *interior*, *activities*, *history*, *traditions*, *other*), dan *Deskripsi*. Disimpan melalui Server Action `updateMediaAction`.
  - **Pencegahan Penghapusan Media yang Digunakan (*Critical Media Safety*):**
    - Sebelum media dihapus, sistem memanggil endpoint khusus `/api/media-usage?collection=${collection}&id=${id}` (`getMediaUsage.ts`).
    - Sistem memeriksa seluruh koleksi dan blok teks kaya (*Rich Text JSON*) di basis data.
    - Jika media sedang digunakan oleh suatu artikel berita, kegiatan, layanan, sejarah, atau halaman beranda, sistem **mengunci tombol hapus** dan menampilkan daftar dokumen yang sedang menggunakan media tersebut.
    - Pada level backend, Payload Hook `preventDeleteUsedMedia.ts` juga memblokir request penghapusan dengan melempar error 400 jika status `used === true`.
  - **Delete Tunggal:** Gambar yang terbukti tidak digunakan (*unused*) dapat dihapus secara permanen.
  - **Bulk Delete:** Memilih beberapa gambar sekaligus menggunakan *checkbox* dan menghapusnya secara massal setelah lolos verifikasi penggunaan media.

### 4.6 Pengelolaan Kegiatan
- **URL / Rute Terkait:**
  - Daftar Kegiatan: `/admin/kegiatan`
  - Tambah Kegiatan: `/admin/kegiatan/tambah`
  - Edit Kegiatan: `/admin/kegiatan/[id]`
- **Pengguna yang Memiliki Akses:** `super_admin` dan `editor`.
- **Data yang Dikelola:**
  - Judul Kegiatan (`title`) — ID & EN.
  - Slug URL (`slug`) — ID & EN.
  - Lokasi Kegiatan (`location`) — ID & EN.
  - Deskripsi Singkat (`shortDescription`) — ID & EN.
  - Deskripsi Lengkap (`description`) — Lexical Rich Text ID & EN.
  - Gambar Unggulan (`featuredImage`) — Terhubung ke `activity-media` via `MediaPicker`.
  - Waktu Pelaksanaan (`date`) — Format tanggal dan jam pelaksanaan.
  - Status Publikasi (`status`) — `draft` atau `published`.
- **Operasi yang Didukung:**
  - **Create:** Tambah agenda via `ActivitiesForm.tsx` dan `saveActivityAction`.
  - **Read:** Tabel daftar kegiatan dengan paginasi.
  - **Update:** Pengeditan isi agenda dwibahasa.
  - **Delete:** Hapus tunggal dan hapus massal (*Bulk Delete*).
  - **Publish/Unpublish:** Pengendalian tayang di website publik.

### 4.7 Pengelolaan Layanan
- **URL / Rute Terkait:**
  - Daftar Layanan: `/admin/layanan`
  - Tambah Layanan: `/admin/layanan/tambah`
  - Edit Layanan: `/admin/layanan/[id]`
- **Pengguna yang Memiliki Akses:** `super_admin` dan `editor`.
- **Data yang Dikelola:**
  - Nama Layanan (`title`) — ID & EN.
  - Slug URL (`slug`) — ID & EN.
  - Deskripsi Singkat (`shortDescription`) — ID & EN.
  - Deskripsi Lengkap (`description`) — Lexical Rich Text ID & EN.
  - Foto Layanan (`image`) — Terhubung ke `service-media` via `MediaPicker`.
  - Status Publikasi (`status`) — `draft` atau `published`.
  - Urutan Tampil (`sortOrder`) — Angka integer untuk menentukan prioritas urutan tampil pada halaman publik.
- **Operasi yang Didukung:**
  - **Create, Read, Update, Delete (CRUD Lengkap):** Melalui form `ServicesForm.tsx` dan server action `saveServiceAction`, `deleteServiceAction`, serta `deleteManyServiceAction`.

### 4.8 Pengelolaan Sejarah
- **URL / Rute Aktual:** `/admin/sejarah`
- **Pengguna yang Memiliki Akses:** `super_admin` dan `editor`.
- **Data yang Dikelola:**
  - Judul Halaman Sejarah (`title`) — ID & EN.
  - Sejarah Singkat untuk Beranda (`shortDescription`) — ID & EN.
  - Konten Sejarah Lengkap (`content`) — Lexical Rich Text Editor ID & EN.
  - Linimasa Dinamis (*Timeline Items Array*):
    - Tahun Peristiwa (`year` ID & EN).
    - Judul Momen / Peristiwa (`title` ID & EN).
    - Deskripsi Peristiwa (`description` ID & EN).
    - Foto Momen Sejarah (`image`) — Terhubung ke `history-media`.
    - Status Verifikasi Historis (`verificationStatus`): Pilihan `verified` atau `under_research`.
- **Operasi yang Didukung:**
  - **Read:** Membaca data sejarah global yang tersimpan.
  - **Update:** Menyunting teks narasi dan menambah/menghapus baris momen linimasa secara dinamis via `HistoryForm.tsx` dan `saveGlobalAction('history')`.

### 4.9 Pengelolaan Informasi Website
- **URL / Rute Aktual:** `/admin/informasi-website`
- **Pengguna yang Memiliki Akses:** **Khusus `super_admin`** (Editor dibatasi hak aksesnya oleh validasi `saveGlobalAction`).
- **Data yang Dikelola:**
  - **Identitas Situs:** Nama Website (`siteName` ID & EN) dan Slogan/Tagline (`tagline` ID & EN).
  - **Kontak & Operasional:** Email resmi, nomor telepon/WhatsApp, Alamat Fisik lengkap (ID & EN), dan Jam Operasional (ID & EN).
  - **Geolokasi & Pemetaan:** Tautan URL Google Maps, Kode `<iframe>` Embed Google Maps kustom, serta koordinat Latitude dan Longitude.
  - **Media Sosial Dinamis:** Array akun media sosial (Platform, Label tampilan, dan URL profil) dengan fitur tambah dan hapus baris.
- **Operasi yang Didukung:** Read dan Update melalui `WebsiteInfoForm.tsx`.

### 4.10 Pengelolaan Halaman Beranda
- **URL / Rute Aktual:** `/admin/halaman-beranda`
- **Pengguna yang Memiliki Akses:** `super_admin` (dan role admin yang memiliki wewenang pada global `home-page`).
- **Data yang Dikelola:**
  - Form terbagi menjadi 5 tab kerja melalui `HomePageForm.tsx`:
    1. **Tab Hero:** Judul hero, tagline hero, dan gambar latar belakang (*site-media*).
    2. **Tab Pengantar:** Judul pengantar dan teks deskripsi pembuka beranda.
    3. **Tab Sejarah & Keunikan:** Subjudul sejarah, judul sejarah, ringkasan sejarah, gambar sejarah, serta daftar fitur keunikan dinamis (judul fitur & ikon/gambar).
    4. **Tab Layanan, Kegiatan, Berita:** Kustomisasi judul dan deskripsi pembuka untuk masing-masing bagian daftar konten di beranda.
    5. **Tab Galeri & CTA:** Judul dan deskripsi bagian pratinjau galeri serta bagian ajakan berkunjung (*Location CTA*).
- **Operasi yang Didukung:** Read dan Update melalui `saveGlobalAction('home-page')`.

### 4.11 Pengelolaan Pengguna dan Hak Akses
- **URL / Rute Aktual:** `/admin/pengguna`
- **Pengguna yang Memiliki Akses:** **Khusus `super_admin`**. Pengguna dengan peran `editor` yang mencoba mengakses rute ini akan langsung menerima tampilan "Akses Ditolak".
- **Data yang Ditampilkan:** Tabel daftar pengguna sistem berisi Email, Peran (*Super Admin* atau *Editor* dalam lencana warna berbeda), dan Tanggal Akun Dibuat.
- **Status Operasi Implementasi:**
  - **Read:** Berfungsi penuh dengan dukungan paginasi (`AdminPagination`).
  - **Create / Update / Delete:** Pada custom dashboard, sistem menyediakan tombol tautan yang mengarahkan administrator ke Payload Native Admin (`/admin-payload/collections/users/create`) untuk mendaftarkan akun baru atau mengubah kata sandi.

### 4.12 Fitur Admin Lainnya
1. **Pengaturan Lanjutan (`/admin/pengaturan`):**
   - Halaman khusus `super_admin` yang memberikan penjelasan status fitur tingkat lanjut dan menyediakan tautan langsung menuju antarmuka native Payload CMS (`/admin-payload`).
2. **Komponen Terpadu Pemilih Media (`MediaPicker.tsx`):**
   - Modal pemilih media cerdas yang tertanam di seluruh form input. Mendukung pemilihan media yang sudah ada, pengunggahan media baru saat itu juga, pemeriksaan status penggunaan media, serta proteksi penghapusan berkas.
3. **Editor Teks Kaya Berstandar Industri (`LexicalEditor.tsx`):**
   - Menggantikan textarea biasa dengan kemampuan format teks tebal, miring, garis bawah, heading hierarkis, daftar berpoin, tautan, dan penyisipan media.

---

## 5. Dokumentasi Seluruh Halaman

### 5.1 Daftar Halaman Publik

| No | Nama Halaman | Pola Rute Aktual | Tujuan & Fungsi Halaman | Sumber Data |
|---|---|---|---|---|
| 1 | **Root Redirection** | `/` | Mengarahkan pengunjung root ke bahasa default (`/id`) | Logika `redirect('/id')` |
| 2 | **Beranda (Home)** | `/[locale]` (`/id`, `/en`) | Menampilkan etalase utama informasi klenteng | Globals: `home-page`, `site-settings`, `contact-information`, `history`; Koleksi: `services`, `activities`, `posts`, `gallery-media` |
| 3 | **Tentang Kami** | `/[locale]/tentang-kami` (ID)<br>`/[locale]/about` (EN) | Profil filosofis dan narasi pendirian klenteng | Global: `history` |
| 4 | **Sejarah Klenteng** | `/[locale]/sejarah` (ID)<br>`/[locale]/history` (EN) | Linimasa kronologis perjalanan sejarah klenteng | Global: `history` (`timeline`) |
| 5 | **Daftar Berita** | `/[locale]/berita` (ID)<br>`/[locale]/news` (EN) | Arsip dan warta berita terbaru klenteng | Koleksi: `posts` (filter `published`) |
| 6 | **Detail Berita** | `/[locale]/berita/[slug]` (ID)<br>`/[locale]/news/[slug]` (EN) | Membaca artikel berita secara mendalam | Koleksi: `posts` (by slug & locale) |
| 7 | **Daftar Kegiatan** | `/[locale]/kegiatan` (ID)<br>`/[locale]/activities` (EN) | Jadwal agenda ibadah dan kebudayaan | Koleksi: `activities` (filter `published`) |
| 8 | **Detail Kegiatan** | `/[locale]/kegiatan/[slug]` (ID)<br>`/[locale]/activities/[slug]` (EN) | Rincian panduan dan pelaksanaan kegiatan | Koleksi: `activities` (by slug & locale) |
| 9 | **Layanan & Fasilitas**| `/[locale]/layanan` (ID)<br>`/[locale]/services` (EN) | Informasi layanan keagamaan dan fasilitas | Koleksi: `services` (filter `published`) |
| 10 | **Galeri Foto** | `/[locale]/galeri` (ID)<br>`/[locale]/gallery` (EN) | Repositori dokumentasi foto visual | Koleksi: `gallery-media` |
| 11 | **Kontak & Lokasi** | `/[locale]/kontak` (ID)<br>`/[locale]/contact` (EN) | Informasi kontak, jam buka, dan peta lokasi | Global: `contact-information` |
| 12 | **Halaman 404** | `/not-found` | Menangani rute yang tidak valid | Komponen internal `not-found.tsx` |
| 13 | **Sitemap XML** | `/sitemap.xml` | Indeks perayapan mesin pencari | `sitemap.ts` |
| 14 | **Robots TXT** | `/robots.txt` | Aturan perayapan mesin pencari | `robots.ts` |

### 5.2 Daftar Halaman Admin

| No | Nama Halaman | URL Aktual | Hak Akses | Operasi yang Tersedia |
|---|---|---|---|---|
| 1 | **Login & Setup Awal** | `/admin/login` | Publik / Unauthenticated | Login, Registrasi Super Admin Pertama |
| 2 | **Dashboard Utama** | `/admin` | `super_admin`, `editor` | Read (Metrik Statistik & Berita Terbaru) |
| 3 | **Daftar Berita** | `/admin/berita` | `super_admin`, `editor` | Read, Delete, Bulk Delete, Paginasi |
| 4 | **Tambah Berita** | `/admin/berita/tambah` | `super_admin`, `editor` | Create, Upload Gambar, Draft/Publish |
| 5 | **Edit Berita** | `/admin/berita/[id]` | `super_admin`, `editor` | Read, Update, Delete, Draft/Publish |
| 6 | **Kategori Berita** | `/admin/kategori-berita` | `super_admin`, `editor` | Read, Paginasi |
| 7 | **Tambah Kategori** | `/admin/kategori-berita/tambah` | `super_admin`, `editor` | Create |
| 8 | **Edit Kategori** | `/admin/kategori-berita/[id]` | `super_admin`, `editor` | Read, Update, Delete |
| 9 | **Daftar Kegiatan** | `/admin/kegiatan` | `super_admin`, `editor` | Read, Delete, Bulk Delete, Paginasi |
| 10 | **Tambah Kegiatan** | `/admin/kegiatan/tambah` | `super_admin`, `editor` | Create, Upload Gambar, Draft/Publish |
| 11 | **Edit Kegiatan** | `/admin/kegiatan/[id]` | `super_admin`, `editor` | Read, Update, Delete, Draft/Publish |
| 12 | **Daftar Layanan** | `/admin/layanan` | `super_admin`, `editor` | Read, Delete, Bulk Delete, Paginasi |
| 13 | **Tambah Layanan** | `/admin/layanan/tambah` | `super_admin`, `editor` | Create, Upload Gambar, Draft/Publish |
| 14 | **Edit Layanan** | `/admin/layanan/[id]` | `super_admin`, `editor` | Read, Update, Delete, Draft/Publish |
| 15 | **Pusat Media & Galeri**| `/admin/galeri` | `super_admin`, `editor` | Read, Upload, Update Meta, Cek Usage, Delete, Bulk Delete |
| 16 | **Pengaturan Sejarah** | `/admin/sejarah` | `super_admin`, `editor` | Read, Update (Narasi & Linimasa Dinamis) |
| 17 | **Pengaturan Beranda** | `/admin/halaman-beranda`| `super_admin` | Read, Update (Hero, Keunikan, CTA) |
| 18 | **Informasi Website** | `/admin/informasi-website`| `super_admin` | Read, Update (Alamat, Kontak, Peta, Medsos) |
| 19 | **Manajemen Pengguna** | `/admin/pengguna` | `super_admin` | Read (Tabel Akun), Tautan ke Payload Create |
| 20 | **Pengaturan Lanjutan** | `/admin/pengaturan` | `super_admin` | Read, Tautan ke Payload Native Admin |
| 21 | **Payload Native Admin** | `/admin-payload` | Sesuai aturan Payload CMS | Akses penuh manajemen basis data & skema |

### 5.3 Ringkasan Route
Aplikasi Next.js menggunakan struktur rute terorganisir (*Route Groups*):
- `(frontend)`: Mengisolasi halaman publik dengan tata letak navbar dan footer umum. Rute dinamis `[locale]` menangani pemisahan bahasa.
- `(admin)`: Mengisolasi antarmuka administrasi custom yang diproteksi oleh layout `AdminShell` dan pengecekan sesi autentikasi header.
- `(payload)`: Menangani rute bawaan Payload CMS, baik endpoint API REST (`/api/[...slug]`) maupun antarmuka native CMS (`/admin-payload`).

### 5.4 Hubungan Antarhalaman
```
+---------------------------------------------------------------------------------+
|                                 WEBSITE PUBLIK                                  |
|                                                                                 |
|  [Beranda (Home)]                                                               |
|    |                                                                            |
|    +---> [Tentang Kami] & [Sejarah] <----------- (Global: History)              |
|    |                                                                            |
|    +---> [Layanan] <---------------------------- (Collection: Services)         |
|    |                                                                            |
|    +---> [Kegiatan] ---> [Detail Kegiatan] <---- (Collection: Activities)       |
|    |                                                                            |
|    +---> [Berita]   ---> [Detail Berita] <------ (Collection: Posts)            |
|    |                                                                            |
|    +---> [Galeri] <----------------------------- (Collection: GalleryMedia)     |
|    |                                                                            |
|    +---> [Kontak & Peta] <---------------------- (Global: ContactInformation)   |
+---------------------------------------------------------------------------------+
                                        ^
                                        | (Data Sinkron via Revalidate Hook)
                                        |
+---------------------------------------------------------------------------------+
|                             CUSTOM ADMIN DASHBOARD                              |
|                                                                                 |
|  [Dashboard Utama]                                                              |
|    |-- Berita & Kategori   --> Tambah / Edit / Hapus Berita (ID & EN)           |
|    |-- Kegiatan            --> Tambah / Edit / Hapus Agenda (ID & EN)           |
|    |-- Layanan             --> Tambah / Edit / Hapus Fasilitas (ID & EN)        |
|    |-- Galeri & Media      --> Upload / Edit Meta / Proteksi Hapus Media        |
|    |-- Sejarah             --> Edit Narasi Sejarah & Garis Waktu Kronologis     |
|    |-- Informasi Website   --> Edit Kontak, Peta, Alamat, dan Media Sosial      |
|    |-- Halaman Beranda     --> Konfigurasi Hero, Teks Beranda, Keunikan, CTA    |
|    |-- Pengguna (Khusus SA)--> Pantau Akun Admin & Editor                       |
|    +-- Pengaturan Lanjutan --> Pengalihan ke Native Payload CMS Admin           |
+---------------------------------------------------------------------------------+
```

---

## 6. Alur Penggunaan Fitur Utama

### 6.1 Alur Pengelolaan Berita
1. **Navigasi:** Administrator membuka menu **Berita** pada sidebar panel admin (`/admin/berita`).
2. **Membuat Berita Baru:** Admin menekan tombol **Tambah Berita** (`/admin/berita/tambah`).
3. **Pengisian Konten Dwibahasa:**
   - Pada tab **ID (Indonesia)**: Admin mengisi Judul Berita, membiarkan Slug otomatis terisi atau mengaturnya secara manual, mengisi ringkasan kutipan (*excerpt*), dan menulis isi artikel lengkap menggunakan *Lexical Rich Text Editor*.
   - Admin beralih ke tab **EN (English)** untuk mengisi judul, slug, excerpt, dan konten berbahasa Inggris (opsional; jika dikosongkan, sistem Payload menggunakan versi ID sebagai fallback).
4. **Pengaturan Metadata & Media:**
   - Pada panel samping, admin memilih **Featured Image** dengan membuka `MediaPicker`. Admin dapat memilih gambar yang sudah ada pada koleksi `news-media` atau mengunggah gambar baru dari komputer.
   - Admin menentukan **Kategori Berita** dan memilih **Penulis** (*Author*).
   - Menentukan waktu publikasi (*Published At*).
5. **Penetapan Status:** Admin menentukan status artikel:
   - Jika dipilih **Draft**, berita tersimpan aman di basis data namun tidak akan tampil di website publik.
   - Jika dipilih **Publik (Published)**, berita disiapkan untuk tayang.
6. **Penyimpanan:** Admin menekan tombol **Simpan**. Server Action `saveNewsAction` memvalidasi sesi pengguna, mengekstrak data sesuai lokal masing-masing, menyimpan dokumen ke koleksi `posts`, dan mengeksekusi `revalidatePath` untuk `/id/berita`, `/en/news`, serta slug terkait.
7. **Verifikasi Publik:** Pengunjung membuka `/id/berita` atau `/en/news`; artikel yang baru saja diterbitkan langsung muncul pada urutan teratas.

### 6.2 Alur Pengelolaan Galeri & Media
1. **Membuka Pusat Media:** Admin membuka menu **Galeri** (`/admin/galeri`).
2. **Memilih Kategori Media:** Admin memilih tab kategori media di bagian atas (misal: *Galeri Utama*, *Media Berita*, dll.).
3. **Mengunggah Media:** Admin memilih berkas foto dari komputer melalui input berkas. Sistem mengunggah foto ke API koleksi bersangkutan dan langsung memuat ulang galeri.
4. **Menyunting Metadata Foto:**
   - Admin mengklik kartu foto pada grid.
   - Muncul modal *Detail Media* yang menampilkan pratinjau gambar, input *Alt Text*, *Judul*, *Kategori Galeri*, dan *Deskripsi*.
   - Admin menyunting informasi dan menekan **Simpan**.
5. **Mekanisme Penghapusan Aman (*Safe Delete*):**
   - Di dalam modal detail atau saat memilih gambar untuk dihapus massal, sistem secara otomatis mengecek status penggunaan via `/api/media-usage`.
   - Jika gambar sedang dipakai oleh artikel berita atau halaman lain, sistem menampilkan pesan: *"Tidak dapat dihapus: Sedang digunakan oleh X dokumen"* dan menyembunyikan tombol hapus.
   - Jika gambar tidak digunakan, tombol **Hapus Media** aktif dan dapat ditekan setelah konfirmasi.

### 6.3 Alur Pengelolaan Kegiatan
1. **Navigasi:** Admin membuka menu **Kegiatan** (`/admin/kegiatan`).
2. **Input Agenda:** Memilih **Tambah Kegiatan** (`/admin/kegiatan/tambah`).
3. **Pengisian Formulir:**
   - Mengisi Judul Kegiatan, Lokasi, Deskripsi Singkat, dan Konten Rinci pada tab ID dan EN.
   - Menentukan Waktu Pelaksanaan Kegiatan melalui input kalender/jam.
   - Memilih gambar poster/kegiatan dari `activity-media` via `MediaPicker`.
   - Menetapkan status `draft` atau `published`.
4. **Penyimpanan & Publikasi:** Menekan tombol **Simpan**. Data diperbarui dan langsung tampil di halaman `/id/kegiatan` atau `/en/activities`. Pengunjung dapat mengklik kegiatan untuk melihat laman detail `/kegiatan/[slug]`.

### 6.4 Alur Pengelolaan Layanan
1. **Navigasi:** Admin membuka menu **Layanan** (`/admin/layanan`).
2. **Penyusunan Fasilitas/Layanan:** Admin memilih **Tambah Layanan** atau mengedit layanan yang sudah ada.
3. **Pengaturan Urutan Tampil:** Selain mengisi judul dan deskripsi dwibahasa, admin mengisi angka **Urutan Tampil (*Sort Order*)**. Angka yang lebih kecil (misal: 1, 2, 3) akan ditampilkan lebih awal pada halaman publik.
4. **Penyimpanan:** Data disimpan melalui `saveServiceAction`. Konten berstatus `published` langsung tampil di `/id/layanan` dan `/en/services`.

### 6.5 Alur Pengelolaan Sejarah & Timeline
1. **Navigasi:** Admin membuka menu **Sejarah** (`/admin/sejarah`).
2. **Penyuntingan Narasi:** Admin memperbarui judul halaman, ringkasan pengantar sejarah beranda, dan uraian narasi lengkap sejarah klenteng pada tab ID dan EN.
3. **Pengelolaan Linimasa (*Timeline*):**
   - Admin dapat menambah momen baru dengan menekan **+ Tambah Momen**.
   - Mengisi angka Tahun peristiwa, Judul Peristiwa, Deskripsi, mengunggah foto arsip sejarah, dan memilih Status Verifikasi (*Verified* atau *Under Research*).
   - Menghapus momen lama yang tidak relevan dengan menekan tombol **Hapus** pada baris yang bersangkutan.
4. **Penyimpanan:** Menekan **Simpan Perubahan**. Halaman publik `/id/sejarah` dan `/id/tentang-kami` seketika diperbarui secara otomatis.

### 6.6 Alur Pengelolaan Informasi Website & Beranda
1. **Akses Super Admin:** Super Admin membuka menu **Informasi Website** (`/admin/informasi-website`) atau **Halaman Beranda** (`/admin/halaman-beranda`).
2. **Penyuntingan Parameter:**
   - Pada Informasi Website: Admin memperbarui nama website, tagline, nomor WhatsApp, email, jam kunjungan, dan kode embed Google Maps atau koordinat.
   - Pada Halaman Beranda: Admin menyunting teks banner Hero, teks Pengantar, judul seksi, serta daftar item keunikan arsitektur.
3. **Penyimpanan & Efek Menyeluruh:** Menyimpan form memicu revalidasi layout global Next.js (`revalidatePath('/', 'layout')`), sehingga perubahan nama situs, kontak di footer, dan peta di halaman kontak langsung ter-update di seluruh penjuru website.

---

## 7. Ringkasan Fitur

### 7.1 Matriks Fitur dan Operasi (CRUD & Fungsionalitas)

| Modul Fitur | Create | Read | Update | Delete | Bulk Delete | Status Draft/Publish | Lokalisasi (ID/EN) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Berita (`posts`)** | Ya | Ya | Ya | Ya | Ya | Ya | Ya |
| **Kategori Berita (`categories`)** | Ya | Ya | Ya | Ya | Tidak | Tidak | Ya |
| **Kegiatan (`activities`)** | Ya | Ya | Ya | Ya | Ya | Ya | Ya |
| **Layanan (`services`)** | Ya | Ya | Ya | Ya | Ya | Ya | Ya |
| **Galeri & Media (`*-media`)** | Ya | Ya | Ya (Meta) | Ya (Proteksi) | Ya (Proteksi) | Tidak | Metadata Alt/Title |
| **Sejarah (`history`)** | N/A (Global) | Ya | Ya | N/A (Global) | Tidak | Tidak | Ya (Narasi & Timeline) |
| **Informasi Website (`contact & site`)**| N/A (Global) | Ya | Ya | N/A (Global) | Tidak | Tidak | Ya |
| **Halaman Beranda (`home-page`)** | N/A (Global) | Ya | Ya | N/A (Global) | Tidak | Tidak | Ya |
| **Pengguna (`users`)** | Via Payload | Ya | Via Payload | Via Payload | Tidak | Tidak | N/A |

### 7.2 Ringkasan Halaman dan Rute

```
+-----------------------------------+---------------------------------------------+
| Tipe Halaman                      | Rute / URL Pattern                          |
+-----------------------------------+---------------------------------------------+
| Publik - Root                     | /                                           |
| Publik - Beranda (ID/EN)          | /[locale]                                   |
| Publik - Tentang Kami (ID/EN)     | /[locale]/tentang-kami  |  /[locale]/about  |
| Publik - Sejarah (ID/EN)          | /[locale]/sejarah       |  /[locale]/history|
| Publik - Layanan (ID/EN)          | /[locale]/layanan       |  /[locale]/services|
| Publik - Kegiatan (ID/EN)         | /[locale]/kegiatan      |  /[locale]/activities|
| Publik - Detail Kegiatan (ID/EN)  | /[locale]/kegiatan/[slug] | /[locale]/activities/[slug] |
| Publik - Berita (ID/EN)           | /[locale]/berita        |  /[locale]/news   |
| Publik - Detail Berita (ID/EN)    | /[locale]/berita/[slug] |  /[locale]/news/[slug] |
| Publik - Galeri (ID/EN)           | /[locale]/galeri        |  /[locale]/gallery|
| Publik - Kontak (ID/EN)           | /[locale]/kontak        |  /[locale]/contact|
| Publik - SEO / Sitemap            | /sitemap.xml , /robots.txt                  |
+-----------------------------------+---------------------------------------------+
| Admin - Autentikasi               | /admin/login                                |
| Admin - Dashboard Utama           | /admin                                      |
| Admin - Berita                    | /admin/berita , /tambah , /[id]             |
| Admin - Kategori Berita           | /admin/kategori-berita , /tambah , /[id]    |
| Admin - Kegiatan                  | /admin/kegiatan , /tambah , /[id]           |
| Admin - Layanan                   | /admin/layanan , /tambah , /[id]            |
| Admin - Galeri & Media Terpusat   | /admin/galeri                               |
| Admin - Sejarah & Linimasa        | /admin/sejarah                              |
| Admin - Informasi Website         | /admin/informasi-website                    |
| Admin - Konfigurasi Beranda       | /admin/halaman-beranda                      |
| Admin - Manajemen Pengguna        | /admin/pengguna                             |
| Admin - Pengaturan Lanjutan       | /admin/pengaturan                           |
| Admin - Native Payload CMS        | /admin-payload                              |
+-----------------------------------+---------------------------------------------+
```

### 7.3 Ringkasan Hak Akses

| Area / Fitur | Pengunjung Publik | Editor | Super Admin |
|---|:---:|:---:|:---:|
| Menjelajahi Website Publik | Penuh | Penuh | Penuh |
| Melihat Konten Berstatus Draft | Tidak | Ya (di dashboard) | Ya (di dashboard) |
| Login ke Custom Admin (`/admin`) | Tidak | Ya | Ya |
| Mengelola Berita, Kategori, Kegiatan, Layanan | Tidak | Ya | Ya |
| Mengelola Galeri & Upload Media | Tidak | Ya | Ya |
| Mengelola Konten Sejarah | Tidak | Ya | Ya |
| Mengelola Konfigurasi Beranda | Tidak | Terbatas / Sesuai Hak | Ya |
| Mengelola Informasi Website & Kontak | Tidak | Tidak (Ditolak) | Ya |
| Mengakses Menu Pengguna (`/admin/pengguna`) | Tidak | Tidak (Akses Ditolak) | Ya (Read List) |
| Mengakses Menu Pengaturan (`/admin/pengaturan`)| Tidak | Tidak (Akses Ditolak) | Ya |
| Mengakses Native Payload Admin (`/admin-payload`)| Tidak | Terbatas Koleksi | Penuh |

### 7.4 Catatan Fitur yang Belum Lengkap / Batasan Implementasi
Berdasarkan hasil audit menyeluruh terhadap kode program aktual, berikut adalah keterbatasan implementasi yang perlu dicatat secara objektif:
1. **Tidak Ada Halaman Detail Khusus untuk Layanan:** Rute `/[locale]/layanan/[slug]` atau `services/[slug]` tidak diimplementasikan pada website publik. Seluruh rincian layanan langsung disajikan secara menyeluruh pada halaman indeks `/layanan`.
2. **Manajemen Pengguna pada Custom Admin Bersifat Read-Only:** Pada dashboard custom (`/admin/pengguna`), administrator hanya dapat melihat daftar akun pengguna yang ada. Pembuatan akun baru, penggantian peran, atau reset kata sandi diarahkan ke panel bawaan Payload CMS (`/admin-payload/collections/users/create`).
3. **Belum Tersedia Tombol Pratinjau (*Live Preview*) Sebelum Publikasi:** Tidak ditemukan implementasi tombol *Preview Draft* di form admin yang memungkinkan admin melihat tampilan draf pada layout website publik sebelum statusnya diubah menjadi `published`.
4. **Halaman Pengaturan Lanjutan Dinonaktifkan di Custom Admin:** Halaman `/admin/pengaturan` hanya berfungsi sebagai halaman informasi yang menyatakan bahwa konfigurasi lanjutan dinonaktifkan dalam mode custom dan menyediakan tautan ke Payload Admin asli.
5. **Pencarian Teks Bebas (*Full-Text Search*) Belum Diimplementasikan di Publik:** Pada halaman publik Berita, Kegiatan, dan Galeri, pengunjung belum disediakan bilah pencarian kata kunci (*search bar*); navigasi konten saat ini mengandalkan paginasi dan kategori.

---

## 8. Kesimpulan

Website profil Klenteng Tek Hay Bio, Semarang, telah berhasil dibangun dengan arsitektur modern yang memadukan keunggulan **Next.js App Router** untuk performa tinggi di sisi publik dengan **Payload CMS** dan **Custom Admin Dashboard** untuk kemudahan pengelolaan data.

Sistem telah mengimplementasikan seluruh kebutuhan fungsional inti dari sebuah website profil tempat ibadah bersejarah, antara lain:
- Penyajian profil dan linimasa sejarah interaktif yang transparan dengan status verifikasi.
- Pengelolaan warta berita dan agenda kegiatan yang dilengkapi status draf, paginasi, dan multi-kategori.
- Penayangan informasi layanan fasilitas keagamaan.
- Dokumentasi foto visual beresolusi tinggi dengan sistem perlindungan media yang aman dari penghapusan tidak disengaja.
- Kemudahan komunikasi melalui integrasi peta interaktif dan tombol pesan instan WhatsApp.
- Dukungan dwibahasa penuh (Indonesia dan Inggris) yang tertata rapi dari struktur basis data hingga URL publik.

Secara keseluruhan, implementasi sistem telah berjalan solid, stabil, aman, dan siap digunakan untuk mendukung pelestarian serta syiar budaya Klenteng Tek Hay Bio di era digital.
