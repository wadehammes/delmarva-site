import { FetchMethods, fetchOptions } from "src/api/helpers";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";

export const api = {
  joinOurTeam: ({
    email,
    name,
    phone,
    briefDescription,
    workEligibility,
    address,
    city,
    state,
    zipCode,
    coverLetter,
    resume,
    position,
  }: JoinOurTeamInputs) =>
    fetch(
      "/api/resend/join-our-team",
      fetchOptions({
        body: JSON.stringify({
          address,
          briefDescription,
          city,
          coverLetter,
          email,
          name,
          phone,
          position,
          resume,
          state,
          workEligibility,
          zipCode,
        }),
        method: FetchMethods.Post,
      }),
    ),
};
