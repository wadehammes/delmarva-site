import { sendGAEvent } from "@next/third-parties/google";
import { trackEvent } from "src/lib/trackEvent";

jest.mock("@next/third-parties/google", () => ({
  sendGAEvent: jest.fn(),
}));

describe("trackEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("pushes a GA event to the data layer", () => {
    trackEvent("general-inquiry-form-submit");

    expect(sendGAEvent).toHaveBeenCalledWith(
      "event",
      "general-inquiry-form-submit",
    );
  });

  it("includes optional event params", () => {
    trackEvent("Changed Language", { label: "Español" });

    expect(sendGAEvent).toHaveBeenCalledWith("event", "Changed Language", {
      label: "Español",
    });
  });
});
