import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "src/utils/redirectHelpers";

export async function GET(request: Request) {
  const draft = await draftMode();
  const { searchParams } = new URL(request.url);

  draft.disable();

  redirect(getSafeRedirectPath(searchParams.get("redirect")));
}
