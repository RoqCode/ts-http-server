import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
  jwtSecret: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: process.env.DB_URL as string,
    migrationConfig: {
      migrationsFolder: "src/db/out",
    },
  },
  jwtSecret: process.env.JWT_SECRET as string,
};
