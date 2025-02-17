import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { GENERAL_CONFIG } from "../config";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = GENERAL_CONFIG;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/database/migrations/**/*.ts"],
  namingStrategy: new SnakeNamingStrategy(),
});
