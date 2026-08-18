import { describe, it, expect } from 'vitest';
import router from './appointments.js';

describe('src/server/routes/appointments', () => {
  it('exports Express router instance cleanly', () => {
    expect(router).toBeDefined();
    expect(typeof router).toBe('function');
    expect(typeof router.post).toBe('function');
  });
});
