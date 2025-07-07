
# 🔐 Login Management Access - Backend API

Ini adalah backend API untuk sistem login multi-role dengan manajemen akses menu berbasis role. Dibangun menggunakan **Express.js**, **Supabase (PostgreSQL)**, dan **JWT Authentication**.

---

## 🚀 Fitur Utama

- 🔑 Login dengan username & password
- 🧑‍💼 Multi-role per user (1 user bisa punya banyak role)
- 🧾 Menu akses berdasarkan role aktif
- 🔐 JWT Auth (Access Token)
- 🧭 Swagger API Docs (`/api-docs`)
- 🌐 Siap deployment ke Railway, Render, atau VPS

---

## 📁 Struktur Proyek

```bash
login-management-access/
├── src/
│   ├── config/           # Konfigurasi Supabase & Swagger
│   ├── routes/           # Semua route modular (auth, menus, dll)
│   ├── middlewares/      # Middleware otentikasi / otorisasi
│   ├── utils/            # JWT helper dll.
│   └── app.js            # Main Express app
├── server.js             # Entry point server
├── .env                  # Konfigurasi environment (jangan di-push)
├── .env.example          # Template environment variable
├── package.json
└── README.md
```

---

## 📦 Instalasi

1. **Clone repository ini:**

```bash
git clone https://github.com/your-username/login-management-access.git
cd login-management-access
```

2. **Install dependencies:**

```bash
npm install
```

3. **Buat file `.env` dari template:**

```bash
cp .env.example .env
```

Lalu isi isi file `.env` seperti berikut:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key
JWT_SECRET=your-secret-key
PORT=3000
```

---

## 🧪 Menjalankan Lokal

```bash
npm run dev
```

Akses aplikasi di: [http://localhost:3000](http://localhost:3000)

---

## 🧾 Dokumentasi API (Swagger)

Swagger tersedia di:

```
http://localhost:3000/api-docs
```

Swagger digenerate otomatis dari komentar JSDoc di dalam file route seperti:

- `routes/auth.js`
- `routes/getMenuByRole.js`

---

## 🧠 Daftar Endpoint Penting

| Method | Endpoint               | Deskripsi                        |
|--------|------------------------|----------------------------------|
| POST   | `/api/auth/login`      | Login user (username + password)|
| POST   | `/api/auth/select-role`| Pilih role aktif setelah login   |
| GET    | `/api/menus`           | Ambil menu sesuai role aktif     |

> 💡 **Semua endpoint setelah login memerlukan header Authorization:**

```http
Authorization: Bearer <accessToken>
```

---

## 🧩 Deployment

Project ini siap untuk deployment di:

- ✅ Railway
- ✅ Render
- ✅ VPS / Docker

### Contoh script `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Environment Variable yang dibutuhkan (Railway/Render):

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `JWT_SECRET`
- `PORT` *(opsional, default 3000)*

---

## 🧰 Tools & Library

- **Express.js** – Web framework
- **Supabase JS Client** – Akses PostgreSQL via Supabase
- **jsonwebtoken** – JWT token auth
- **bcryptjs** – Hashing password
- **swagger-jsdoc + swagger-ui-express** – Dokumentasi API
- **dotenv** – Load environment variables

---

## 🛡️ Keamanan

- Password di-hash dengan **bcryptjs**
- JWT disimpan di **localStorage** frontend
- Role-based authorization via **middleware**
- Gunakan **HTTPS** saat deployment

---

## ✍️ Kontribusi

Pull request dan issue sangat diterima. Pastikan:

- Gunakan struktur modular (routes, utils, middlewares)
- Tambahkan komentar Swagger untuk setiap endpoint baru

---

## 📜 Lisensi

MIT License © 2025
