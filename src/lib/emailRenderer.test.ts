import { beforeEach, describe, expect, it } from "@jest/globals";
import { render } from "react-email";
import { renderConfirmationEmail } from "./emailRenderer";
import { getJoinOurTeamConfirmationCopy } from "./emailTranslations";

jest.mock("react-email", () => ({
  render: jest.fn(),
}));

const mockRender = render as jest.MockedFunction<typeof render>;

const sample = {
  name: "María López",
  position: "Project Manager",
};

describe("emailRenderer", () => {
  beforeEach(() => {
    mockRender.mockImplementation(async (_template, options) => {
      if (options?.plainText) {
        return "plain-text-body";
      }
      return "<html>email-body</html>";
    });
  });

  describe("renderConfirmationEmail", () => {
    it("returns localized subject and html/text from react-email", async () => {
      const result = await renderConfirmationEmail({
        locale: "es",
        ...sample,
      });

      expect(result.subject).toBe(
        getJoinOurTeamConfirmationCopy("es", sample).subject,
      );
      expect(result.html).toBe("<html>email-body</html>");
      expect(result.text).toBe("plain-text-body");
      expect(mockRender).toHaveBeenCalledTimes(2);
      expect(mockRender).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ plainText: true }),
      );
    });

    it("uses English subject for en locale", async () => {
      const result = await renderConfirmationEmail({
        locale: "en",
        ...sample,
      });

      expect(result.subject).toBe("Application Received for Project Manager");
    });

    it("defaults to English subject when locale is invalid", async () => {
      const result = await renderConfirmationEmail({
        locale: "invalid",
        ...sample,
      });

      expect(result.subject).toBe("Application Received for Project Manager");
    });
  });
});
