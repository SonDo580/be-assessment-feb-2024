import { z } from "zod";

export const CommonStudentsResBodySchema = z.object({
  students: z.array(z.string().email()),
});

export type CommonStudentsResBody = z.infer<typeof CommonStudentsResBodySchema>;
