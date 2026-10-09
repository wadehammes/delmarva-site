import { beforeEach, describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "src/tests/testUtils";
import { JoinOurTeamFormPO } from "./JoinOurTeamForm.po";

describe("JoinOurTeamForm", () => {
  let po: JoinOurTeamFormPO;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    po = new JoinOurTeamFormPO();
    po.setupMocks();
    user = userEvent.setup();
  });

  it("renders required fields", () => {
    po.render();

    expect(screen.getByLabelText("labels.fullName")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.email")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.position")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.resume")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "messages.submit" }),
    ).toBeInTheDocument();
  });

  it("submits with formId, position, and resume", async () => {
    const formId = "contentful-join-form-id";
    const jobTitle = "Project Engineer";
    po.render({ id: formId, openJobs: [jobTitle] });

    await user.type(screen.getByLabelText("labels.fullName"), "Alex Applicant");
    await user.type(screen.getByLabelText("labels.email"), "alex@example.com");

    await user.click(screen.getByText("labels.workEligibility"));

    await user.click(
      screen.getByRole("combobox", { name: "labels.position *" }),
    );
    await user.click(await screen.findByRole("option", { name: jobTitle }));

    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    await user.upload(screen.getByLabelText("labels.resume"), resume);

    await user.click(screen.getByRole("button", { name: "messages.submit" }));

    await waitFor(() => {
      expect(po.mockJoinOurTeam).toHaveBeenCalledTimes(1);
      expect(po.mockJoinOurTeam.mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({
          email: "alex@example.com",
          formId,
          name: "Alex Applicant",
          position: jobTitle,
          recaptchaToken: "mock-captcha-token",
          resume,
        }),
      );
    });
  });
});
