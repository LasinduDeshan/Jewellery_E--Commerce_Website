import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`[Server] Jewellery API is running on http://localhost:${config.port}`);
    console.log(`[API Ready] Custom Requests: http://localhost:${config.port}/api/custom-requests`);
  });
};

startServer();
