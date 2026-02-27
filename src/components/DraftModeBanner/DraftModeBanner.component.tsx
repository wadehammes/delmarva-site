import { draftMode } from "next/headers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";

export const DraftModeBanner = async () => {
  const draft = await draftMode();

  if (!draft.isEnabled) {
    return null;
  }

  return (
    <div className="draftMode">
      You are previewing in draft mode!{" "}
      <ExitDraftModeLink style={{ textDecoration: "underline" }} />
    </div>
  );
};
