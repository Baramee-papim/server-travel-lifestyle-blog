# Server Travel Lifestyle Blog

Backend API สำหรับโปรเจกต์ Travel Lifestyle Blog พัฒนาด้วย Express (ESM) เชื่อมต่อ PostgreSQL และ Supabase Auth

## Project Summary

ระบบนี้ให้บริการ API สำหรับ:

- Authentication (register, login, get current user, update profile, reset password)
- Articles (public list/detail, admin list/detail, create/update/delete, like)
- Comments (list/create รายบทความ)
- Categories (list/create/update/delete)
- Image upload (article image, profile image)

## Tech Stack

- Node.js + Express
- PostgreSQL (`pg`)
- Supabase Auth (`@supabase/supabase-js`)
- Multer (upload files)
- CORS
- dotenv

## Run Scripts

จาก `package.json`:

- `npm start` — รันเซิร์ฟเวอร์ด้วย `nodemon src/app.mjs`

## Environment Variables

สร้างไฟล์ `.env` ที่ root ของ backend ด้วยค่าตัวอย่าง:

```env
PORT=4000
CONNECTION_STRING=postgresql://<user>:<password>@<host>:<port>/<database>
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Set environment variables

สร้างไฟล์ `.env` ตามตัวอย่างด้านบน

### 3) Start development server

```bash
npm start
```

Server เริ่มทำงานที่:

- `http://localhost:4000` (default ถ้าไม่ได้กำหนด `PORT`)

## Health Check

- `GET /` -> `"Welcome to Blog Server"`
- `GET /health` -> `{ "message": "OK" }`

## API Base Paths

จาก `src/app.mjs` มี route หลักดังนี้:

- `/api/auth`
- `/api/article`
- `/api/admin/article`
- `/api/category`
- `/api/upload`

## Endpoint Overview

### Auth (`/api/auth`)

- `POST /register`
- `POST /login`
- `GET /get-user` (ต้องมี Bearer token)
- `POST /reset-password` (ต้องมี Bearer token)
- `PUT /profile` (ต้องมี Bearer token)

### Article (`/api/article`)

- `GET /` (public list; ฝั่ง public filter เป็น published)
- `GET /:articleId` (public detail; รองรับ optional auth สำหรับสถานะ liked)
- `POST /` (create article)
- `PUT /:articleId` (update article)
- `DELETE /:articleId` (delete article)
- `POST /:articleId/like` (ต้องล็อกอิน)
- `GET /:articleId/comments`
- `POST /:articleId/comments` (ต้องล็อกอิน)

### Admin Article (`/api/admin/article`)

- `GET /` (admin only)
- `GET /:articleId` (admin only)

### Category (`/api/category`)

- `GET /`
- `POST /`
- `PUT /:categoryId`
- `DELETE /:categoryId`

### Upload (`/api/upload`)

- `POST /article-image` (ต้องมี Bearer token)
- `POST /profile-image` (ต้องมี Bearer token)

## Authentication Notes

- ระบบใช้ Supabase access token ผ่าน `Authorization: Bearer <token>`
- Middleware สำคัญ:
  - `protectUser` สำหรับ endpoint ที่ต้องเป็นผู้ใช้ที่ล็อกอิน
  - `protectAdmin` สำหรับ endpoint ฝั่ง admin (ตรวจ role จากตาราง users)

## CORS

เซิร์ฟเวอร์ตั้งค่า CORS อนุญาต origin หลักไว้ใน `src/app.mjs`:

- `http://localhost:5173`
- `http://localhost:3000`
- `https://travel-lifestyle-blog.vercel.app`

หาก frontend เปลี่ยนโดเมน ให้เพิ่ม origin ในรายการนี้

## Folder Structure

```text
src/
  app.mjs
  controllers/
  middleware/
  repositories/
  routes/
  services/
  utils/
```

## Related Frontend

Frontend แยกอีก repo:

- `travel-lifestyle-blog`

โดย frontend จะเรียก backend ผ่าน `VITE_API_BASE_URL`
