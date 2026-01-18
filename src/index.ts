import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { config } from "./lib/config.js";
import {
  handlerChirp,
  handlerChirps,
  handlerChirpsBatch,
} from "./lib/handler/chirps.js";
import { handlerError } from "./lib/handler/error.js";
import { handlerLogin } from "./lib/handler/login.js";
import { handlerMetrics } from "./lib/handler/metrics.js";
import { handlerReadiness } from "./lib/handler/readiness.js";
import { handlerRefresh } from "./lib/handler/refresh.js";
import { handlerReset } from "./lib/handler/reset.js";
import { handlerRevoke } from "./lib/handler/revoke.js";
import { handlerUsers } from "./lib/handler/user.js";
import { logResponses } from "./lib/middleware/logResponses.js";
import { requestMetrics } from "./lib/middleware/metrics.js";
import { requireAuth } from "./lib/middleware/requireAuth.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(logResponses);

app.use("/app", requestMetrics, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerMetrics);

app.post("/admin/reset", (req, res, next) => {
  handlerReset(req, res).catch(next);
});

app.post("/api/users", express.json(), (req, res, next) => {
  handlerUsers(req, res).catch(next);
});

app.post("/api/login", express.json(), (req, res, next) => {
  handlerLogin(req, res).catch(next);
});

app.post("/api/chirps", express.json(), requireAuth, (req, res, next) => {
  handlerChirps(req, res).catch(next);
});

app.get("/api/chirps", express.json(), requireAuth, (req, res, next) => {
  handlerChirpsBatch(req, res).catch(next);
});

app.get(
  "/api/chirps/:chirpId",
  express.json(),
  requireAuth,
  (req, res, next) => {
    handlerChirp(req, res).catch(next);
  },
);

app.post("/api/refresh", express.json(), (req, res, next) => {
  handlerRefresh(req, res).catch(next);
});

app.post("/api/revoke", express.json(), (req, res, next) => {
  handlerRevoke(req, res).catch(next);
});

// this needs to be last
app.use(handlerError);
