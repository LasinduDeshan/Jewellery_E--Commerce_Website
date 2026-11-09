import cluster from 'node:cluster';
import os from 'node:os';
import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const isPrimary = (cluster as any).isPrimary ?? (cluster as any).isMaster;

// Force round-robin load distribution across workers on all platforms (including Windows)
cluster.schedulingPolicy = cluster.SCHED_RR;

if (isPrimary) {
  const numCPUs = os.cpus().length;
  const workerCount = process.env.WORKERS_COUNT
    ? parseInt(process.env.WORKERS_COUNT, 10)
    : Math.min(numCPUs, 4);

  console.log('='.repeat(65));
  console.log(`[Cluster Primary] Master PID: ${process.pid}`);
  console.log(`[Cluster Primary] Available System CPU Cores: ${numCPUs}`);
  console.log(`[Cluster Primary] Forking ${workerCount} worker processes into pool`);
  console.log('='.repeat(65));

  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  // Handle worker lifecycle and auto-recovery
  cluster.on('online', (worker) => {
    console.log(`[Cluster Primary] Worker #${worker.id} (PID: ${worker.process.pid}) is ready to accept requests`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.warn(
      `[Cluster Alert] Worker #${worker.id} (PID: ${worker.process.pid}) terminated (code: ${code}, signal: ${signal}). Auto-recovering...`
    );
    const newWorker = cluster.fork();
    console.log(`[Cluster Auto-Recover] Replacement worker spawned (PID: ${newWorker.process.pid})`);
  });
} else {
  // Worker Process: share TCP server port 5000 via OS round-robin
  const startWorker = async () => {
    try {
      await connectDB();
      app.listen(config.port, () => {
        console.log(
          `[Cluster Worker] Worker #${cluster.worker?.id} (PID: ${process.pid}) active on http://localhost:${config.port}`
        );
      });
    } catch (err) {
      console.error(`[Cluster Worker Error] PID ${process.pid} initialization failed:`, err);
      process.exit(1);
    }
  };

  startWorker();
}
