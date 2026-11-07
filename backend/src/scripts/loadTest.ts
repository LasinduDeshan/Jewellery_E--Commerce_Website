import http from 'node:http';

interface RequestMetric {
  statusCode: number;
  durationMs: number;
  workerPid: string;
}

interface BenchmarkOptions {
  url: string;
  totalRequests: number;
  concurrency: number;
}

function sendRequest(targetUrl: URL): Promise<RequestMetric> {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();

    const req = http.get(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || 80,
        path: targetUrl.pathname + targetUrl.search,
        agent: false,
        headers: {
          Connection: 'close',
          'User-Agent': 'LoadTest-Agent/1.0',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const end = process.hrtime.bigint();
          const durationMs = Number(end - start) / 1_000_000;
          const workerPid =
            (res.headers['x-worker-pid'] as string) ||
            (res.headers['x-cluster-worker'] as string) ||
            'unknown';

          resolve({
            statusCode: res.statusCode || 0,
            durationMs,
            workerPid,
          });
        });
      }
    );

    req.on('error', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      resolve({
        statusCode: 0,
        durationMs,
        workerPid: 'error',
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      resolve({
        statusCode: 504,
        durationMs,
        workerPid: 'timeout',
      });
    });
  });
}

async function runBenchmark(opts: BenchmarkOptions) {
  const targetUrl = new URL(opts.url);

  console.log('\n' + '='.repeat(68));
  console.log('       ZEILORAA BACKEND LOAD BALANCING & STRESS TEST');
  console.log('='.repeat(68));
  console.log(`Target Endpoint : ${opts.url}`);
  console.log(`Total Requests  : ${opts.totalRequests.toLocaleString()}`);
  console.log(`Concurrency     : ${opts.concurrency} concurrent worker streams`);
  console.log('='.repeat(68) + '\n');

  console.log('Starting execution of concurrent workload...');

  const metrics: RequestMetric[] = [];
  let completed = 0;
  let inFlight = 0;
  let nextIndex = 0;

  const testStartTime = process.hrtime.bigint();

  await new Promise<void>((resolve) => {
    function launchNext() {
      if (completed >= opts.totalRequests) {
        resolve();
        return;
      }

      while (inFlight < opts.concurrency && nextIndex < opts.totalRequests) {
        nextIndex++;
        inFlight++;

        sendRequest(targetUrl).then((metric) => {
          metrics.push(metric);
          completed++;
          inFlight--;

          // Progress tracker every 25% or 100 requests
          if (completed % 250 === 0 || completed === opts.totalRequests) {
            const pct = Math.round((completed / opts.totalRequests) * 100);
            process.stdout.write(` Progress: ${completed}/${opts.totalRequests} (${pct}% completed)\r`);
          }

          launchNext();
        });
      }
    }

    launchNext();
  });

  const testEndTime = process.hrtime.bigint();
  const totalDurationSec = Number(testEndTime - testStartTime) / 1_000_000_000;
  const rps = metrics.length / totalDurationSec;

  // Latency metrics calculations
  const durations = metrics.map((m) => m.durationMs).sort((a, b) => a - b);
  const minLatency = durations[0] || 0;
  const maxLatency = durations[durations.length - 1] || 0;
  const sumLatency = durations.reduce((acc, v) => acc + v, 0);
  const avgLatency = durations.length > 0 ? sumLatency / durations.length : 0;

  const getPercentile = (p: number) => {
    const idx = Math.floor((p / 100) * durations.length);
    return durations[Math.min(idx, durations.length - 1)] || 0;
  };

  const p50 = getPercentile(50);
  const p90 = getPercentile(90);
  const p95 = getPercentile(95);
  const p99 = getPercentile(99);

  // Status Codes
  const statusCounts: Record<number, number> = {};
  for (const m of metrics) {
    statusCounts[m.statusCode] = (statusCounts[m.statusCode] || 0) + 1;
  }

  // Worker Balance Distribution
  const workerCounts: Record<string, number> = {};
  for (const m of metrics) {
    workerCounts[m.workerPid] = (workerCounts[m.workerPid] || 0) + 1;
  }

  console.log('\n\n' + '='.repeat(68));
  console.log('                      BENCHMARK RESULTS');
  console.log('='.repeat(68));
  console.log(`Total Time Elapsed : ${totalDurationSec.toFixed(2)} seconds`);
  console.log(`Throughput         : ${rps.toFixed(2)} requests/sec (RPS)`);
  console.log(`Success Rate (200) : ${statusCounts[200] || 0} / ${metrics.length} (${Math.round(((statusCounts[200] || 0) / metrics.length) * 100)}%)`);

  console.log('\n--- Latency Percentiles (Response Times) ---');
  console.log(`  Min (fastest)    : ${minLatency.toFixed(2)} ms`);
  console.log(`  Average (mean)   : ${avgLatency.toFixed(2)} ms`);
  console.log(`  P50 (Median)     : ${p50.toFixed(2)} ms`);
  console.log(`  P90              : ${p90.toFixed(2)} ms`);
  console.log(`  P95              : ${p95.toFixed(2)} ms`);
  console.log(`  P99              : ${p99.toFixed(2)} ms`);
  console.log(`  Max (peak)       : ${maxLatency.toFixed(2)} ms`);

  console.log('\n--- Load Balancing Distribution Across Cluster Workers ---');
  console.log('┌──────────────────────┬────────────────┬──────────────┐');
  console.log('│ Worker Identifier    │ Requests Handled│ Share (%)   │');
  console.log('├──────────────────────┼────────────────┼──────────────┤');

  const workerKeys = Object.keys(workerCounts).sort();
  for (const w of workerKeys) {
    const count = workerCounts[w];
    const pct = ((count / metrics.length) * 100).toFixed(1);
    const workerLabel = (w.startsWith('worker-') ? w : `PID: ${w}`).padEnd(20, ' ');
    const countLabel = count.toString().padStart(14, ' ');
    const pctLabel = `${pct}%`.padStart(11, ' ');
    console.log(`│ ${workerLabel} │ ${countLabel} │ ${pctLabel}  │`);
  }
  console.log('└──────────────────────┴────────────────┴──────────────┘');

  if (workerKeys.length > 1) {
    console.log(`\n✓ Traffic successfully load-balanced across ${workerKeys.length} active worker processes!`);
  } else {
    console.log(`\n⚠ Traffic served by a single worker (${workerKeys[0]}).`);
  }
  console.log('='.repeat(68) + '\n');
}

// Execution parameters (command line override or defaults: 1000 requests, 50 concurrency)
const targetUrl = process.env.TARGET_URL || 'http://127.0.0.1:5000/api/products';
const totalReqs = process.env.TOTAL_REQUESTS ? parseInt(process.env.TOTAL_REQUESTS, 10) : 1000;
const concurrency = process.env.CONCURRENCY ? parseInt(process.env.CONCURRENCY, 10) : 50;

runBenchmark({
  url: targetUrl,
  totalRequests: totalReqs,
  concurrency,
}).catch(console.error);
