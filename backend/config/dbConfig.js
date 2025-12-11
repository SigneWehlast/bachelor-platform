import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// __dirname i ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, "../.env") });

export const platformDb = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

export const clientDb = {
  host: process.env.CLIENT_DB_HOST,
  port: process.env.CLIENT_DB_PORT,
  user: process.env.CLIENT_DB_USER,
  password: process.env.CLIENT_DB_PASSWORD,
  database: process.env.CLIENT_DB_NAME
};
