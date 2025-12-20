import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
};

export const apiConfig: APIConfig = {
  fileserverHits: 0,
  db: {
    url: process.env.DB_URL as string,
    migrationConfig: {
      migrationsFolder: "src/db/out",
    },
  },
};
