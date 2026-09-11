import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example mock for property search
  http.get('/api/properties/search', () => {
    return HttpResponse.json([
      { id: '1', title: 'Luxury Villa', price: 5000000 },
    ]);
  }),
  
  // Example mock for getting a user
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: 'usr_123',
      name: 'John Doe',
      role: 'agent'
    });
  }),
];
