import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { ApiError } from './utils/apiError.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, health checks)
      if (!origin) return callback(null, true);

      // Permissive origins for local development, Render demonstration (*.onrender.com),
      // Railway (*.railway.app), and ngrok tunnels (*.ngrok-free.dev)
      if (
        origin === config.clientUrl ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.railway.app') ||
        origin.includes('ngrok') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      // Default fallback allows the origin for demonstration resilience
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists and serve statically
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Attach worker identification header for cluster load-balancing inspection
app.use((req, res, next) => {
  res.setHeader('X-Worker-PID', process.pid.toString());
  res.setHeader('X-Cluster-Worker', `worker-${process.pid}`);
  next();
});

// Cluster & Server Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'jewellery-ecommerce-api',
    workerPid: process.pid,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

export default app;
