import { StringUtil } from "@/utils/string.util";

describe("String utilities", () => {
  describe("extractEmailsFromText", () => {
    const extractEmailsFromNotification =
      StringUtil.extractEmailsFromNotification;

    test("return valid emails and ignore invalid emails", () => {
      const text =
        "@valid@x.com @invalid-email @invalid@com @valid@y.com";

      expect(extractEmailsFromNotification(text)).toEqual([
        "valid@x.com",
        "valid@y.com",
      ]);
    });

    test("returns empty array if no emails are found", () => {
      const text = "Normal text without any mention.";
      expect(extractEmailsFromNotification(text)).toEqual([]);
    });
  });
});
