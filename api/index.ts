import express from 'express';
import cors from 'cors';
import { mountHealthProperties } from '../server/serverless/healthProperties.js';
import { mountInventory } from '../server/serverless/inventory.js';
import { mountPricing } from '../server/serverless/pricing.js';
import { mountLeadScoring } from '../server/serverless/leadScoring.js';
import { mountRecommendations } from '../server/serverless/recommendations.js';
import { mountBookings } from '../server/serverless/bookings.js';
import { mountChatbot } from '../server/serverless/chatbot.js';
import { mountUnsupported } from '../server/serverless/unsupported.js';
import { AppError, errorHandler } from '../server/middleware/errorHandler.js';

const app = express();
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5000,http://localhost:3000')
  .split(',')
  .map(s => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin)) callback(null, true);
      else callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
mountHealthProperties(app);
mountInventory(app);
mountPricing(app);
mountLeadScoring(app);
mountRecommendations(app);
mountBookings(app);
mountChatbot(app);
mountUnsupported(app);
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});
app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    _next(
      error instanceof AppError
        ? error
        : error instanceof TypeError || error instanceof SyntaxError
          ? AppError.badRequest('Invalid request')
          : AppError.internal()
    );
  }
);
app.use(errorHandler);
export default app;
