import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  isRefreshContentAuthorized,
  parseDeployTarget,
  resolveDeployHookMetadata,
} from "src/lib/refreshContentAccess";
import { fetchDeploymentStatus } from "src/lib/vercelDeploymentStatus";

const parseSince = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const since = Number(value);

  if (!Number.isFinite(since) || since <= 0) {
    return null;
  }

  return since;
};

const parseOptionalTimestamp = (value: string | null): number | undefined => {
  const parsed = parseSince(value);

  return parsed ?? undefined;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") ?? undefined;
    const target = parseDeployTarget(searchParams.get("target"));
    const since = parseSince(searchParams.get("since"));
    const jobCreatedAt = parseOptionalTimestamp(
      searchParams.get("jobCreatedAt"),
    );
    const deployHookId = searchParams.get("deployHookId")?.trim();
    const projectId = searchParams.get("projectId")?.trim();

    if (!isRefreshContentAuthorized(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!target) {
      return NextResponse.json(
        { error: "Invalid deploy target" },
        { status: 400 },
      );
    }

    if (since === null) {
      return NextResponse.json(
        { error: "Invalid since timestamp" },
        { status: 400 },
      );
    }

    const hookMetadata =
      projectId && deployHookId
        ? { deployHookId, projectId }
        : resolveDeployHookMetadata(target);

    if (!hookMetadata) {
      return NextResponse.json(
        { error: "Deploy hook not configured" },
        { status: 503 },
      );
    }

    const result = await fetchDeploymentStatus({
      deployHookId: hookMetadata.deployHookId,
      jobCreatedAt,
      projectId: hookMetadata.projectId,
      since,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch deploy status" },
      { status: 500 },
    );
  }
}
