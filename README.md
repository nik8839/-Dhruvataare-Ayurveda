# EduTech Platform

A complete educational technology platform with frontend (Next.js) and backend (Node.js/Express) designed to handle 3k-5k concurrent users.

## Features

### Frontend

- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Responsive Design**: Works on all devices
- **User Authentication**: Login/Sign up with JWT
- **PDF Viewing**: View PDFs directly in the browser
- **Payment Integration**: Razorpay payment gateway
- **Admin Dashboard**: Analytics and content management
- **Footer with Community Links**: Join our community section

### Backend

- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT-based authentication
- **Analytics**: Track page views, PDF views, downloads
- **Caching**: Redis caching for performance
- **File Upload**: PDF upload with Multer
- **Payment Gateway**: Razorpay integration
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, input validation

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Redis** (Optional but recommended) - [Download](https://redis.io/download) or use [Redis Cloud](https://redis.com/try-free/) (free tier available)
- **Git** - [Download](https://git-scm.com/)

## Project Structure

```
PRJ_1211/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── exclusive/         # Exclusive content pages
│   ├── pyq/               # PYQ pages
│   ├── notes/             # Notes pages
│   ├── syllabus/          # Syllabus pages
│   ├── community/         # Community page
│   ├── login/             # Login/Sign up page
│   ├── profile/           # User profile
│   └── ...
├── components/            # React components
│   ├── Header.tsx        # Header with navigation
│   ├── Footer.tsx        # Footer with community links
│   ├── ExclusiveIcons.tsx
│   └── ...
├── lib/                   # API utilities
│   └── api.ts            # API helper functions
├── server/                # Backend server
│   ├── config/           # Database, Redis config
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Utility scripts
│   └── server.js         # Main server file
└── package.json
```

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd PRJ_1211
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons
- And other dependencies

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

This will install all required packages including:

- Express.js
- Mongoose (MongoDB ODM)
- JWT (JSON Web Tokens)
- Bcrypt (Password hashing)
- Multer (File uploads)
- Razorpay (Payment gateway)
- Redis client
- And other dependencies

### Step 4: Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB** on your system:

   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service**:

   - Windows: MongoDB should start automatically as a service
   - macOS/Linux: `mongod` or `sudo systemctl start mongod`

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # or
   mongo
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user (username and password)
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/edutech`)

### Step 5: Set Up Redis (Optional but Recommended)

#### Option A: Local Redis

1. **Install Redis**:

   - Windows: Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases) or use WSL
   - macOS: `brew install redis`
   - Linux: `sudo apt-get install redis-server` (Ubuntu/Debian)

2. **Start Redis**:

   - Windows: Run `redis-server.exe`
   - macOS/Linux: `redis-server` or `sudo systemctl start redis`

3. **Verify Redis is running**:
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

#### Option B: Redis Cloud (Free Tier Available)

1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create a free account
3. Create a new database
4. Get your connection details (host, port, password)

### Step 6: Configure Environment Variables

#### Frontend Configuration

Create a `.env.local` file in the root directory:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend Configuration

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Create a `.env` file:

   ```bash
   cp .env.example .env
   # or create .env manually
   ```

3. Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/edutech

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/edutech?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=7d

# Redis Configuration (Optional)
# For Local Redis:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# For Redis Cloud:
# REDIS_HOST=your-redis-host.redis.cloud
# REDIS_PORT=12345
# REDIS_PASSWORD=your-redis-password

# Razorpay Payment Gateway (Get from https://razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Admin User Creation (Optional - for createAdmin script)
ADMIN_EMAIL=admin@edutech.com
ADMIN_PASSWORD=admin123
```

**Important Notes:**

- Replace `JWT_SECRET` with a strong random string (at least 32 characters)
- For MongoDB Atlas, use `MONGODB_URI_PROD` instead of `MONGODB_URI`
- If not using Redis, the app will work but without caching (slower performance)
- Razorpay keys can be obtained from [Razorpay Dashboard](https://dashboard.razorpay.com/) (test keys for development)

### Step 7: Create Admin User

1. Make sure MongoDB is running and connected
2. Navigate to server directory:

   ```bash
   cd server
   ```

3. Run the admin creation script:

   ```bash
   node scripts/createAdmin.js
   ```

   This will create an admin user with:

   - Email: `admin@edutech.com` (or from ADMIN_EMAIL in .env)
   - Password: `admin123` (or from ADMIN_PASSWORD in .env)

   **Important:** Change the admin password after first login!

### Step 8: Create Uploads Directory

The backend needs a directory to store uploaded PDFs:

```bash
cd server
mkdir uploads
```

Or it will be created automatically on first upload.

## Running the Application

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:5000`

You should see:

```
MongoDB Connected: localhost:27017
Redis client connected (if Redis is configured)
Server running in development mode on port 5000
```

#### Terminal 2: Start Frontend Server

```bash
# From root directory
npm run dev
```

The frontend will start on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`

### Production Mode

#### Build Frontend

```bash
npm run build
npm start
```

#### Start Backend

```bash
cd server
npm start
```

## How It Works

### 🎓 User Experience

The application is designed to be intuitive for students, providing quick access to study materials.

#### 1. **Home Page & Navigation**
- **Central Hub**: The Home Page features three main cards: **Syllabus**, **PYQs**, and **Notes**.
- **Interactive Dialogs**: Clicking on these cards opens an interactive dialog box (popup) that guides you through the selection process without leaving the page.
- **Community Access**: The footer and dedicated "Community" page provide links to WhatsApp groups, Telegram channels, and YouTube.

#### 2. **Syllabus Section**
- **Hierarchy**: Organized as `Year -> Subject -> PDF`.
- **Flow**:
    1.  Click "Syllabus".
    2.  Select your **Academic Year** (e.g., 1st Year).
    3.  Select your **Subject** from the list.
    4.  The Syllabus PDF opens directly in a built-in viewer.

#### 3. **Previous Year Questions (PYQs)**
- **Hierarchy**: Organized as `Year -> Subject -> Academic Year (of paper) -> Paper`.
- **Flow**:
    1.  Click "PYQs".
    2.  Select **Year** (e.g., 1st Year).
    3.  Select **Subject**.
    4.  Select the **Year of the Paper** (e.g., 2023).
    5.  Select the specific **Paper** (e.g., Paper 1).
    6.  View the PDF instantly.

#### 4. **Study Notes**
- **Hierarchy**: Organized as `Year -> Subject -> Unit/Topic`.
- **Flow**: Similar to Syllabus, allowing students to drill down to specific topics.

#### 5. **Exclusive & Premium Content**
- **Achievers Series**: Special content for top performers.
- **Premium PDFs**: Some content may be locked. Users can purchase these using the integrated **Razorpay** gateway. Once purchased, the download link becomes active.

### 🛡️ Admin Experience

Admins have full control over the platform's content via a secured dashboard.

#### 1. **Accessing the Dashboard**
- Log in with admin credentials.
- Click "Admin Dashboard" in the profile menu.

#### 2. **Uploading Content**
- **Unified Upload Form**: A single form handles all content types.
- **Steps**:
    1.  **Title**: Enter a descriptive title.
    2.  **Category**: Choose Syllabus, PYQ, Notes, or Exclusive.
    3.  **Hierarchy Details**: Depending on the category, dynamic fields appear (Year, Subject, Paper, etc.).
    4.  **File**: Upload the PDF.
    5.  **Premium Status**: Mark as "Premium" and set a price if applicable.
- **Automatic Organization**: The system automatically categorizes the file and makes it available in the correct section on the frontend.

#### 3. **Analytics**
- View real-time stats on:
    - Total Users
    - PDF Views & Downloads
    - Revenue
    - Popular Content

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user

  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (Protected - requires JWT token in header)

### PDFs

- `GET /api/pdfs` - Get all PDFs (with optional filters: category, year, subject, yearValue, paper)
- `GET /api/pdfs/:id` - Get single PDF
- `GET /api/pdfs/:id/view` - View PDF file (returns PDF stream)
- `GET /api/pdfs/:id/download` - Download PDF (Protected)
- `POST /api/pdfs` - Create PDF (Admin only - requires multipart/form-data)
- `PUT /api/pdfs/:id` - Update PDF (Admin only)
- `DELETE /api/pdfs/:id` - Delete PDF (Admin only)

### Payments

- `POST /api/payments/create-order` - Create payment order (Protected)
- `POST /api/payments/verify` - Verify payment (Protected)
- `GET /api/payments/purchases` - Get user purchases (Protected)

### Analytics (Admin only)

- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/realtime` - Get real-time analytics

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**:

   - Verify MongoDB is running: `mongosh` or `mongo`
   - Check connection string in `.env`
   - For Atlas, ensure IP is whitelisted

2. **Redis Connection Error**:

   - Verify Redis is running: `redis-cli ping`
   - Check Redis configuration in `.env`
   - App will work without Redis (just slower)

3. **Port Already in Use**:

   - Change `PORT` in `.env` file
   - Or kill process using port 5000:

     ```bash
     # Windows
     netstat -ano | findstr :5000
     taskkill /PID <PID> /F

     # macOS/Linux
     lsof -ti:5000 | xargs kill
     ```

4. **JWT Secret Error**:
   - Ensure `JWT_SECRET` is set in `.env`
   - Use a strong random string (32+ characters)

### Frontend Issues

1. **API Connection Error**:

   - Verify backend is running on port 5000
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check browser console for CORS errors

2. **Build Errors**:

   - Delete `.next` folder and rebuild:
     ```bash
     rm -rf .next
     npm run build
     ```

3. **Port Already in Use**:

   - Kill process using port 3000:

     ```bash
     # Windows
     netstat -ano | findstr :3000
     taskkill /PID <PID> /F

     # macOS/Linux
     lsof -ti:3000 | xargs kill
     ```

### General Issues

1. **Module Not Found**:

   - Delete `node_modules` and reinstall:
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     ```

2. **Environment Variables Not Loading**:

   - Restart the development server
   - Ensure `.env` files are in correct locations
   - Check for typos in variable names

3. **PDF Upload Fails**:
   - Check `uploads` directory exists in `server/` folder
   - Verify file size is under `MAX_FILE_SIZE` limit
   - Ensure file is PDF format

## Performance Optimizations

### For 3k-5k Concurrent Users

1. **Database Indexing**: Already optimized with indexes on frequently queried fields
2. **Redis Caching**: Frequently accessed data cached (5 min - 1 hour)
3. **Connection Pooling**: MongoDB connection pool (max 10 connections)
4. **Asynchronous Analytics**: Analytics tracking doesn't block requests
5. **Compression**: Gzip compression for API responses
6. **Rate Limiting**: Prevents abuse (100 req/15min per IP)

### Scaling Recommendations

1. **Load Balancer**: Use Nginx or AWS ELB
2. **Multiple Instances**: Run multiple Node.js instances (PM2 cluster mode)
   ```bash
   pm2 start server/server.js -i max
   ```
3. **Database**: MongoDB Atlas with replica set
4. **Caching**: Redis cluster for distributed caching
5. **CDN**: Use CDN for static assets and PDFs
6. **Monitoring**: Implement monitoring (PM2, New Relic, etc.)

## Security Features

- JWT authentication with secure token storage
- Password hashing with bcrypt (10 rounds)
- Rate limiting to prevent abuse
- Helmet for security headers
- Input validation with express-validator
- CORS configuration
- File upload validation (PDF only, size limits)

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload in development
2. **API Testing**: Use Postman or Thunder Client (VS Code extension) to test APIs
3. **Database GUI**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) to view/edit data
4. **Redis GUI**: Use [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) to view cache

## Production Deployment

1. **Build Frontend**:

   ```bash
   npm run build
   ```

2. **Set Environment Variables**:

   - Set `NODE_ENV=production`
   - Use production MongoDB connection string
   - Use production Redis connection
   - Set strong JWT_SECRET
   - Configure production Razorpay keys

3. **Use Process Manager**:

   ```bash
   # Install PM2
   npm install -g pm2

   # Start backend
   cd server
   pm2 start server.js -i max --name edutech-backend

   # Start frontend
   cd ..
   pm2 start npm --name edutech-frontend -- start
   ```

4. **Set Up Reverse Proxy** (Nginx example):

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
       }

       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

5. **SSL/TLS**: Use Let's Encrypt for free SSL certificates

## Support

For issues or questions:

- Check the troubleshooting section above
- Review error logs in console
- Check MongoDB and Redis connection status
- Verify all environment variables are set correctly

## License

ISC

---

**Happy Learning with EduTech! 🚀**
