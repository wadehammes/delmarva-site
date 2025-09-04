import { FetchMethods, fetchOptions } from "src/api/helpers";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import type { RequestAQuoteInputs } from "src/components/RequestAQuoteForm/RequestAQuoteForm.component";

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
  requestAQuote: ({
    companyName,
    email,
    name,
    phone,
    projectDetails,
  }: RequestAQuoteInputs) =>
    fetch(
      "/api/resend/request-a-quote",
      fetchOptions({
        body: JSON.stringify({
          companyName,
          email,
          name,
          phone,
          projectDetails,
        }),
        method: FetchMethods.Post,
      }),
    ),
};
