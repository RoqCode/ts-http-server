import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { handlerError } from "./lib/handler/error.js";
import { handlerMetrics } from "./lib/handler/metrics.js";
import { handlerReadiness } from "./lib/handler/readiness.js";
import { handlerReset } from "./lib/handler/reset.js";
import { handlerValidateChirp } from "./lib/handler/validateChirp.js";
import { logResponses } from "./lib/middleware/logResponses.js";
import { requestMetrics } from "./lib/middleware/metrics.js";
import { config } from "./lib/config.js";
import { handlerUsers } from "./lib/handler/user.js";

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

app.post("/api/validate_chirp", express.json(), handlerValidateChirp);

app.post("/api/users", express.json(), (req, res, next) => {
  handlerUsers(req, res).catch(next);
});

// this needs to be last
app.use(handlerError);
