"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useId, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "src/components/Button/Button.component";
import styles from "src/components/JoinOurTeamForm/JoinOurTeamForm.module.css";
import { RichText } from "src/components/RichText/RichText.component";
import { StyledInput } from "src/components/StyledInput/StyledInput.component";
import { StyledTextArea } from "src/components/StyledInput/StyledTextArea.component";
import type { FormJoinOurTeamType } from "src/contentful/parseFormJoinOurTeam";
import { useSendJoinOurTeamFormMutation } from "src/hooks/mutations/useSendJoinOurTeamForm.mutation";
import ChevronDown from "src/icons/Chevron.svg";
import { US_STATES_MAP } from "src/utils/constants";
import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";

interface JoinOurTeamFormProps {
  fields: FormJoinOurTeamType;
}

export interface JoinOurTeamInputs {
  briefDescription: string;
  workEligibility: boolean;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coverLetter: File | null;
  resume: File | null;
  position: string;
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
  resume: null,
  state: "MD",
  workEligibility: false,
  zipCode: "",
};

export const JoinOurTeam = (props: JoinOurTeamFormProps) => {
  const { fields } = props;
  const t = useTranslations("JoinOurTeamForm");

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

  const positionId = useId();
  const stateId = useId();
  const workEligibilityId = useId();
  const resumeId = useId();
  const coverLetterId = useId();

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
        } = data;

        try {
          await sendJoinOurTeamFormMutation.mutateAsync({
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
          });
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

  if (isSubmitSuccessful) {
    return (
      <div className={styles.formSubmitSuccess}>
        <RichText document={formSubmitSuccessMessage} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {description ? (
        <div className={styles.formCopy}>
          <RichText document={description} />
        </div>
      ) : null}

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
          name="position"
          render={({ field: { onChange, value, name, ref } }) => (
            <div className={styles.fieldsetWrapper}>
              <label className={styles.label} htmlFor={positionId}>
                {t("labels.position")} *
              </label>
              <div
                className={clsx(styles.selectWrapper, {
                  [styles.selectHasError]: errors.position,
                })}
              >
                <select
                  className={styles.select}
                  id={positionId}
                  name={name}
                  onChange={(e) => {
                    console.log("Position changed:", e.target.value);
                    onChange(e.target.value);
                  }}
                  ref={ref}
                  value={value}
                >
                  <option value="">{t("messages.selectPosition")}</option>
                  {fields.openJobs.map((job) => (
                    <option key={job} value={job}>
                      {job}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className={styles.selectChevron}
                  role="presentation"
                >
                  <ChevronDown />
                </span>
                {errors.position && (
                  <span className={styles.errorMessage}>
                    {t("messages.positionRequired")}
                  </span>
                )}
              </div>
            </div>
          )}
          rules={{ required: true }}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value, name, ref } }) => (
            <StyledInput
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
              <StyledInput
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
            render={({ field: { onChange, value, name, ref } }) => (
              <div className={styles.fieldsetWrapper}>
                <label className={styles.label} htmlFor={stateId}>
                  {t("labels.state")}
                </label>
                <div
                  className={clsx(styles.selectWrapper, {
                    [styles.selectHasError]: errors.state,
                  })}
                >
                  <select
                    className={styles.select}
                    id={stateId}
                    name={name}
                    onChange={(e) => {
                      console.log("State changed:", e.target.value);
                      onChange(e.target.value);
                    }}
                    ref={ref}
                    value={value}
                  >
                    <option value="">{t("messages.selectState")}</option>
                    {Object.entries(US_STATES_MAP).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className={styles.selectChevron}
                    role="presentation"
                  >
                    <ChevronDown />
                  </span>
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="zipCode"
            render={({ field: { onChange, value, name, ref } }) => (
              <StyledInput
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
            <StyledTextArea
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
          render={({ field: { onChange, name, ref } }) => (
            <div className={styles.fieldsetWrapper}>
              <label className={styles.label} htmlFor={resumeId}>
                {t("labels.resume")}
              </label>
              <p className={styles.fieldDescription} data-required="true">
                {t("descriptions.resume")}
              </p>
              <div
                className={clsx(styles.fileInputWrapper, {
                  [styles.fileInputHasError]: errors.resume,
                })}
              >
                <input
                  accept=".pdf,.doc,.docx"
                  className={styles.fileInput}
                  id={resumeId}
                  name={name}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                  }}
                  ref={ref}
                  type="file"
                />
                {errors.resume && (
                  <span className={styles.errorMessage}>
                    {t("messages.resumeRequired")}
                  </span>
                )}
              </div>
            </div>
          )}
          rules={{ required: true }}
        />

        <Controller
          control={control}
          name="coverLetter"
          render={({ field: { onChange, name, ref } }) => (
            <div className={styles.fieldsetWrapper}>
              <label className={styles.label} htmlFor={coverLetterId}>
                {t("labels.coverLetter")}
              </label>
              <p className={styles.fieldDescription} data-required="false">
                {t("descriptions.coverLetter")}
              </p>
              <div
                className={clsx(styles.fileInputWrapper, {
                  [styles.fileInputHasError]: errors.coverLetter,
                })}
              >
                <input
                  accept=".pdf,.doc,.docx"
                  className={styles.fileInput}
                  id={coverLetterId}
                  name={name}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                  }}
                  ref={ref}
                  type="file"
                />
              </div>
            </div>
          )}
        />

        <Controller
          control={control}
          name="workEligibility"
          render={({ field: { onChange, value, name, ref } }) => (
            <div className={styles.checkboxWrapper}>
              <input
                checked={value}
                className={styles.checkbox}
                id={workEligibilityId}
                name={name}
                onChange={(e) => onChange(e.target.checked)}
                ref={ref}
                type="checkbox"
              />
              <label
                className={styles.checkboxLabel}
                htmlFor={workEligibilityId}
              >
                {t("labels.workEligibility")}
              </label>
            </div>
          )}
        />

        <div className={styles.formSubmitContainer}>
          <div>
            {hasMissingFields ? <p>{t("messages.missingFields")}</p> : null}
          </div>
          <div>
            <Button
              data-tracking-click="join-our-team-form-submit"
              isDisabled={isSubmitting}
              label={t("messages.submit")}
              type="submit"
            >
              {isSubmitting ? t("messages.submitting") : t("messages.submit")}
            </Button>
          </div>
        </div>

        <ReCAPTCHA
          ref={reCaptcha}
          sitekey={process.env.RECAPTCHA_SITE_KEY as string} // v3
          size="invisible"
        />
        <input hidden type="submit" />
      </form>
    </div>
  );
};
