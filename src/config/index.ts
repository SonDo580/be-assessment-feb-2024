import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .min(1)
    .transform(Number)
    .refine((value) => Number.isInteger(value) && value > 0),
});

const { PORT } = envSchema.parse(process.env);

export const GENERAL_CONFIG = {
  PORT,
};
