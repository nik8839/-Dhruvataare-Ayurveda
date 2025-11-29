const request = require('supertest');
const app = require('../server');
const PDF = require('../models/PDF');
const mongoose = require('mongoose');

describe('PDF API - Unit Tests', () => {
  let authToken;

  // Get auth token before tests (you'll need to implement this based on your auth)
  beforeAll(async () => {
    // Mock authentication - adjust based on your actual auth flow
    authToken = 'mock_token_for_testing';
  });

  describe('GET /api/pdfs', () => {
    test('should return list of PDFs', async () => {
      const res = await request(app)
        .get('/api/pdfs');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter PDFs by category', async () => {
      const res = await request(app)
        .get('/api/pdfs?category=exclusive');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should filter PDFs by subject', async () => {
      const res = await request(app)
        .get('/api/pdfs?subject=Mathematics');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/pdfs/:id', () => {
    test('should return 404 for invalid PDF ID', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/pdfs/${invalidId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('should return 400 for malformed PDF ID', async () => {
      const res = await request(app)
        .get('/api/pdfs/invalid-id');
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/pdfs (Admin only)', () => {
    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/pdfs')
        .send({
          title: 'Test PDF',
          description: 'Test Description'
        });
      
      expect(res.statusCode).toBe(401);
    });

    test('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/pdfs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test PDF'
          // Missing other required fields
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/pdfs/download/:id', () => {
    test('should return 401 without authentication', async () => {
      const testId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/pdfs/download/${testId}`);
      
      expect(res.statusCode).toBe(401);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
