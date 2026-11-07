import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition – basic info; you can extend by adding JSDoc comments in routes.
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'White Caves API',
    version: '2.0.26',
    description: 'Auto‑generated API documentation for White Caves backend services',
  },
  servers: [{ url: '/api', description: 'API base path' }],
};

const options = {
  swaggerDefinition,
  // Path to the API docs – all route files under src
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
