"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Controller,
  type SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { Button } from "src/components/Button/Button.component";
import { FormWebsiteHoneypot } from "src/components/forms/FormWebsiteHoneypot.component";
import { Input } from "src/components/Input/Input.component";
import { TextArea } from "src/components/TextArea/TextArea.component";
import type { FormType } from "src/contentful/parseForm";
import { useSendRequestAProposalFormMutation } from "src/hooks/mutations/useSendRequestAProposalForm.mutation";
import {
  createRequestAProposalFormSchema,
  type RequestAProposalFormValues,
} from "src/lib/forms/requestAProposalForm.schema";
import { appToast } from "src/lib/toast/appToast";
import layoutStyles from "src/styles/formLayoutShared.module.css";
import { getRecaptchaSiteKey } from "src/utils/publicEnv";

interface RequestAProposalFormProps {
  fields: FormType;
}

const defaultValues: RequestAProposalFormValues = {
  companyName: "",
  email: "",
  name: "",
  phone: "",
  projectDetails: "",
  recaptchaToken: "",
  website: "",
};

export const RequestAProposalForm = (props: RequestAProposalFormProps) => {
  const { fields } = props;

  const { id: formId } = fields;

  const t = useTranslations("RequestAProposalForm");

  const schema = useMemo(
    () =>
      createRequestAProposalFormSchema({
        fieldRequired: t("messages.fieldRequired"),
        invalidEmail: t("messages.invalidEmail"),
        invalidPhone: t("messages.invalidPhone"),
      }),
    [t],
  );

  const reCaptcha = useRef<ReCAPTCHA>(null);
  const formStartedAt = useRef(Date.now());

  const { handleSubmit, control, reset } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
  });
  const { errors, isSubmitting } = useFormState({ control });

  const sendMutation = useSendRequestAProposalFormMutation();
  const isBusy = isSubmitting || sendMutation.isPending;

  const onSubmit: SubmitHandler<RequestAProposalFormValues> = async (data) => {
    if (reCaptcha?.current) {
      const captcha = await reCaptcha.current.executeAsync();

      if (captcha) {
        const { companyName, email, name, phone, projectDetails, website } =
          data;

        sendMutation.mutate(
          {
            companyName,
            email,
            formId,
            formStartedAt: formStartedAt.current,
            name,
            phone,
            projectDetails,
            recaptchaToken: captcha,
            website,
          },
          {
            onError: () => {
              appToast.error(t("messages.submitError"));
            },
            onSuccess: () => {
              appToast.success(t("messages.success"));
              reset(defaultValues);
              formStartedAt.current = Date.now();
              reCaptcha.current?.reset();
            },
          },
        );
      }
    }
  };

  return (
    <form
      className={layoutStyles.form}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            aria-label={t("labels.companyName")}
            hasError={errors.companyName}
            label={`${t("labels.companyName")} *`}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.companyName")}
            ref={ref}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            aria-label={t("labels.fullName")}
            hasError={errors.name}
            label={`${t("labels.fullName")} *`}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.fullName")}
            ref={ref}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            aria-label={t("labels.email")}
            hasError={errors.email}
            label={`${t("labels.email")} *`}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.email")}
            ref={ref}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            aria-label={t("labels.phone")}
            hasError={errors.phone}
            label={t("labels.phone")}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.phone")}
            ref={ref}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="projectDetails"
        render={({ field: { onChange, value, name, ref } }) => (
          <TextArea
            aria-label={t("labels.projectDetails")}
            hasError={errors.projectDetails}
            label={t("labels.projectDetails")}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.projectDetails")}
            ref={ref}
            value={value}
          />
        )}
      />

      <div className={layoutStyles.formSubmitContainer}>
        <div />
        <div>
          <Button
            isDisabled={isBusy}
            label={t("messages.submit")}
            trackingEvent="request-a-proposal-form-submit"
            type="submit"
          >
            {isBusy ? t("messages.submitting") : t("messages.submit")}
          </Button>
        </div>
      </div>

      <FormWebsiteHoneypot
        className={layoutStyles.honeypot}
        control={control}
      />

      <ReCAPTCHA
        ref={reCaptcha}
        sitekey={getRecaptchaSiteKey() ?? ""}
        size="invisible"
      />
      <input hidden type="submit" />
    </form>
  );
};
