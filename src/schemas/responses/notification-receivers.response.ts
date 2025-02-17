import { z } from "zod";

export const NotificationReceiversResBodySchema = z
  .object({
    recipients: z.array(z.string().email()),
  })
  .openapi("NotificationReceiversResBody");

export type NotificationReceiversResBody = z.infer<
  typeof NotificationReceiversResBodySchema
>;
