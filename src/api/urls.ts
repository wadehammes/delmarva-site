import { FetchMethods, fetchOptions } from "src/api/helpers";
import type { GeneralInquiryInputs } from "src/components/GeneralInquiryForm/GeneralInquiryForm.component";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import type { RequestAProposalInputs } from "src/components/RequestAProposalForm/RequestAProposalForm.component";

function buildJoinOurTeamFormData(data: JoinOurTeamInputs): FormData {
  const form = new FormData();
  form.append("address", data.address);
  form.append("briefDescription", data.briefDescription);
  form.append("city", data.city);
  form.append("email", data.email);
  form.append("name", data.name);
  form.append("phone", data.phone);
  form.append("position", data.position);
  form.append("recaptchaToken", data.recaptchaToken);
  form.append("state", data.state);
  form.append("workEligibility", String(data.workEligibility));
  form.append("zipCode", data.zipCode);
  if (data.website !== undefined) form.append("website", data.website);
  if (data.emailsToSendNotification?.length)
    form.append(
      "emailsToSendNotification",
      JSON.stringify(data.emailsToSendNotification),
    );
  if (data.resume instanceof File) form.append("resume", data.resume);
  if (data.coverLetter instanceof File)
    form.append("coverLetter", data.coverLetter);
  return form;
}

export const api = {
  generalInquiry: ({
    email,
    emailsToBcc,
    emailsToSendNotification,
    message,
    name,
    phone,
    recaptchaToken,
    website,
  }: GeneralInquiryInputs) =>
    fetch(
      "/api/resend/general-inquiry",
      fetchOptions({
        body: JSON.stringify({
          email,
          emailsToBcc,
          emailsToSendNotification,
          message,
          name,
          phone,
          recaptchaToken,
          website,
        }),
        method: FetchMethods.Post,
      }),
    ),
  joinOurTeam: (data: JoinOurTeamInputs) => {
    const hasFiles =
      data.resume instanceof File || data.coverLetter instanceof File;
    if (hasFiles) {
      const body = buildJoinOurTeamFormData(data);
      return fetch("/api/resend/join-our-team", {
        body,
        headers: { Accept: "application/json" },
        method: FetchMethods.Post,
      });
    }
    return fetch(
      "/api/resend/join-our-team",
      fetchOptions({
        body: JSON.stringify({
          address: data.address,
          briefDescription: data.briefDescription,
          city: data.city,
          coverLetter: data.coverLetter,
          email: data.email,
          emailsToSendNotification: data.emailsToSendNotification,
          name: data.name,
          phone: data.phone,
          position: data.position,
          recaptchaToken: data.recaptchaToken,
          resume: data.resume,
          state: data.state,
          website: data.website,
          workEligibility: data.workEligibility,
          zipCode: data.zipCode,
        }),
        method: FetchMethods.Post,
      }),
    );
  },
  requestAProposal: ({
    companyName,
    email,
    emailsToBcc,
    emailsToSendNotification,
    name,
    phone,
    projectDetails,
    recaptchaToken,
    website,
  }: RequestAProposalInputs) =>
    fetch(
      "/api/resend/request-a-proposal",
      fetchOptions({
        body: JSON.stringify({
          companyName,
          email,
          emailsToBcc,
          emailsToSendNotification,
          name,
          phone,
          projectDetails,
          recaptchaToken,
          website,
        }),
        method: FetchMethods.Post,
      }),
    ),
};
