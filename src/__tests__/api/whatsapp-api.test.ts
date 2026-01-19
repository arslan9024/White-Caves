import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const client = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true, // Don't throw on any status
});

describe('WhatsApp API Tests', () => {
  let accountId: string;
  let conversationId: string;
  let messageId: string;

  beforeAll(async () => {
    // Setup test data if needed
  });

  afterAll(async () => {
    // Cleanup test data
  });

  describe('Authentication & Authorization', () => {
    it('should return 401 for unauthorized requests', async () => {
      const response = await axios.get(`${BASE_URL}/accounts`);
      expect(response.status).toBe(401);
    });

    it('should return 403 for forbidden resources', async () => {
      const response = await client.get('/accounts/other-user-account', {
        headers: { Authorization: 'Bearer invalid-token' },
      });
      expect(response.status).toBe(403);
    });
  });

  describe('Account Management', () => {
    it('POST /accounts - should link a new account', async () => {
      const response = await client.post('/accounts', {
        phoneNumber: '+12025551234',
        displayName: 'Test Account',
        agentId: 'agent-123',
      });

      expect([200, 201]).toContain(response.status);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('phoneNumber');

      accountId = response.data.id;
    });

    it('GET /accounts - should retrieve all accounts', async () => {
      const response = await client.get('/accounts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('GET /accounts/:id - should retrieve account details', async () => {
      if (!accountId) return; // Skip if account wasn't created

      const response = await client.get(`/accounts/${accountId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('phoneNumber');
      expect(response.data).toHaveProperty('displayName');
    });

    it('PUT /accounts/:id - should update account', async () => {
      if (!accountId) return;

      const response = await client.put(`/accounts/${accountId}`, {
        displayName: 'Updated Account Name',
      });

      expect(response.status).toBe(200);
      expect(response.data.displayName).toBe('Updated Account Name');
    });

    it('DELETE /accounts/:id - should unlink account', async () => {
      if (!accountId) return;

      const response = await client.delete(`/accounts/${accountId}`);

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Conversations', () => {
    it('GET /conversations - should list conversations', async () => {
      const response = await client.get('/conversations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('GET /conversations/:id - should get conversation details', async () => {
      // Assume first conversation exists
      const listResponse = await client.get('/conversations');
      if (listResponse.data.length === 0) return;

      conversationId = listResponse.data[0].id;
      const response = await client.get(`/conversations/${conversationId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('contactNumber');
    });

    it('GET /conversations/:id/messages - should get conversation messages', async () => {
      if (!conversationId) return;

      const response = await client.get(
        `/conversations/${conversationId}/messages`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('PATCH /conversations/:id/archive - should archive conversation', async () => {
      if (!conversationId) return;

      const response = await client.patch(
        `/conversations/${conversationId}/archive`
      );

      expect(response.status).toBe(200);
    });

    it('PATCH /conversations/:id/mute - should mute conversation', async () => {
      if (!conversationId) return;

      const response = await client.patch(
        `/conversations/${conversationId}/mute`,
        { duration: 3600 }
      );

      expect(response.status).toBe(200);
    });
  });

  describe('Messages', () => {
    it('POST /messages - should send a message', async () => {
      if (!conversationId) return;

      const response = await client.post('/messages', {
        conversationId,
        content: 'Test message',
        contentType: 'text',
      });

      expect([200, 201]).toContain(response.status);
      expect(response.data).toHaveProperty('id');

      messageId = response.data.id;
    });

    it('GET /messages/:id - should get message details', async () => {
      if (!messageId) return;

      const response = await client.get(`/messages/${messageId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('content');
    });

    it('PUT /messages/:id - should edit message', async () => {
      if (!messageId) return;

      const response = await client.put(`/messages/${messageId}`, {
        content: 'Updated message',
      });

      expect(response.status).toBe(200);
    });

    it('PATCH /messages/:id/read - should mark message as read', async () => {
      if (!messageId) return;

      const response = await client.patch(`/messages/${messageId}/read`);

      expect(response.status).toBe(200);
    });

    it('DELETE /messages/:id - should delete message', async () => {
      if (!messageId) return;

      const response = await client.delete(`/messages/${messageId}`);

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Contacts', () => {
    let contactId: string;

    it('POST /contacts - should create contact', async () => {
      const response = await client.post('/contacts', {
        phoneNumber: '+12025551234',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect([200, 201]).toContain(response.status);
      expect(response.data).toHaveProperty('id');

      contactId = response.data.id;
    });

    it('GET /contacts - should list contacts', async () => {
      const response = await client.get('/contacts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('GET /contacts/:id - should get contact details', async () => {
      if (!contactId) return;

      const response = await client.get(`/contacts/${contactId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('phoneNumber');
    });

    it('PUT /contacts/:id - should update contact', async () => {
      if (!contactId) return;

      const response = await client.put(`/contacts/${contactId}`, {
        firstName: 'Jane',
      });

      expect(response.status).toBe(200);
    });

    it('DELETE /contacts/:id - should delete contact', async () => {
      if (!contactId) return;

      const response = await client.delete(`/contacts/${contactId}`);

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Analytics', () => {
    it('GET /analytics/accounts/:id/stats - should get account statistics', async () => {
      if (!accountId) return;

      const response = await client.get(`/analytics/accounts/${accountId}/stats`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalMessages');
      expect(response.data).toHaveProperty('totalConversations');
    });

    it('GET /analytics/conversations/:id/stats - should get conversation stats', async () => {
      if (!conversationId) return;

      const response = await client.get(
        `/analytics/conversations/${conversationId}/stats`
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('messageCount');
    });

    it('GET /analytics/daily-messages - should get daily message count', async () => {
      const response = await client.get('/analytics/daily-messages', {
        params: {
          date: new Date().toISOString().split('T')[0],
        },
      });

      expect(response.status).toBe(200);
      expect(typeof response.data.count).toBe('number');
    });

    it('GET /analytics/message-trends - should get message trends', async () => {
      const response = await client.get('/analytics/message-trends', {
        params: {
          days: 7,
        },
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Media', () => {
    it('POST /media/upload - should upload media file', async () => {
      // Note: This would require FormData and file upload
      // Implementation depends on your file upload endpoint
      const response = await client.post(
        '/media/upload',
        { fileName: 'test.txt' },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      expect([200, 201, 400]).toContain(response.status); // 400 for missing file
    });

    it('GET /media/:id - should download media', async () => {
      const response = await client.get('/media/test-media-id', {
        responseType: 'blob',
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Sessions', () => {
    let sessionId: string;

    it('POST /sessions - should create session', async () => {
      if (!accountId) return;

      const response = await client.post('/sessions', {
        accountId,
        sessionName: 'test-session',
      });

      expect([200, 201]).toContain(response.status);
      if (response.data.id) {
        sessionId = response.data.id;
      }
    });

    it('GET /sessions - should list sessions', async () => {
      const response = await client.get('/sessions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('GET /sessions/:id/status - should get session status', async () => {
      if (!sessionId) return;

      const response = await client.get(`/sessions/${sessionId}/status`);

      expect(response.status).toBe(200);
      expect(['active', 'inactive', 'error']).toContain(response.data.status);
    });

    it('POST /sessions/:id/restart - should restart session', async () => {
      if (!sessionId) return;

      const response = await client.post(`/sessions/${sessionId}/restart`);

      expect(response.status).toBe(200);
    });

    it('DELETE /sessions/:id - should end session', async () => {
      if (!sessionId) return;

      const response = await client.delete(`/sessions/${sessionId}`);

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent resources', async () => {
      const response = await client.get('/conversations/non-existent-id');

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid input', async () => {
      const response = await client.post('/accounts', {
        phoneNumber: 'invalid-phone',
      });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should return 500 for server errors', async () => {
      // This would require triggering an actual server error
      // Implementation depends on your error handling
    });

    it('should handle rate limiting', async () => {
      // Make multiple rapid requests
      const responses = await Promise.all(
        Array(100)
          .fill(null)
          .map(() => client.get('/conversations'))
      );

      const rateLimitedResponse = responses.find(
        (r) => r.status === 429 || r.headers['retry-after']
      );
      // Depending on rate limiting implementation
      expect(rateLimitedResponse).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should validate phone number format', async () => {
      const response = await client.post('/accounts', {
        phoneNumber: '123',
        displayName: 'Test',
      });

      expect(response.status).toBe(400);
    });

    it('should validate required fields', async () => {
      const response = await client.post('/messages', {
        conversationId: 'conv-123',
        // Missing content
      });

      expect(response.status).toBe(400);
    });

    it('should sanitize input to prevent XSS', async () => {
      const response = await client.post('/messages', {
        conversationId: 'conv-123',
        content: '<script>alert("XSS")</script>',
      });

      if (response.status === 201 || response.status === 200) {
        expect(response.data.content).not.toContain('<script>');
      }
    });
  });
});
