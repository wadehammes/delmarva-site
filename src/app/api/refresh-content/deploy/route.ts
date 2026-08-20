import { NextResponse } from "next/server";
import {
  getDeployHookUrl,
  isRefreshContentAuthorized,
  parseDeployHookUrl,
  parseDeployTarget,
} from "src/lib/refreshContentAccess";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      target?: string;
      token?: string;
    };

    if (!isRefreshContentAuthorized(body.token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const target = parseDeployTarget(body.target);

    if (!target) {
      return NextResponse.json(
        { error: "Invalid deploy target" },
        { status: 400 },
      );
    }

    const deployHook = getDeployHookUrl(target);

    if (!deployHook) {
      return NextResponse.json(
        { error: "Deploy hook not configured" },
        { status: 503 },
      );
    }

    const hookMetadata = parseDeployHookUrl(deployHook);

    if (!hookMetadata) {
      return NextResponse.json(
        { error: "Deploy hook URL is invalid" },
        { status: 503 },
      );
    }

    const response = await fetch(deployHook, { method: "POST" });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Deploy hook request failed" },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as {
      job?: {
        createdAt?: number;
      };
    };

    const createdAt = payload.job?.createdAt ?? Date.now();

    return NextResponse.json({
      createdAt,
      deployHookId: hookMetadata.deployHookId,
      ok: true,
      projectId: hookMetadata.projectId,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to trigger deploy" },
      { status: 500 },
    );
  }
}
