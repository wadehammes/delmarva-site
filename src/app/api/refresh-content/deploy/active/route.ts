import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  isRefreshContentAuthorized,
  parseDeployTarget,
  resolveDeployHookMetadata,
} from "src/lib/refreshContentAccess";
import { fetchActiveDeployProgress } from "src/lib/vercelDeploymentStatus";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") ?? undefined;
    const target = parseDeployTarget(searchParams.get("target"));

    if (!isRefreshContentAuthorized(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!target) {
      return NextResponse.json(
        { error: "Invalid deploy target" },
        { status: 400 },
      );
    }

    const hookMetadata = resolveDeployHookMetadata(target);

    if (!hookMetadata) {
      return NextResponse.json(
        { error: "Deploy hook not configured" },
        { status: 503 },
      );
    }

    const result = await fetchActiveDeployProgress({
      deployHookId: hookMetadata.deployHookId,
      projectId: hookMetadata.projectId,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch active deploy" },
      { status: 500 },
    );
  }
}
