import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const draft = await draftMode();
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get("secret");

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  const redirectPath = searchParams.get("path") ?? "";
  const path = `/${redirectPath}`.replace(/\/+/g, "/");

  draft.enable();

  const redirectUrl = new URL(path, request.url);

  return NextResponse.redirect(redirectUrl, 307);
}
