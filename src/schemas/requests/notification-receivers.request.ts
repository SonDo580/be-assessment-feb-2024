import { z } from "zod";

export const NotificationReceiverReqBodySchema = z
  .object({
    teacher: z.string().email(),
    notification: z.string(),
  })
  .openapi("NotificationReceiverReqBody");

export type NotificationReceiverReqBody = z.infer<
  typeof NotificationReceiverReqBodySchema
>;
