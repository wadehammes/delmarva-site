import type { ComponentProps } from "react";
import { joinOurTeamConfirmationPreviewPropsEs } from "./emailPreviewProps";
import JoinOurTeamConfirmationTemplate from "./JoinOurTeamConfirmationTemplate";

type JoinOurTeamConfirmationTemplateProps = ComponentProps<
  typeof JoinOurTeamConfirmationTemplate
>;

/** Spanish locale entry for React Email dev (sidebar: …ConfirmationTemplateEs). */
function JoinOurTeamConfirmationTemplateEs(
  props: JoinOurTeamConfirmationTemplateProps,
) {
  return <JoinOurTeamConfirmationTemplate {...props} />;
}

JoinOurTeamConfirmationTemplateEs.PreviewProps =
  joinOurTeamConfirmationPreviewPropsEs;

export default JoinOurTeamConfirmationTemplateEs;
