import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  isRefreshContentAuthorized,
  resolveDeployProjectId,
} from "src/lib/refreshContentAccess";
import { fetchAverageBuildTime } from "src/lib/vercelDeploymentStatus";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") ?? undefined;
    if (!isRefreshContentAuthorized(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = resolveDeployProjectId();

    if (!projectId) {
      return NextResponse.json(
        { error: "Deploy hook not configured" },
        { status: 503 },
      );
    }

    const result = await fetchAverageBuildTime({ projectId });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch deploy build stats" },
      { status: 500 },
    );
  }
}
