/**
 * Manual mock for nodemailer (not installed)
 * Prevents Vite from failing when nodemailer is imported in test files
 */
const mockTransport = {
  sendMail: () => Promise.resolve({ messageId: 'mock-id' }),
  verify: () => Promise.resolve(true),
};

export const createTransport = () => mockTransport;
export const createTestAccount = () => Promise.resolve({ user: 'test', pass: 'test' });
export const getTestMessageUrl = () => 'http://mock.test.url';

export default {
  createTransport,
  createTestAccount,
  getTestMessageUrl,
};
