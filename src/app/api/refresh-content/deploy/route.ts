import { NextResponse } from "next/server";
import {
  getDeployHookUrl,
  isRefreshContentAuthorized,
} from "src/lib/refreshContentAccess";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    target?: string;
    token?: string;
  };

  if (!isRefreshContentAuthorized(body.token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (body.target !== "staging" && body.target !== "production") {
    return NextResponse.json(
      { error: "Invalid deploy target" },
      { status: 400 },
    );
  }

  const deployHook = getDeployHookUrl(body.target);

  if (!deployHook) {
    return NextResponse.json(
      { error: "Deploy hook not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(deployHook, { method: "POST" });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Deploy hook request failed" },
      { status: response.status },
    );
  }

  return NextResponse.json({ ok: true });
}
