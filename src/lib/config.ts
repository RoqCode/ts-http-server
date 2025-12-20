process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  dbUrl: string;
};

export const apiConfig: APIConfig = {
  fileserverHits: 0,
  dbUrl: process.env.DB_URL as string,
};
