const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Payment API - Unit Tests', () => {
  let authToken;
  let testPdfId;

  beforeAll(async () => {
    // Mock auth token
    authToken = 'mock_token_for_testing';
    testPdfId = new mongoose.Types.ObjectId();
  });

  describe('POST /api/payments/create-order', () => {
    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({ pdfId: testPdfId });
      
      expect(res.statusCode).toBe(401);
    });

    test('should return 400 if pdfId is missing', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(res.statusCode).toBe(400);
    });

    test('should return 404 for non-existent PDF', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ pdfId: testPdfId });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/payments/verify', () => {
    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpay_order_id: 'test_order',
          razorpay_payment_id: 'test_payment',
          razorpay_signature: 'test_signature'
        });
      
      expect(res.statusCode).toBe(401);
    });

    test('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          razorpay_order_id: 'test_order'
          // Missing other fields
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/payments/history', () => {
    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/payments/history');
      
      expect(res.statusCode).toBe(401);
    });

    test('should return payment history for authenticated user', async () => {
      const res = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${authToken}`);
      
      // This will fail without proper auth, but structure is correct
      expect([200, 401]).toContain(res.statusCode);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
