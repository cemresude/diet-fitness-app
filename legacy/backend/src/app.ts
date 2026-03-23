import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🤖 AI Provider: ${config.ai.provider}`);
});

export default app;
