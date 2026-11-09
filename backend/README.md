# Zeyloraa Backend API & Multi-Worker Cluster

Express & TypeScript API backend with multi-process round-robin cluster load balancing, MongoDB Atlas persistence, and automated self-healing.

## Architecture

- **Primary / Master Process**: Listens on the port and handles worker lifecycle management.
- **Worker Pool**: 4 dedicated worker processes sharing port `5000` via `cluster.schedulingPolicy = cluster.SCHED_RR`.
- **Auto-Recovery**: Automatic respawning of terminated or unhealthy worker processes.
- **Diagnostic Headers**:
  - `X-Worker-PID`: Process ID of worker handling request.
  - `X-Cluster-Worker`: Human-readable worker identifier (e.g., `worker-1`).

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `cluster` | `npm run cluster` | Launches primary master and forks 4 round-robin workers |
| `loadtest` | `npm run loadtest` | Executes concurrent load balancing benchmark |
| `dev` | `npm run dev` | Runs single-instance server in development watch mode |
| `build` | `npm run build` | Compiles TypeScript to `dist/` |
| `start` | `npm run start` | Runs compiled production server |
| `seed:admin` | `npm run seed:admin` | Seeds initial Atelier Super Admin account |

---

## Benchmark & Load Balancing Results

### Test 1: Concurrency Benchmark (`/api/health`)
- **Requests**: 1,000 requests @ 50 concurrency
- **Throughput**: **982.88 RPS**
- **Success Rate**: **100% (1,000 / 1,000)**
- **Average Latency**: **49.70 ms** (P50: 43.31 ms)
- **Distribution**:
  - Worker #1 (PID 24048): **24.2%**
  - Worker #2 (PID 38316): **26.4%**
  - Worker #3 (PID 5504): **26.4%**
  - Worker #4 (PID 12556): **23.0%**

### Test 2: Database Benchmark (`/api/products`)
- **Requests**: 200 requests @ 15 concurrency
- **Throughput**: **34.16 RPS** (against remote cloud MongoDB Atlas)
- **Success Rate**: **100% (200 / 200)**
- **Median (P50) Latency**: **325.90 ms**
- **Distribution**:
  - Worker #1: **26.0%**
  - Worker #2: **24.0%**
  - Worker #3: **24.5%**
  - Worker #4: **25.5%**

---

## Load Test Options

Override options using environment variables:
```powershell
$env:TARGET_URL="http://127.0.0.1:5000/api/products"
$env:TOTAL_REQUESTS="500"
$env:CONCURRENCY="20"
npm run loadtest
```

