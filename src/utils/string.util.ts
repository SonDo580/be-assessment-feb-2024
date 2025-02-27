import { z } from "zod";

export class StringUtil {
  /* Extract emails from a notification */
  public static extractEmailsFromNotification(notification: string): string[] {
    const emailSchema = z.string().email();

    return notification
      .split(/\s+/)
      .filter((word) => word[0] === "@")
      .map((word) => word.slice(1))
      .filter((word) => emailSchema.safeParse(word).success);
  }
}
