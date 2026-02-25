"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "src/components/Button/Button.component";
import { StyledInput } from "src/components/StyledInput/StyledInput.component";
import { StyledTextArea } from "src/components/StyledInput/StyledTextArea.component";
import type { FormType } from "src/contentful/parseForm";
import { useSendGeneralInquiryFormMutation } from "src/hooks/mutations/useSendGeneralInquiryForm.mutation";
import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";
import styles from "./GeneralInquiryForm.module.css";

interface GeneralInquiryFormProps {
  fields: FormType;
}

export interface GeneralInquiryInputs {
  name: string;
  email: string;
  phone: string;
  message: string;
  recaptchaToken: string;
  website?: string;
  emailsToSendNotification?: string[];
  emailsToBcc?: string[];
}

const defaultValues: GeneralInquiryInputs = {
  email: "",
  message: "",
  name: "",
  phone: "",
  recaptchaToken: "",
  website: "",
};

export const GeneralInquiryForm = (props: GeneralInquiryFormProps) => {
  const { fields } = props;

  const { emailsToSendNotification, emailsToBcc } = fields;

  const t = useTranslations("GeneralInquiryForm");

  const reCaptcha = useRef<ReCAPTCHA>(null);

  const {
    handleSubmit,
    control,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const sendMutation = useSendGeneralInquiryFormMutation();

  const onSubmit: SubmitHandler<GeneralInquiryInputs> = async (data) => {
    clearErrors("email");

    if (reCaptcha?.current) {
      const captcha = await reCaptcha.current.executeAsync();

      if (captcha) {
        const { email, message, name, phone, website } = data;

        try {
          await sendMutation.mutateAsync({
            email,
            emailsToBcc: emailsToBcc,
            emailsToSendNotification,
            message,
            name,
            phone,
            recaptchaToken: captcha,
            website,
          });
          toast.success(t("messages.success"));
          reset(defaultValues);
          reCaptcha.current?.reset();
        } catch (_e) {
          throw new Error("Failed to submit inquiry. Please try again.");
        }
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
        name="message"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledTextArea
            hasError={errors.message}
            label={t("labels.message")}
            name={name}
            onChange={onChange}
            placeholder={t("placeholders.message")}
            ref={ref}
            value={value}
          />
        )}
        rules={{ required: true }}
      />

      <div className={styles.formSubmitContainer}>
        <div />
        <div>
          <Button
            data-tracking-click="general-inquiry-form-submit"
            isDisabled={isSubmitting}
            label={t("messages.submit")}
            type="submit"
          >
            {isSubmitting ? t("messages.submitting") : t("messages.submit")}
          </Button>
        </div>
      </div>

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
