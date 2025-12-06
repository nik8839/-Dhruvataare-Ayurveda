# 🚀 Production Deployment Guide (5k+ Users)

This guide details how to deploy the EduTech platform for a high-load environment (5,000+ concurrent users).

## 🏗️ Architecture for High Load

To handle 5k users smoothly, we cannot just run `npm start`. We need a robust architecture:

1.  **Frontend (Next.js)**: Deployed on **Vercel** (Recommended for best performance/CDN) or a high-performance **VPS**.
2.  **Backend (Node.js)**: Deployed on a **VPS (Virtual Private Server)** using **PM2** (Process Manager) in Cluster Mode to utilize all CPU cores.
3.  **Database**: **MongoDB Atlas** (Dedicated Cluster, e.g., M10 or higher) for auto-scaling and backups.
4.  **Caching**: **Redis Cloud** (or managed Redis) to cache frequent queries (Syllabus, PYQs) and relieve database load.
5.  **Load Balancer**: **Nginx** as a reverse proxy to handle SSL, compression, and static files.

---

## 🔑 Step 1: Prepare Your Credentials

You mentioned you have the details. Here is where they go.

### Backend Configuration (`server/.env`)
On your production server, your `.env` file should look like this:

```env
# Server Settings
PORT=5000
NODE_ENV=production

# 1. Database (CRITICAL for 5k users)
# Use the Connection String from MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edutech?retryWrites=true&w=majority&maxPoolSize=50

# 2. Security
# Generate a long random string (e.g., `openssl rand -hex 64`)
JWT_SECRET=your_super_secure_long_random_string_here
JWT_EXPIRE=7d

# 3. Caching (CRITICAL for speed)
# Option A: Upstash Redis (Recommended for ease of use)
# 1. Go to https://upstash.com/ -> Create Database
# 2. Copy the "UPSTASH_REDIS_REST_URL" (it starts with redis:// or rediss://)
# Note: Use 'rediss://' for secure TLS connection (Recommended)
UPSTASH_REDIS_URL=rediss://default:password@endpoint:port

# Option B: Self-Hosted / Other Redis
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=your-redis-password

# 4. Payments (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# 5. SMS (Twilio - If you are using it for OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# 6. Admin Setup (For initial creation)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure_admin_password

# 7. CORS (Allow your frontend domain)
FRONTEND_URL=https://your-domain.com
```

### Frontend Configuration (`.env.local`)
If deploying to Vercel, add these in the **Project Settings > Environment Variables**.

```env
# Point to your production backend URL
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

---

## 🛠️ Step 2: Backend Deployment (VPS - Ubuntu)

**Recommended Specs**: 4 vCPUs, 8GB RAM (e.g., DigitalOcean Droplet or AWS t3.large).

1.  **Connect to Server**:
    ```bash
    ssh root@your-server-ip
    ```

2.  **Install Dependencies**:
    ```bash
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install Node.js 18+
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs

    # Install PM2 (Process Manager)
    sudo npm install -g pm2

    # Install Nginx
    sudo apt install -y nginx
    ```

3.  **Setup Code**:
    ```bash
    # Clone your repo
    git clone <your-repo-url>
    cd PRJ_1211/server

    # Install packages
    npm install --production
    ```

4.  **Configure Environment**:
    Create the `.env` file with the credentials from Step 1.
    ```bash
    nano .env
    # Paste credentials, Save (Ctrl+O), Exit (Ctrl+X)
    ```

5.  **Start with PM2 (Cluster Mode)**:
    This is the magic step for performance. `-i max` runs an instance on every CPU core.
    ```bash
    pm2 start server.js -i max --name "edutech-api"
    pm2 save
    pm2 startup
    ```

6.  **Configure Nginx (Reverse Proxy)**:
    Edit config: `sudo nano /etc/nginx/sites-available/default`
    ```nginx
    server {
        server_name api.your-domain.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    Restart Nginx: `sudo systemctl restart nginx`

7.  **SSL (HTTPS)**:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d api.your-domain.com
    ```

---

## 🌐 Step 3: Frontend Deployment (Vercel)

Vercel is the creators of Next.js and provides the best scaling for the frontend.

1.  Push your code to **GitHub**.
2.  Go to **Vercel.com** -> **Add New Project**.
3.  Import your repository.
4.  **Build Settings**:
    *   Root Directory: `./` (default)
    *   Framework Preset: Next.js
5.  **Environment Variables**:
    *   Add `NEXT_PUBLIC_API_URL` = `https://api.your-domain.com/api`
6.  Click **Deploy**.
7.  Add your custom domain (e.g., `www.your-domain.com`) in Vercel settings.

---

## 📈 Optimization Checklist for 5k Users

1.  **Database Connection Pool**: Ensure `maxPoolSize=50` is in your MongoDB URI.
2.  **Redis is Active**: Verify the backend logs say "Redis client connected". Without Redis, 5k users hitting the DB for every syllabus view will crash it.
3.  **CDN**: Vercel handles this automatically for the frontend. For PDF uploads, consider moving from local `uploads/` folder to **AWS S3** or **Cloudinary** if you have thousands of PDFs, as local disk space on the VPS will fill up.
    *   *Note: The current code saves to local disk. For massive scale, S3 is better, but local disk works if you have enough storage (e.g., 100GB+).*

## 🚨 Troubleshooting

*   **Server Crashes?** Check logs: `pm2 logs edutech-api`
*   **Slow Response?** Check database latency in MongoDB Atlas dashboard.
*   **CORS Errors?** Ensure `FRONTEND_URL` in backend `.env` matches your Vercel domain exactly.

---

## 🚀 Option 2: Cloud PaaS (Easier & Recommended)

This method uses **Railway** for the backend and **Vercel** for the frontend. It is easier to set up and manage.

### **Step 1: Push to GitHub**
1.  Create a new repository on GitHub.
2.  Push your entire project code to this repository.

### **Step 2: Deploy Backend (Railway)**
1.  Go to [Railway.app](https://railway.app/) and login with GitHub.
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repository.
4.  **Important:** Click on the project card -> **Settings** -> **Root Directory**.
    *   Set it to: `/server` (since your backend code is in the server folder).
5.  Go to the **Variables** tab and add all variables from `server/.env`:
    *   `MONGODB_URI`
    *   `JWT_SECRET`
    *   `UPSTASH_REDIS_URL` (or `REDIS_URL`)
    *   `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
    *   `TWILIO_...` credentials
    *   `ADMIN_PHONE`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`
    *   `FRONTEND_URL` (You can update this later after deploying frontend)
6.  Railway will automatically detect `package.json` and deploy.
7.  Once deployed, go to **Settings** -> **Networking** -> **Generate Domain**.
    *   Copy this URL (e.g., `https://edutech-production.up.railway.app`).

### **Step 3: Deploy Frontend (Vercel)**
1.  Go to [Vercel.com](https://vercel.com/) and login with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Framework Preset:** Next.js (should be auto-detected).
5.  **Root Directory:** `./` (Leave as default).
6.  **Environment Variables:**
    *   Add `NEXT_PUBLIC_API_URL`.
    *   Value: The Railway URL you copied + `/api` (e.g., `https://edutech-production.up.railway.app/api`).
7.  Click **Deploy**.

### **Step 4: Final Connection**
1.  Copy your new Vercel domain (e.g., `https://edutech.vercel.app`).
2.  Go back to **Railway** -> **Variables**.
3.  Add/Update `FRONTEND_URL` with your Vercel domain.
4.  Railway will redeploy automatically.

🎉 **Done! Your app is live!**
