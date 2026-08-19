"use client";

import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Controller,
  type SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { toast } from "sonner";
import { Button } from "src/components/Button/Button.component";
import { Checkbox } from "src/components/Checkbox/Checkbox.component";
import { FileInput } from "src/components/FileInput/FileInput.component";
import { Input } from "src/components/Input/Input.component";
import styles from "src/components/JoinOurTeamForm/JoinOurTeamForm.module.css";
import { RichText } from "src/components/RichText/RichText.component";
import { Select } from "src/components/Select/Select.component";
import { TextArea } from "src/components/TextArea/TextArea.component";
import type { FormJoinOurTeamType } from "src/contentful/parseFormJoinOurTeam";
import { useSendJoinOurTeamFormMutation } from "src/hooks/mutations/useSendJoinOurTeamForm.mutation";
import type { Locales } from "src/i18n/routing";
import { US_STATES_MAP } from "src/utils/constants";
import { getRecaptchaSiteKey } from "src/utils/publicEnv";
import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";

interface JoinOurTeamFormProps {
  fields: FormJoinOurTeamType;
}

export interface JoinOurTeamInputs {
  address: string;
  briefDescription: string;
  city: string;
  coverLetter: File | null;
  email: string;
  formId?: string;
  locale?: Locales;
  name: string;
  phone: string;
  position: string;
  recaptchaToken: string;
  formStartedAt?: number;
  resume: File | null;
  state: string;
  website?: string; // Honeypot field
  workEligibility: boolean;
  zipCode: string;
}

const defaultValues: JoinOurTeamInputs = {
  address: "",
  briefDescription: "",
  city: "",
  coverLetter: null,
  email: "",
  name: "",
  phone: "",
  position: "",
  recaptchaToken: "",
  resume: null,
  state: "MD",
  website: "",
  workEligibility: false,
  zipCode: "",
};

