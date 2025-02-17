import { z } from "zod";

export const CommonStudentsResBodySchema = z
  .object({
    students: z.array(z.string().email()),
  })
  .openapi("CommonStudentsResBody");

export type CommonStudentsResBody = z.infer<typeof CommonStudentsResBodySchema>;
