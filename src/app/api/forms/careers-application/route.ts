import { submitCareersApplication } from "src/lib/submitCareersApplication";
import { formRouteJsonError } from "src/utils/formRoute.helpers";
import { parseJoinOurTeamRequest } from "src/utils/joinOurTeamForm.server.helpers";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const inputs = await parseJoinOurTeamRequest(request);
    const result = await submitCareersApplication(inputs);

    if (!result.ok) {
      return formRouteJsonError(result.message, 502, "join_our_team_error");
    }

    return Response.json({
      id: result.id,
      message: "success",
    });
  } catch (error) {
    console.error("Join Our Team form error:", error);

    return formRouteJsonError(
      error instanceof Error ? error.message : "Unknown error sending email",
      500,
      "join_our_team_error",
      error,
    );
  }
}
