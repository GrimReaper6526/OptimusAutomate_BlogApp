# 🚀 OptimusAutomate Blog App

A premium, full-stack, modern blog application designed with an immersive user interface, rich content editing, and robust security. Built using **React + Vite + Tailwind CSS** on the frontend, and **Node.js + Express + MongoDB** on the backend.

---

## ✨ Features

### 🎨 Frontend Experience (Client)
- **Glassmorphism & Rich Aesthetics**: Tailored modern UI using smooth gradients, curated color palettes, hover micro-animations, and full responsive design.
- **Rich Text Editor**: Integrated **Tiptap Editor** with support for markdown shortcuts, link insertions, and dynamic image embeds.
- **Interactive Engagement**:
  - Like/Unlike system with real-time feedback.
  - Bookmark/Save articles to your personalized library.
  - Hierarchical and interactive nested comments.
- **State Management**: Lightweight, super-fast global state using **Zustand**.
- **Data Fetching**: Optimistic updates, caching, and server-state sync via **TanStack React Query**.
- **Toast Notifications**: Smooth visual cues using **React Hot Toast**.

### 🔒 Backend Architecture (Server)
- **Robust Authentication**: JWT access tokens (short-lived) paired with secure, HTTP-only cookie-based refresh tokens (with rotation on reuse).
- **Zod Schema Validation**: Strict verification of all incoming API payloads.
- **Secure Image Uploads**: Direct streaming and hosting integration with **Cloudinary** using **Multer**.
- **Advanced Security Measures**:
  - **Helmet** for setting secure HTTP response headers.
  - **Express Rate Limit** to prevent brute-force attacks and abuse.
  - **Bcryptjs** for secure password hashing.
  - CORS-enabled whitelist protection.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Zustand, Tailwind CSS, React Router DOM, TanStack Query, Axios, Tiptap, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB (Mongoose ODM), JWT, Bcryptjs, Multer, Cloudinary, Zod, Slugify |
| **Security** | Helmet, Express Rate Limit, HttpOnly Cookies, CORS Whitelist |

---

## 📂 Project Structure

```text
OptimusAutomate_BlogApp/
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # UI, Auth, Layout, and Blog components
│   │   ├── hooks/          # Custom react hooks (Auth, uploads, posts)
│   │   ├── services/       # API call orchestrators (Axios instances)
│   │   ├── store/          # Zustand global stores
│   │   └── utils/          # Helpers (formatDate, readingTime)
│   └── package.json
│
└── server/                 # Backend REST API (Express)
    ├── src/
    │   ├── config/         # Database and Cloudinary configurations
    │   ├── controllers/    # API controllers
    │   ├── middleware/     # Auth, error, rate limiting, and validator middlewares
    │   ├── models/         # Mongoose Schemas (User, Post, Comment)
    │   └── routes/         # Express Router paths
    └── package.json
```

---

## ⚡ Getting Started

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database
- [Cloudinary](https://cloudinary.com/) Account (for image uploads)

### 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GrimReaper6526/OptimusAutomate_BlogApp.git
   cd OptimusAutomate_BlogApp
   ```

2. **Configure the Server**:
   Navigate to the `server` folder, copy `.env.example` to `.env`, and fill in your credentials:
   ```bash
   cd server
   cp .env.example .env
   ```
   *Required variables inside `server/.env`:*
   ```ini
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Configure the Client**:
   Navigate to the `client` folder, copy `.env.example` to `.env`:
   ```bash
   cd ../client
   cp .env.example .env
   ```
   *Required variables inside `client/.env`:*
   ```ini
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Install Dependencies**:
   Install packages for both the client and server:
   ```bash
   # From root:
   cd server && npm install
   cd ../client && npm install
   ```

---

## 🚀 Running Locally

You will need to run the backend and frontend development servers concurrently:

### 1. Start Backend Server
```bash
cd server
npm run dev
```
*The server will start on [http://localhost:5000](http://localhost:5000).*

### 2. Start Frontend App
```bash
cd client
npm run dev
```
*The client will start on [http://localhost:5173](http://localhost:5173).*

---

## 🔒 Security Best Practices Implemented
- **XSS Prevention**: HTML input from the rich text editor is strictly sanitized on both the frontend (using `dompurify`) and validated on the backend.
- **CSRF Mitigation**: Refresh tokens are stored in `HttpOnly` and `SameSite` cookies, protecting them from unauthorized client-side access.
- **API Rate Limiting**: Limiters protect endpoints (like login/register) against automated spam.
