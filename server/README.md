# EduTech Backend Server

Backend API server for the EduTech platform built with Node.js and Express, designed to handle 3k-5k concurrent users.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **PDF Management**: Upload, view, and download PDFs with access control
- **Payment Integration**: Razorpay payment gateway integration
- **Caching**: Redis caching for improved performance
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, input validation
- **Database**: MongoDB with optimized indexes
- **File Upload**: Multer for PDF file handling

## Performance Optimizations

1. **Redis Caching**: Frequently accessed data cached to reduce database load
2. **Database Indexing**: Optimized indexes on frequently queried fields
3. **Connection Pooling**: MongoDB connection pooling (max 10 connections)
4. **Compression**: Gzip compression for API responses
5. **Rate Limiting**: Prevents abuse and ensures fair resource usage
6. **Efficient Queries**: Optimized database queries with proper indexing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional but recommended for production)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - Razorpay keys (if using payment)
   - Redis configuration (if using Redis)

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### PDFs
- `GET /api/pdfs` - Get all PDFs (with filters)
- `GET /api/pdfs/:id` - Get single PDF
- `GET /api/pdfs/:id/view` - View PDF file
- `GET /api/pdfs/:id/download` - Download PDF (Protected)
- `POST /api/pdfs` - Create PDF (Admin only)
- `PUT /api/pdfs/:id` - Update PDF (Admin only)
- `DELETE /api/pdfs/:id` - Delete PDF (Admin only)

### Payments
- `POST /api/payments/create-order` - Create payment order (Protected)
- `POST /api/payments/verify` - Verify payment (Protected)
- `GET /api/payments/purchases` - Get user purchases (Protected)

## Environment Variables

See `.env.example` for all required environment variables.

## Database Models

- **User**: User accounts with authentication
- **PDF**: PDF documents with metadata
- **Purchase**: Purchase records for premium content

## Scaling for 3k-5k Users

### Recommended Setup

1. **Load Balancer**: Use Nginx or AWS ELB
2. **Multiple Instances**: Run multiple Node.js instances (PM2 cluster mode)
3. **Database**: MongoDB Atlas with replica set
4. **Caching**: Redis cluster for distributed caching
5. **CDN**: Use CDN for static assets and PDFs
6. **Monitoring**: Implement monitoring (PM2, New Relic, etc.)

### PM2 Cluster Mode

```bash
pm2 start server.js -i max
```

### Nginx Configuration Example

```nginx
upstream backend {
    least_conn;
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet for security headers
- Input validation
- CORS configuration
- File upload validation

## Testing

```bash
# Health check
curl http://localhost:5000/health
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or managed MongoDB
3. Set up Redis cluster
4. Configure load balancer
5. Set up monitoring and logging
6. Use PM2 or similar process manager
7. Configure SSL/TLS certificates

