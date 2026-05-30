jest.mock("react-email", () => ({
  render: jest.fn(),
}));

import { render } from "react-email";
import { renderConfirmationEmail } from "./emailRenderer";
import { getJoinOurTeamConfirmationCopy } from "./emailTranslations";

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
    });
  });
});
