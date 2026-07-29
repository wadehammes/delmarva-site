import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "src/utils/redirectHelpers";

export async function GET(request: Request) {
  const draft = await draftMode();
  const { searchParams } = new URL(request.url);

  if (
    searchParams.get("previewSecret") !== process.env.CONTENTFUL_PREVIEW_SECRET
  ) {
    return new Response("Invalid token", { status: 401 });
  }

  draft.enable();

  redirect(getSafeRedirectPath(searchParams.get("redirect")));
}
