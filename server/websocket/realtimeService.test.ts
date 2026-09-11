import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import jwt from 'jsonwebtoken';
import { io as ioClient } from 'socket.io-client';
import { RealtimeService } from './realtimeService.js';
import { JWT_SECRET } from '../config/env.js';

describe('RealtimeService WebSocket Authentication', () => {
  let server: http.Server;
  let service: RealtimeService;
  let port: number;

  beforeAll(async () => {
    server = http.createServer();
    service = new RealtimeService(server);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          port = addr.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    service.stop();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('rejects connection without token', async () => {
    const client = ioClient(`http://localhost:${port}`, {
      transports: ['websocket'],
      autoConnect: false,
    });

    const err = await new Promise<Error>((resolve) => {
      client.on('connect_error', (e) => resolve(e));
      client.connect();
    });

    client.disconnect();
    expect(err.message).toBe('Authentication token required');
  });

  it('rejects connection with invalid token signature', async () => {
    const invalidToken = jwt.sign({ id: 'user-1', role: 'agent' }, 'wrong-secret');
    const client = ioClient(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token: invalidToken },
      autoConnect: false,
    });

    const err = await new Promise<Error>((resolve) => {
      client.on('connect_error', (e) => resolve(e));
      client.connect();
    });

    client.disconnect();
    expect(err.message).toBe('Invalid token');
  });

  it('rejects connection with token missing user identifier', async () => {
    const noSubToken = jwt.sign({ role: 'agent' }, JWT_SECRET, { algorithm: 'HS256' });
    const client = ioClient(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token: noSubToken },
      autoConnect: false,
    });

    const err = await new Promise<Error>((resolve) => {
      client.on('connect_error', (e) => resolve(e));
      client.connect();
    });

    client.disconnect();
    expect(err.message).toBe('Invalid token');
  });

  it('successfully authenticates and connects with valid HS256 JWT token', async () => {
    const validToken = jwt.sign(
      { sub: 'user-ws-123', role: 'admin', departmentId: 'sales' },
      JWT_SECRET,
      { algorithm: 'HS256' }
    );
    const client = ioClient(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token: validToken },
      autoConnect: false,
    });

    const connectedData = await new Promise<{
      userId: string;
      userRole: string;
      departmentId: string;
      timestamp: string;
    }>((resolve, reject) => {
      client.on('connected', (data) => resolve(data));
      client.on('connect_error', (e) => reject(e));
      client.connect();
    });

    client.disconnect();
    expect(connectedData.userId).toBe('user-ws-123');
    expect(connectedData.userRole).toBe('admin');
    expect(connectedData.departmentId).toBe('sales');
  });
});
