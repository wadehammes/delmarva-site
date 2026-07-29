import { beforeEach, describe, expect, it } from "@jest/globals";
import { fetchFormRecipients } from "src/contentful/getFormEntry";
import { resolveFormNotificationRecipients } from "src/lib/formNotificationRecipients";
import { formFactory } from "src/tests/factories/Form.factory";

jest.mock("src/contentful/getFormEntry", () => ({
  fetchFormRecipients: jest.fn(),
}));

jest.mock("src/utils/emailHelpers", () => ({
  getNotificationTo: jest.fn((to: string | string[]) => to),
}));

describe("resolveFormNotificationRecipients", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses Contentful recipients when formId is provided", async () => {
    const form = formFactory.build({ id: "form-123" });
    jest.mocked(fetchFormRecipients).mockResolvedValue({
      emailsToBcc: form.emailsToBcc,
      emailsToSendNotification: form.emailsToSendNotification,
    });

    const result = await resolveFormNotificationRecipients({
      fallbackTo: "fallback@example.com",
      formId: form.id,
    });

    expect(fetchFormRecipients).toHaveBeenCalledWith(form.id);
    expect(result).toEqual({
      bcc: form.emailsToBcc,
      to: form.emailsToSendNotification,
    });
  });

  it("falls back when Contentful returns no valid emails", async () => {
    jest.mocked(fetchFormRecipients).mockResolvedValue({
      emailsToSendNotification: ["not-an-email"],
    });

    const result = await resolveFormNotificationRecipients({
      fallbackTo: "fallback@example.com",
      formId: "form-123",
    });

    expect(result).toEqual({
      bcc: undefined,
      to: ["fallback@example.com"],
    });
  });
});
