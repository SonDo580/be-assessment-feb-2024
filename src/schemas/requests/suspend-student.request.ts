import { z } from "zod";

export const SuspendStudentReqBodySchema = z
  .object({
    student: z.string().email(),
  })
  .openapi("SuspendStudentReqBody");

export type SuspendStudentReqBody = z.infer<typeof SuspendStudentReqBodySchema>;
