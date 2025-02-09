import { z } from "zod";

export const RegisterStudentsReqBodySchema = z.object({
  teacher: z.string().email(),
  students: z
    .array(z.string().email())
    .min(1)
    .transform((students) => Array.from(new Set(students))), // Remove duplicates
});

export type RegisterStudentsReqBody = z.infer<
  typeof RegisterStudentsReqBodySchema
>;
