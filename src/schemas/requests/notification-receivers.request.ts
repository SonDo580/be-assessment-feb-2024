import { z } from "zod";

export const NotificationReceiverReqBodySchema = z.object({
  teacher: z.string().email(),
  notification: z.string()
});

export type NotificationReceiverReqBody = z.infer<
  typeof NotificationReceiverReqBodySchema
>;
