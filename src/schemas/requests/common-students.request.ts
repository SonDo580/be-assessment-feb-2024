import { z } from "zod";

export const CommonStudentsReqQuerySchema = z.object({
  teacher: z
    .union([z.string().email(), z.array(z.string().email()).min(1)]) // Accepts string OR array
    .transform((teacher) => 
      Array.isArray(teacher) ? Array.from(new Set(teacher)) : [teacher]
    ), // Convert single string to array & remove duplicates
});

export type CommonStudentsReqQuery = z.infer<
  typeof CommonStudentsReqQuerySchema
>;
