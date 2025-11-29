const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Auth API - Unit Tests', () => {
  // Test OTP generation
  describe('POST /api/auth/send-otp', () => {
    test('should return 400 if phone number is missing', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should return 400 if phone number is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ phone: '123' }); // Invalid phone
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should send OTP for valid phone number', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ phone: '9999999999' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('OTP sent');
    });
  });

  // Test OTP verification
  describe('POST /api/auth/verify-otp', () => {
    test('should return 400 if phone or OTP is missing', async () => {
      const res = await request(app)
        .post('/api/auth/verify-otp')
        .send({ phone: '9999999999' }); // Missing OTP
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should return 401 for invalid OTP', async () => {
      // First send OTP
      await request(app)
        .post('/api/auth/send-otp')
        .send({ phone: '9999999999' });

      // Try with wrong OTP
      const res = await request(app)
        .post('/api/auth/verify-otp')
        .send({ 
          phone: '9999999999',
          otp: '000000' // Wrong OTP
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // Test admin login
  describe('POST /api/auth/admin/login', () => {
    test('should return 400 if credentials are missing', async () => {
      const res = await request(app)
        .post('/api/auth/admin/login')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: 'wrong@email.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.close();
});
