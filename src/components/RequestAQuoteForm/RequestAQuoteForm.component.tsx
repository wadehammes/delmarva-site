"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "src/components/Button/Button.component";
import { StyledInput } from "src/components/StyledInput/StyledInput.component";
import { StyledTextArea } from "src/components/StyledInput/StyledTextArea.component";
import { useSendRequestAQuoteFormMutation } from "src/hooks/mutations/useSendRequestAQuoteForm.mutation";
import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";
import styles from "./RequestAQuoteForm.module.css";

export interface RequestAQuoteInputs {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
  recaptchaToken: string;
  website?: string; // Honeypot field
}

const defaultValues: RequestAQuoteInputs = {
  companyName: "",
  email: "",
  name: "",
  phone: "",
  projectDetails: "",
  recaptchaToken: "",
  website: "",
};

export const RequestAQuoteForm = () => {
  const t = useTranslations("RequestAQuoteForm");

  const reCaptcha = useRef<ReCAPTCHA>(null);

  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const sendMutation = useSendRequestAQuoteFormMutation();

  const onSubmit: SubmitHandler<RequestAQuoteInputs> = async (data) => {
    clearErrors("email");

    if (reCaptcha?.current) {
      const captcha = await reCaptcha.current.executeAsync();

      if (captcha) {
        const { companyName, email, name, phone, projectDetails, website } =
          data;

        try {
          await sendMutation.mutateAsync({
            companyName,
            email,
            name,
            phone,
            projectDetails,
            recaptchaToken: captcha,
            website,
          });
        } catch (_e) {
          throw new Error("Failed to submit request. Please try again.");
        }
      }
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className={styles.formSubmitSuccess}>{t("messages.success")}</div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            hasError={errors.companyName}
            label={`${t("labels.companyName")} *`}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.companyName")}
            ref={ref}
            value={value}
          />
        )}
        rules={{ required: true }}
      />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            hasError={errors.name}
            label={`${t("labels.fullName")} *`}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.fullName")}
            ref={ref}
            value={value}
          />
        )}
        rules={{ required: true }}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            hasError={errors.email}
            label={`${t("labels.email")} *`}
            name={name}
            onChange={(e) => {
              clearErrors("email");
              onChange(e);
            }}
            placeholder={t("placeholders.email")}
            ref={ref}
            value={value}
          />
        )}
        rules={{ pattern: EMAIL_VALIDATION_REGEX, required: true }}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            hasError={errors.phone}
            label={t("labels.phone")}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.phone")}
            ref={ref}
            value={value}
          />
        )}
        rules={{ pattern: PHONE_NUMBER_VALIDATION_REGEX }}
      />

      <Controller
        control={control}
        name="projectDetails"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledTextArea
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

      <div className={styles.formSubmitContainer}>
        <div />
        <div>
          <Button
            data-tracking-click="request-a-quote-form-submit"
            isDisabled={isSubmitting}
            label={t("messages.submit")}
            type="submit"
          >
            {isSubmitting ? t("messages.submitting") : t("messages.submit")}
          </Button>
        </div>
      </div>

      {/* Honeypot field - hidden from users but visible to bots */}
      <div className={styles.honeypot}>
        <label htmlFor="website">
          Please leave this field empty (anti-spam)
        </label>
        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, value, name, ref } }) => (
            <input
              autoComplete="off"
              id="website"
              name={name}
              onChange={onChange}
              ref={ref}
              tabIndex={-1}
              type="text"
              value={value}
            />
          )}
        />
      </div>

      <ReCAPTCHA
        ref={reCaptcha}
        sitekey={process.env.RECAPTCHA_SITE_KEY as string}
        size="invisible"
      />
      <input hidden type="submit" />
    </form>
  );
};

export default RequestAQuoteForm;
