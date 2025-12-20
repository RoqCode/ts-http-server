import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { apiConfig } from "../lib/config.js";

const conn = postgres(apiConfig.dbUrl);
export const db = drizzle(conn, { schema });
