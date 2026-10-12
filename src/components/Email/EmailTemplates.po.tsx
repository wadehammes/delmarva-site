jest.mock("react-email", () => require("src/tests/mocks/reactEmail.mock"));

import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "src/tests/testUtils";
import {
  generalInquiryNotificationPreviewProps,
  joinOurTeamConfirmationPreviewProps,
  joinOurTeamConfirmationPreviewPropsEs,
  joinOurTeamNotificationPreviewProps,
  requestAProposalNotificationPreviewProps,
} from "./emailPreviewProps";
import { GeneralInquiryNotificationTemplate } from "./GeneralInquiryNotificationTemplate";
import { JoinOurTeamConfirmationTemplate } from "./JoinOurTeamConfirmationTemplate";
import { JoinOurTeamNotificationTemplate } from "./JoinOurTeamNotificationTemplate";
import { RequestAProposalNotificationTemplate } from "./RequestAProposalNotificationTemplate";

type JoinOurTeamConfirmationProps = ComponentProps<
  typeof JoinOurTeamConfirmationTemplate
>;
type JoinOurTeamNotificationProps = ComponentProps<
  typeof JoinOurTeamNotificationTemplate
>;
type GeneralInquiryNotificationProps = ComponentProps<
  typeof GeneralInquiryNotificationTemplate
>;
type RequestAProposalNotificationProps = ComponentProps<
  typeof RequestAProposalNotificationTemplate
>;

const normalizeWhitespace = (value: string) =>
  value.replace(/\s+/g, " ").trim();

export class EmailTemplatesPO extends BasePageObject {
  documentText(): string {
    return normalizeWhitespace(document.body.textContent ?? "");
  }

  renderJoinOurTeamConfirmation(
    props: JoinOurTeamConfirmationProps = joinOurTeamConfirmationPreviewProps,
  ) {
    return render(<JoinOurTeamConfirmationTemplate {...props} />);
  }

  renderJoinOurTeamConfirmationEs() {
    return this.renderJoinOurTeamConfirmation(
      joinOurTeamConfirmationPreviewPropsEs,
    );
  }

  renderJoinOurTeamNotification(
    props: JoinOurTeamNotificationProps = joinOurTeamNotificationPreviewProps,
  ) {
    return render(<JoinOurTeamNotificationTemplate {...props} />);
  }

  renderGeneralInquiryNotification(
    props: GeneralInquiryNotificationProps = generalInquiryNotificationPreviewProps,
  ) {
    return render(<GeneralInquiryNotificationTemplate {...props} />);
  }

  renderRequestAProposalNotification(
    props: RequestAProposalNotificationProps = requestAProposalNotificationPreviewProps,
  ) {
    return render(<RequestAProposalNotificationTemplate {...props} />);
  }

  joinOurTeamConfirmationIntroText(): string {
    const intro = screen.getByText(
      /Thanks for applying for the|Gracias por postularte al puesto de/,
    );
    return normalizeWhitespace(intro.textContent ?? "");
  }
}
