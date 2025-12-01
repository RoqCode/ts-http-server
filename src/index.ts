import express from "express";
import { handlerReadiness } from "./lib/handler/readiness.js";
import { logResponses } from "./lib/middleware/logResponses.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(logResponses);

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);
