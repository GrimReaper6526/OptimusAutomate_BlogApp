# 🚀 Local Connection & Deployment Guide — Full Stack Blog App

As a Senior Full Stack Developer, I have structured this step-by-step guide to help you run the connected application locally and then deploy both components to production.

---

## 💻 Part 1: Connecting and Running Locally

### Step 1: Prepare the Server (Backend)
1. **Navigate to the server directory** in your terminal:
   ```bash
   cd server
   ```
2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory (copied from `.env.example`) and fill in:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_32_character_jwt_access_secret
   JWT_REFRESH_SECRET=your_32_character_jwt_refresh_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. **Start the server in Development mode:**
   ```bash
   npm run dev
   ```
   *The server will start on port `5000` (i.e. `http://localhost:5000`). You will see a `✅ MongoDB connected` message.*

---

### Step 2: Prepare the Client (Frontend)
1. **Open a new terminal window** and navigate to the client directory:
   ```bash
   cd client
   ```
2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *The frontend will boot up at `http://localhost:5173`. Any requests to the API will successfully hit the local backend.*

---

## ☁️ Part 2: Cloud Deployment (Production)

To deploy, make sure both folders (`client` and `server`) are committed and pushed to your **GitHub repository**.

### Step 3: Deploy the Backend (on Render)
We will deploy the Node/Express backend to [Render](https://render.com).

1. Go to your Render Dashboard and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the Web Service settings:
   - **Name:** `optimus-blog-api` (or any unique name)
   - **Root Directory:** `server` *(Crucial: sets Render to execute from the backend folder)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` *(Runs `node src/app.js`)*
4. Scroll down and click **Advanced** to add **Environment Variables** (exactly matching your server `.env` file, but with production settings):
   - `PORT` = `5000` (Render will override this, but standardizes it)
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://your-frontend-app.vercel.app` *(Leave this for now, update it after you deploy Vercel)*
   - `MONGODB_URI` = `your_production_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_production_access_secret`
   - `JWT_REFRESH_SECRET` = `your_production_refresh_secret`
   - `CLOUDINARY_CLOUD_NAME` = `your_cloudinary_cloud_name`
   - `CLOUDINARY_API_KEY` = `your_cloudinary_api_key`
   - `CLOUDINARY_API_SECRET` = `your_cloudinary_api_secret`
5. Click **Deploy Web Service**. 
   *Once active, copy the live URL (e.g. `https://optimus-blog-api.onrender.com`). Your API root endpoint is `https://optimus-blog-api.onrender.com/api`.*

---

### Step 4: Deploy the Frontend (on Vercel)
We will deploy the React/Vite frontend to [Vercel](https://vercel.com).

1. Go to your Vercel Dashboard and click **Add New > Project**.
2. Select your GitHub repository.
3. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and select `client`
   - **Build Command:** `npm run build` (Vite compiles down to static assets in `dist/`)
4. Open the **Environment Variables** dropdown and add:
   - Key: `VITE_API_URL`
   - Value: `https://optimus-blog-api.onrender.com/api` *(Your live Render backend API URL)*
5. Click **Deploy**.
6. Once deployment finishes, copy your live Vercel URL (e.g. `https://optimus-blog-app.vercel.app`).

---

### Step 5: Close the Loop (CORS Whitelist Update)
1. Go back to your **Render backend service dashboard**.
2. Navigate to **Environment Variables**.
3. Update `CLIENT_URL` to match your live Vercel frontend URL (e.g., `https://optimus-blog-app.vercel.app`).
4. Save changes. Render will automatically redeploy the service.

Your full-stack application is now fully connected and running live in production! 🚀
