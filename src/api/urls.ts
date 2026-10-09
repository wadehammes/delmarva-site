import type {
  DeployActiveInput,
  DeployActiveResponse,
  DeployBuildStatsInput,
  DeployBuildStatsResponse,
  DeployStatusInput,
  DeployStatusResponse,
  DeployTriggerInput,
  DeployTriggerResponse,
} from "src/api/deploy.types";
import { FetchMethods, fetchJsonResponse, fetchOptions } from "src/api/helpers";
import type { GeneralInquiryApiInput } from "src/lib/forms/generalInquiryForm.schema";
import type { JoinOurTeamClientSubmit } from "src/lib/forms/joinOurTeamForm.schema";
import {
  buildJoinOurTeamFormData,
  buildJoinOurTeamJsonBody,
} from "src/lib/forms/joinOurTeamFormData";
import type { RequestAProposalApiInput } from "src/lib/forms/requestAProposalForm.schema";

export interface FormSubmitResponse {
  id?: string;
  message?: string;
  error?: { message?: string; name?: string } | string;
}

function buildDeploySearchParams(
  base: Record<string, string>,
  token?: string,
): string {
  const params = new URLSearchParams(base);

  if (token) {
    params.set("token", token);
  }

  return params.toString();
}

export const api = {
  deploy: {
    active: ({ target, token }: DeployActiveInput) =>
      fetchJsonResponse<DeployActiveResponse>(
        fetch(
          `/api/refresh-content/deploy/active?${buildDeploySearchParams({ target }, token)}`,
          fetchOptions({ cache: "no-store", method: FetchMethods.Get }),
        ),
      ),
    buildStats: ({ token }: DeployBuildStatsInput) =>
      fetchJsonResponse<DeployBuildStatsResponse>(
        fetch(
          `/api/refresh-content/deploy/build-stats?${buildDeploySearchParams({}, token)}`,
          fetchOptions({ cache: "no-store", method: FetchMethods.Get }),
        ),
      ),
    status: ({
      createdAt,
      deployHookId,
      jobCreatedAt,
      projectId,
      target,
      token,
    }: DeployStatusInput) =>
      fetchJsonResponse<DeployStatusResponse>(
        fetch(
          `/api/refresh-content/deploy/status?${buildDeploySearchParams(
            {
              deployHookId,
              projectId,
              since: String(createdAt),
              target,
              ...(jobCreatedAt !== undefined
                ? { jobCreatedAt: String(jobCreatedAt) }
                : {}),
            },
            token,
          )}`,
          fetchOptions({ cache: "no-store", method: FetchMethods.Get }),
        ),
      ),
    trigger: ({ target, token }: DeployTriggerInput) =>
      fetchJsonResponse<DeployTriggerResponse>(
        fetch(
          "/api/refresh-content/deploy",
          fetchOptions({
            body: JSON.stringify({ target, token }),
            method: FetchMethods.Post,
          }),
        ),
      ),
  },
  generalInquiry: ({
    email,
    formId,
    formStartedAt,
    message,
    name,
    phone,
    recaptchaToken,
    website,
  }: GeneralInquiryApiInput) =>
    fetchJsonResponse<FormSubmitResponse>(
      fetch(
        "/api/resend/general-inquiry",
        fetchOptions({
          body: JSON.stringify({
            email,
            formId,
            formStartedAt,
            message,
            name,
            phone,
            recaptchaToken,
            website,
          }),
          method: FetchMethods.Post,
        }),
      ),
    ),
  joinOurTeam: (data: JoinOurTeamClientSubmit) => {
    const hasFiles =
      data.resume instanceof File || data.coverLetter instanceof File;

    if (hasFiles) {
      return fetchJsonResponse<FormSubmitResponse>(
        fetch("/api/resend/join-our-team", {
          body: buildJoinOurTeamFormData(data),
          headers: { Accept: "application/json" },
          method: FetchMethods.Post,
        }),
      );
    }

    return fetchJsonResponse<FormSubmitResponse>(
      fetch(
        "/api/resend/join-our-team",
        fetchOptions({
          body: JSON.stringify(buildJoinOurTeamJsonBody(data)),
          method: FetchMethods.Post,
        }),
      ),
    );
  },
  requestAProposal: ({
    companyName,
    email,
    formId,
    formStartedAt,
    name,
    phone,
    projectDetails,
    recaptchaToken,
    website,
  }: RequestAProposalApiInput) =>
    fetchJsonResponse<FormSubmitResponse>(
      fetch(
        "/api/resend/request-a-proposal",
        fetchOptions({
          body: JSON.stringify({
            companyName,
            email,
            formId,
            formStartedAt,
            name,
            phone,
            projectDetails,
            recaptchaToken,
            website,
          }),
          method: FetchMethods.Post,
        }),
      ),
    ),
};
