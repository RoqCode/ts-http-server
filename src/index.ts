import express from "express";
import { handlerReadiness } from "./lib/handler/readiness.js";
import { logResponses } from "./lib/middleware/logResponses.js";
import { requestMetrics } from "./lib/middleware/metrics.js";
import { handlerMetrics } from "./lib/handler/metrics.js";
import { handlerReset } from "./lib/handler/reset.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(logResponses);

app.use("/app", requestMetrics, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerMetrics);

app.post("/admin/reset", handlerReset);
