"use client";

import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Controller,
  type SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { Button } from "src/components/Button/Button.component";
import { Checkbox } from "src/components/Checkbox/Checkbox.component";
import { FileInput } from "src/components/FileInput/FileInput.component";
import { FormWebsiteHoneypot } from "src/components/forms/FormWebsiteHoneypot.component";
import { Input } from "src/components/Input/Input.component";
import styles from "src/components/JoinOurTeamForm/JoinOurTeamForm.module.css";
import { RichText } from "src/components/RichText/RichText.component";
import { Select } from "src/components/Select/Select.component";
import { TextArea } from "src/components/TextArea/TextArea.component";
import type { FormJoinOurTeamType } from "src/contentful/parseFormJoinOurTeam";
import { useSendJoinOurTeamFormMutation } from "src/hooks/mutations/useSendJoinOurTeamForm.mutation";
import type { Locales } from "src/i18n/routing";
import {
  createJoinOurTeamFormSchema,
  type JoinOurTeamFormInput,
  type JoinOurTeamFormValues,
} from "src/lib/forms/joinOurTeamForm.schema";
import { appToast } from "src/lib/toast/appToast";
import fieldStyles from "src/styles/formFieldShared.module.css";
import layoutStyles from "src/styles/formLayoutShared.module.css";
import { US_STATES_MAP } from "src/utils/constants";
import { getRecaptchaSiteKey } from "src/utils/publicEnv";

interface JoinOurTeamFormProps {
  fields: FormJoinOurTeamType;
}

const JOIN_OUR_TEAM_BLOCKING_FIELDS = [
  "name",
  "email",
  "position",
  "resume",
  "workEligibility",
] as const;

const defaultValues: JoinOurTeamFormInput = {
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

  const schema = useMemo(
    () =>
      createJoinOurTeamFormSchema({
        fieldRequired: t("messages.fieldRequired"),
        invalidEmail: t("messages.invalidEmail"),
        invalidPhone: t("messages.invalidPhone"),
        positionRequired: t("messages.positionRequired"),
        resumeRequired: t("messages.resumeRequired"),
        workEligibilityRequired: t("messages.workEligibilityRequired"),
      }),
    [t],
  );

  const reCaptcha = useRef<ReCAPTCHA>(null);
  const formStartedAt = useRef(Date.now());

  const { handleSubmit, control, reset } = useForm<
    JoinOurTeamFormInput,
    unknown,
    JoinOurTeamFormValues
  >({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
  });
  const { errors, isSubmitting } = useFormState({ control });

  const sendJoinOurTeamFormMutation = useSendJoinOurTeamFormMutation();
  const isBusy = isSubmitting || sendJoinOurTeamFormMutation.isPending;

  const onSubmit: SubmitHandler<JoinOurTeamFormValues> = async (data) => {
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

        sendJoinOurTeamFormMutation.mutate(
          {
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
          },
          {
            onError: () => {
              appToast.error(t("messages.submitError"));
            },
            onSuccess: () => {
              const message =
                documentToPlainTextString(formSubmitSuccessMessage).trim() ||
                "Application received. We'll be in touch soon.";
              appToast.success(message);
              reset(defaultValues);
              formStartedAt.current = Date.now();
              reCaptcha.current?.reset();
            },
          },
        );
      }
    }
  };

  const hasMissingFields = JOIN_OUR_TEAM_BLOCKING_FIELDS.some(
    (fieldName) => errors[fieldName],
  );

  const { description, formSubmitSuccessMessage } = fields;

  return (
    <div className={styles.container}>
      {description ? <RichText document={description} /> : null}

      <form
        className={layoutStyles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.topFieldsGrid}>
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
            name="position"
            render={({ field: { onBlur, onChange, value, name, ref } }) => (
              <Select
                aria-label={t("labels.position")}
                errorMessage={errors.position?.message}
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
              errorMessage={errors.resume?.message}
              hasError={errors.resume}
              label={t("labels.resume")}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
            />
          )}
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
            <div>
              <Checkbox
                checked={value}
                label={t("labels.workEligibility")}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                ref={ref}
              />
              {errors.workEligibility?.message ? (
                <p className={fieldStyles.errorMessage}>
                  {errors.workEligibility.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <div className={layoutStyles.formSubmitContainer}>
          <div>
            {hasMissingFields ? <p>{t("messages.missingFields")}</p> : null}
          </div>
          <div>
            <Button
              isDisabled={isBusy}
              label={t("messages.submit")}
              trackingEvent="join-our-team-form-submit"
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
    </div>
  );
};
