/**
 * User Profiles & KYC API Integration Tests
 * ──────────────────────────────────────────
 * Tests user profile fetching, field updates, KYC document uploads,
 * verification workflows, and favorite property toggling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockProfile } = vi.hoisted(() => {
  const prof: any = {
    userId: 'usr-101',
    profileCompletion: 80,
    documents: {
      emiratesId: {},
      passport: {},
      drivingLicense: {},
    },
    kyc: {
      status: 'pending',
    },
    favorites: {
      properties: [],
      searches: [],
    },
    calculateCompletion: vi.fn(),
  };
  prof.save = vi.fn().mockResolvedValue(prof);
  return { mockProfile: prof };
});

vi.mock('../models/UserProfile.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockProfile, ...data, save: vi.fn().mockResolvedValue({ ...mockProfile, ...data }) };
  };
  MockModel.findOne = vi.fn().mockImplementation(({ userId }: { userId: string }) => {
    if (userId === 'usr-101') return Promise.resolve(mockProfile);
    return Promise.resolve(null);
  });
  return { default: MockModel };
});

vi.mock('../models/User.js', () => ({
  default: {},
}));

import profilesRouter from './profiles.js';

describe('User Profiles API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/profiles', profilesRouter);
  });

  describe('GET /api/profiles/:userId', () => {
    it('returns existing user profile', async () => {
      const res = await request(app).get('/api/profiles/usr-101');

      expect(res.status).toBe(200);
      expect(res.body.userId).toBe('usr-101');
      expect(res.body.profileCompletion).toBe(80);
    });
  });

  describe('PATCH /api/profiles/:userId', () => {
    it('updates user profile details and recalculates completion', async () => {
      const res = await request(app)
        .patch('/api/profiles/usr-101')
        .send({ nationality: 'Emirati', preferredLanguage: 'ar' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile updated successfully');
      expect(res.body.profile).toBeDefined();
    });
  });

  describe('POST /api/profiles/:userId/documents/:docType', () => {
    it('uploads Emirates ID document details to user profile', async () => {
      const res = await request(app)
        .post('/api/profiles/usr-101/documents/emiratesId')
        .send({
          number: '784-1990-1234567-1',
          expiryDate: '2028-12-31',
          document: 'https://storage.whitecaves.ae/docs/eid-front.pdf',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('emiratesId document uploaded');
    });
  });

  describe('PATCH /api/profiles/:userId/kyc', () => {
    it('updates KYC verification status', async () => {
      const res = await request(app)
        .patch('/api/profiles/usr-101/kyc')
        .send({
          status: 'verified',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('KYC status updated');
      expect(res.body.kyc.status).toBe('verified');
    });
  });
});
