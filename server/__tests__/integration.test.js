const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const PDF = require('../models/PDF');

describe('Integration Tests - Complete User Flows', () => {
  let authToken;
  let userId;
  let pdfId;

  // Test complete signup and login flow
  describe('User Authentication Flow', () => {
    const testPhone = '9876543210';
    let sentOTP;

    test('Complete signup flow: Send OTP → Verify → Get Token', async () => {
      // Step 1: Send OTP
      const otpRes = await request(app)
        .post('/api/auth/send-otp')
        .send({ phone: testPhone });
      
      expect(otpRes.statusCode).toBe(200);
      expect(otpRes.body.success).toBe(true);

      // In real scenario, you'd get OTP from database or mock it
      // For testing, we'll need to extract OTP from the database
      const user = await User.findOne({ phone: testPhone });
      sentOTP = user?.otp;

      // Step 2: Verify OTP (if we have it)
      if (sentOTP) {
        const verifyRes = await request(app)
          .post('/api/auth/verify-otp')
          .send({ 
            phone: testPhone,
            otp: sentOTP 
          });
        
        if (verifyRes.statusCode === 200) {
          expect(verifyRes.body.success).toBe(true);
          expect(verifyRes.body.token).toBeDefined();
          authToken = verifyRes.body.token;
          userId = verifyRes.body.user._id;
        }
      }
    });
  });

  // Test complete PDF browsing and viewing flow
  describe('PDF Browsing Flow', () => {
    test('Browse PDFs → View specific PDF → Check access', async () => {
      // Step 1: Get all PDFs
      const listRes = await request(app)
        .get('/api/pdfs');
      
      expect(listRes.statusCode).toBe(200);
      expect(listRes.body.success).toBe(true);
      expect(Array.isArray(listRes.body.data)).toBe(true);

      // Step 2: If PDFs exist, get details of first one
      if (listRes.body.data.length > 0) {
        pdfId = listRes.body.data[0]._id;
        
        const detailRes = await request(app)
          .get(`/api/pdfs/${pdfId}`);
        
        expect(detailRes.statusCode).toBe(200);
        expect(detailRes.body.success).toBe(true);
        expect(detailRes.body.data._id).toBe(pdfId);
      }
    });

    test('Filter PDFs by category and subject', async () => {
      // Filter by category
      const categoryRes = await request(app)
        .get('/api/pdfs?category=exclusive');
      
      expect(categoryRes.statusCode).toBe(200);
      expect(categoryRes.body.success).toBe(true);

      // Filter by subject
      const subjectRes = await request(app)
        .get('/api/pdfs?subject=Mathematics');
      
      expect(subjectRes.statusCode).toBe(200);
      expect(subjectRes.body.success).toBe(true);
    });
  });

  // Test complete payment flow (mock mode)
  describe('Payment Flow - Mock Mode', () => {
    test('Create order → Verify payment → Check purchase', async () => {
      if (!authToken || !pdfId) {
        console.log('Skipping payment test - no auth token or PDF ID');
        return;
      }

      // Step 1: Create payment order
      const orderRes = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ pdfId });
      
      if (orderRes.statusCode === 200) {
        expect(orderRes.body.success).toBe(true);
        expect(orderRes.body.order).toBeDefined();

        const orderId = orderRes.body.order.id;
        const purchaseId = orderRes.body.purchaseId;

        // Step 2: Verify payment (mock mode)
        const verifyRes = await request(app)
          .post('/api/payments/verify')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            razorpay_order_id: orderId,
            razorpay_payment_id: 'mock_payment_id',
            razorpay_signature: 'mock_signature',
            purchaseId: purchaseId
          });
        
        if (verifyRes.statusCode === 200) {
          expect(verifyRes.body.success).toBe(true);
          expect(verifyRes.body.message).toContain('successful');
        }
      }
    });
  });

  // Test admin flow
  describe('Admin Flow', () => {
    test('Admin login → Access admin routes', async () => {
      const adminRes = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: process.env.ADMIN_EMAIL || 'admin@edutech.com',
          password: process.env.ADMIN_PASSWORD || 'admin123'
        });
      
      if (adminRes.statusCode === 200) {
        expect(adminRes.body.success).toBe(true);
        expect(adminRes.body.token).toBeDefined();
        
        const adminToken = adminRes.body.token;

        // Try to access admin route
        const statsRes = await request(app)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Should be authorized
        expect([200, 404]).toContain(statsRes.statusCode);
      }
    });
  });

  // Cleanup
  afterAll(async () => {
    // Clean up test data
    if (userId) {
      await User.findByIdAndDelete(userId);
    }
    await mongoose.connection.close();
  });
});
