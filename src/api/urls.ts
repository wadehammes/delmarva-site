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
import {
  FetchMethods,
  fetchJsonResponse,
  fetchOptions,
  fetchResponse,
} from "src/api/helpers";
import type { GeneralInquiryInputs } from "src/components/GeneralInquiryForm/GeneralInquiryForm.component";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import type { RequestAProposalInputs } from "src/components/RequestAProposalForm/RequestAProposalForm.component";

export interface FormSubmitResponse {
  id?: string;
  message?: string;
  error?: { message?: string; name?: string } | string;
}

function buildJoinOurTeamFormData(data: JoinOurTeamInputs): FormData {
  const form = new FormData();
  form.append("address", data.address);
  form.append("briefDescription", data.briefDescription);
  form.append("city", data.city);
  form.append("email", data.email);
  if (data.formId) {
    form.append("formId", data.formId);
  }
  if (data.locale) {
    form.append("locale", data.locale);
  }
  form.append("name", data.name);
  form.append("phone", data.phone);
  form.append("position", data.position);
  form.append("recaptchaToken", data.recaptchaToken);
  form.append("formStartedAt", String(data.formStartedAt ?? ""));
  form.append("state", data.state);
  form.append("workEligibility", String(data.workEligibility));
  form.append("zipCode", data.zipCode);
  if (data.website !== undefined) {
    form.append("website", data.website);
  }
  if (data.resume instanceof File) {
    form.append("resume", data.resume);
  }
  if (data.coverLetter instanceof File) {
    form.append("coverLetter", data.coverLetter);
  }
  return form;
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
  }: GeneralInquiryInputs) =>
    fetchResponse<FormSubmitResponse>(
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
  joinOurTeam: (data: JoinOurTeamInputs) => {
    const hasFiles =
      data.resume instanceof File || data.coverLetter instanceof File;

    if (hasFiles) {
      return fetchResponse<FormSubmitResponse>(
        fetch("/api/resend/join-our-team", {
          body: buildJoinOurTeamFormData(data),
          headers: { Accept: "application/json" },
          method: FetchMethods.Post,
        }),
      );
    }

    return fetchResponse<FormSubmitResponse>(
      fetch(
        "/api/resend/join-our-team",
        fetchOptions({
          body: JSON.stringify({
            address: data.address,
            briefDescription: data.briefDescription,
            city: data.city,
            email: data.email,
            formId: data.formId,
            formStartedAt: data.formStartedAt,
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
  }: RequestAProposalInputs) =>
    fetchResponse<FormSubmitResponse>(
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
