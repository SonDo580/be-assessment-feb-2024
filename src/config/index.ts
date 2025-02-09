import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // Common
  PORT: z
    .string()
    .min(1)
    .transform(Number)
    .refine((value) => Number.isInteger(value) && value > 0),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z
    .string()
    .min(1)
    .transform(Number)
    .refine((value) => Number.isInteger(value) && value > 0),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
});

const {
  PORT,

  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = envSchema.parse(process.env);

export const GENERAL_CONFIG = {
  PORT,

  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
};