export const JoinOurTeam = (props: JoinOurTeamFormProps) => {
  const { fields } = props;
  const locale = useLocale() as Locales;
  const t = useTranslations("JoinOurTeamForm");

  const reCaptcha = useRef<ReCAPTCHA>(null);
  const formStartedAt = useRef(Date.now());

  const { handleSubmit, control, clearErrors, reset } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { errors, isSubmitting } = useFormState({ control });

  const sendJoinOurTeamFormMutation = useSendJoinOurTeamFormMutation();

  const onSubmit: SubmitHandler<JoinOurTeamInputs> = async (data) => {
    clearErrors("email");
    clearErrors("position");

    if (reCaptcha?.current) {
      const captcha = await reCaptcha.current.executeAsync();

      if (captcha) {
        const {
          briefDescription,
          email,
          name,
          phone,
          workEligibility,
          address,
          city,
          state,
          zipCode,
          coverLetter,
          resume,
          position,
          website,
        } = data;

        try {
          await sendJoinOurTeamFormMutation.mutateAsync({
            address,
            briefDescription,
            city,
            coverLetter,
            email,
            formId: fields.id,
            formStartedAt: formStartedAt.current,
            locale,
            name,
            phone,
            position,
            recaptchaToken: captcha,
            resume,
            state,
            website,
            workEligibility,
            zipCode,
          });
          const message =
            documentToPlainTextString(formSubmitSuccessMessage).trim() ||
            "Application received. We'll be in touch soon.";
          toast.success(message);
          reset(defaultValues);
          formStartedAt.current = Date.now();
          reCaptcha.current?.reset();
        } catch (_e) {
          throw new Error("Failed to submit application. Please try again.");
        }
      }
    }
  };

  const hasMissingFields =
    errors.name ||
    errors.email ||
    errors.position ||
    errors.resume ||
    errors.workEligibility;

  const { description, formSubmitSuccessMessage } = fields;

  return (
    <div className={styles.container}>
      {description ? <RichText document={description} /> : null}

      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.topFieldsGrid}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                hasError={errors.name}
                label={`${t("labels.fullName")} *`}
                name={name}
                onChange={onChange}
                placeholder={t("placeholders.fullName")}
                ref={ref}
                value={value}
              />
            )}
            rules={{ required: t("messages.required") }}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
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
            rules={{
              pattern: {
                message: t("messages.invalidEmail"),
                value: EMAIL_VALIDATION_REGEX,
              },
              required: t("messages.required"),
            }}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                hasError={errors.phone}
                label={t("labels.phone")}
                name={name}
                onChange={onChange}
                placeholder={t("placeholders.phone")}
                ref={ref}
                value={value}
              />
            )}
            rules={{
              pattern: {
                message: t("messages.invalidPhone"),
                value: PHONE_NUMBER_VALIDATION_REGEX,
              },
            }}
          />

          <Controller
            control={control}
            name="position"
            render={({ field: { onBlur, onChange, value, name, ref } }) => (
              <Select
                errorMessage={
                  errors.position ? t("messages.positionRequired") : undefined
                }
                hasError={errors.position}
                label={`${t("labels.position")} *`}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                options={(fields.openJobs ?? []).map((job) => ({
                  label: job,
                  value: job,
                }))}
                placeholder={t("messages.selectPosition")}
                ref={ref}
                value={value}
              />
            )}
            rules={{ required: t("messages.positionRequired") }}
          />
        </div>

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value, name, ref } }) => (
            <Input
              hasError={errors.address}
              label={t("labels.address")}
              name={name}
              onChange={onChange}
              placeholder={t("placeholders.address")}
              ref={ref}
              value={value}
            />
          )}
        />

        <div className={styles.addressRow}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                hasError={errors.city}
                label={t("labels.city")}
                name={name}
                onChange={onChange}
                placeholder={t("placeholders.city")}
                ref={ref}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field: { onBlur, onChange, value, name, ref } }) => (
              <Select
                hasError={errors.state}
                label={t("labels.state")}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                options={Object.entries(US_STATES_MAP).map(
                  ([code, stateName]) => ({
                    label: stateName,
                    value: code,
                  }),
                )}
                placeholder={t("messages.selectState")}
                ref={ref}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="zipCode"
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                hasError={errors.zipCode}
                label={t("labels.zipCode")}
                name={name}
                onChange={onChange}
                placeholder={t("placeholders.zipCode")}
                ref={ref}
                value={value}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="briefDescription"
          render={({ field: { onChange, value, name, ref } }) => (
            <TextArea
              hasError={errors.briefDescription}
              label={t("labels.briefDescription")}
              name={name}
              onChange={onChange}
              placeholder={t("placeholders.briefDescription")}
              ref={ref}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="resume"
          render={({ field: { onBlur, onChange, name, ref } }) => (
            <FileInput
              accept=".pdf,.doc,.docx"
              description={t("descriptions.resume")}
              errorMessage={
                errors.resume ? t("messages.resumeRequired") : undefined
              }
              hasError={errors.resume}
              label={t("labels.resume")}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
            />
          )}
          rules={{ required: t("messages.resumeRequired") }}
        />

        <Controller
          control={control}
          name="coverLetter"
          render={({ field: { onBlur, onChange, name, ref } }) => (
            <FileInput
              accept=".pdf,.doc,.docx"
              description={t("descriptions.coverLetter")}
              hasError={errors.coverLetter}
              label={t("labels.coverLetter")}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="workEligibility"
          render={({ field: { onBlur, onChange, value, name, ref } }) => (
            <Checkbox
              checked={value}
              label={t("labels.workEligibility")}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
            />
          )}
        />

        <div className={styles.formSubmitContainer}>
          <div>
            {hasMissingFields ? <p>{t("messages.missingFields")}</p> : null}
          </div>
          <div>
            <Button
              isDisabled={isSubmitting}
              label={t("messages.submit")}
              trackingEvent="join-our-team-form-submit"
              type="submit"
            >
              {isSubmitting ? t("messages.submitting") : t("messages.submit")}
            </Button>
          </div>
        </div>

        <div aria-hidden="true" className={styles.honeypot}>
          <label htmlFor="website">Website</label>
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
          sitekey={getRecaptchaSiteKey() ?? ""}
          size="invisible"
        />
        <input hidden type="submit" />
      </form>
    </div>
  );
};
