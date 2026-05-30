import {
  assertFormApiOk,
  FetchMethods,
  fetchOptions,
  isNetworkFetchError,
} from "src/api/helpers";
import type { GeneralInquiryInputs } from "src/components/GeneralInquiryForm/GeneralInquiryForm.component";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import type { RequestAProposalInputs } from "src/components/RequestAProposalForm/RequestAProposalForm.component";

const JOIN_OUR_TEAM_PATH = "/api/forms/careers-application";

const buildJoinOurTeamFormData = (data: JoinOurTeamInputs): FormData => {
  const form = new FormData();
  form.append("address", data.address);
  form.append("briefDescription", data.briefDescription);
  form.append("city", data.city);
  form.append("email", data.email);
  if (data.locale) {
    form.append("locale", data.locale);
  }
  form.append("name", data.name);
  form.append("phone", data.phone);
  form.append("position", data.position);
  form.append("recaptchaToken", data.recaptchaToken);
  form.append("state", data.state);
  form.append("workEligibility", String(data.workEligibility));
  form.append("zipCode", data.zipCode);
  if (data.website !== undefined) {
    form.append("website", data.website);
  }
  if (data.emailsToSendNotification?.length) {
    form.append(
      "emailsToSendNotification",
      JSON.stringify(data.emailsToSendNotification),
    );
  }
  if (data.resume instanceof File) {
    form.append("resume", data.resume);
  }
  if (data.coverLetter instanceof File) {
    form.append("coverLetter", data.coverLetter);
  }
  return form;
};

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
      "/api/forms/general-inquiry",
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
  joinOurTeam: async (data: JoinOurTeamInputs) => {
    const fallbackMessage = "Failed to submit application. Please try again.";
    const hasFiles =
      data.resume instanceof File || data.coverLetter instanceof File;

    try {
      const response = hasFiles
        ? await fetch(JOIN_OUR_TEAM_PATH, {
            body: buildJoinOurTeamFormData(data),
            headers: { Accept: "application/json" },
            method: FetchMethods.Post,
          })
        : await fetch(
            JOIN_OUR_TEAM_PATH,
            fetchOptions({
              body: JSON.stringify({
                address: data.address,
                briefDescription: data.briefDescription,
                city: data.city,
                email: data.email,
                emailsToSendNotification: data.emailsToSendNotification,
                locale: data.locale,
                name: data.name,
                phone: data.phone,
                position: data.position,
                recaptchaToken: data.recaptchaToken,
                state: data.state,
                website: data.website,
                workEligibility: data.workEligibility,
                zipCode: data.zipCode,
              }),
              method: FetchMethods.Post,
            }),
          );

      return await assertFormApiOk(response, fallbackMessage);
    } catch (error) {
      if (isNetworkFetchError(error)) {
        throw new Error(
          "Could not reach the server. Confirm the site is available and try again.",
        );
      }
      throw error;
    }
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
      "/api/forms/request-a-proposal",
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
