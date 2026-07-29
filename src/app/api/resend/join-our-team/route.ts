import { Resend } from "resend";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "src/lib/emailRenderer";
import { parseEmailLocale } from "src/lib/emailTranslations";
import { resolveFormNotificationRecipients } from "src/lib/formNotificationRecipients";
import { US_STATES_MAP } from "src/utils/constants";
import {
  blobToBase64,
  getFileExtension,
  getMimeType,
} from "src/utils/emailHelpers";
import {
  checkFormSubmissionSpam,
  createSpamBlockedResponse,
  logBlockedFormSubmission,
} from "src/utils/formSpamProtection";
import { isNonNullable } from "src/utils/value.helpers";

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";
const formName = "Join Our Team form";

function parseFormData(formData: FormData): JoinOurTeamInputs {
  const get = (key: string) => formData.get(key);
  const getString = (key: string) => (get(key) as string | null) ?? "";
  const workEligibilityRaw = getString("workEligibility");
  const workEligibility =
    workEligibilityRaw === "true" || workEligibilityRaw !== "false";
  const formStartedAtRaw = getString("formStartedAt");
  const formStartedAt = formStartedAtRaw
    ? Number.parseInt(formStartedAtRaw, 10)
    : undefined;
  return {
    address: getString("address"),
    briefDescription: getString("briefDescription"),
    city: getString("city"),
    coverLetter: (get("coverLetter") as File | null) ?? null,
    email: getString("email"),
    formId: getString("formId") || undefined,
    formStartedAt,
    locale: (() => {
      const localeRaw = getString("locale");
      return localeRaw ? parseEmailLocale(localeRaw) : undefined;
    })(),
    name: getString("name"),
    phone: getString("phone"),
    position: getString("position"),
    recaptchaToken: getString("recaptchaToken"),
    resume: (get("resume") as File | null) ?? null,
    state: getString("state"),
    website: getString("website") || undefined,
    workEligibility,
    zipCode: getString("zipCode"),
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const res: JoinOurTeamInputs = contentType.includes("multipart/form-data")
    ? parseFormData(await request.formData())
    : await request.json();

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const briefDescription = res.briefDescription || "No message provided.";
  const workEligibility = isNonNullable(res.workEligibility)
    ? res.workEligibility
    : true;
  const address = res.address || "No address provided.";
  const city = res.city || "No city provided.";
  const stateCode = res.state;
  const stateName = US_STATES_MAP[stateCode] || stateCode;
  const zipCode = res.zipCode || "No zip code provided.";
  const coverLetter = res.coverLetter;
  const resume = res.resume;
  const position = res.position || "No position provided.";

  const spamCheck = await checkFormSubmissionSpam({
    formStartedAt: res.formStartedAt,
    honeypot: res.website,
    recaptchaToken: res.recaptchaToken,
    spamContent: {
      email,
      message: [
        name,
        email,
        phone,
        address,
        city,
        stateName,
        zipCode,
        position,
        briefDescription,
      ]
        .filter(Boolean)
        .join(" "),
      name,
    },
  });

  if (!spamCheck.allowed) {
    logBlockedFormSubmission(formName, spamCheck, { email, name, position });
    return createSpamBlockedResponse();
  }

  if (!email) {
    return new Response("no to: email provided", {
      status: 404,
    });
  }

  try {
    const attachments: Array<{
      filename: string;
      content: string;
      contentType: string;
    }> = [];

    if (resume instanceof Blob && resume.size > 0) {
      try {
        const resumeBase64 = await blobToBase64(resume);
        const resumeName = resume instanceof File ? resume.name : "resume.pdf";
        const resumeExtension = getFileExtension(resumeName);
        const resumeMimeType = getMimeType(resumeExtension);

        attachments.push({
          content: resumeBase64,
          contentType: resumeMimeType,
          filename: `Resume_${name.replace(/\s+/g, "_")}.${resumeExtension}`,
        });
      } catch (error) {
        console.error("Failed to process resume file:", error);
      }
    }

    if (coverLetter instanceof Blob && coverLetter.size > 0) {
      try {
        const coverLetterBase64 = await blobToBase64(coverLetter);
        const coverLetterName =
          coverLetter instanceof File ? coverLetter.name : "cover-letter.pdf";
        const coverLetterExtension = getFileExtension(coverLetterName);
        const coverLetterMimeType = getMimeType(coverLetterExtension);

        attachments.push({
          content: coverLetterBase64,
          contentType: coverLetterMimeType,
          filename: `CoverLetter_${name.replace(/\s+/g, "_")}.${coverLetterExtension}`,
        });
      } catch (error) {
        console.error("Failed to process cover letter file:", error);
      }
    }

    const notificationEmail = await renderNotificationEmail({
      address,
      briefDescription,
      city,
      coverLetter:
        coverLetter instanceof Blob && coverLetter.size > 0
          ? "File attached"
          : "No cover letter provided",
      email,
      name,
      phone,
      position,
      resume:
        resume instanceof Blob && resume.size > 0
          ? "File attached"
          : "No resume provided",
      state: stateName,
      workEligibility: workEligibility ? "Yes" : "No",
      zipCode,
    });

    const { to: notificationTo } = await resolveFormNotificationRecipients({
      fallbackTo: fallbackNotificationTo,
      formId: res.formId,
    });

    const data = await resend.emails.send({
      attachments: attachments.length > 0 ? attachments : undefined,
      from: "Delmarva Site Development <mail@delmarvasite.net>",
      html: notificationEmail.html,
      replyTo: `${name} <${email}>`,
      subject: `New Job Application: ${name} for ${position}`,
      text: notificationEmail.text,
      to: notificationTo,
    });

    const delayConfirmationEmail = setTimeout(async () => {
      const confirmationEmail = await renderConfirmationEmail({
        locale: res.locale,
        name,
        position,
      });

      await resend.emails.send({
        from: "Delmarva Site Development <mail@delmarvasite.net>",
        html: confirmationEmail.html,
        subject: confirmationEmail.subject,
        text: confirmationEmail.text,
        to: email,
      });
    }, 500);

    if (data.error) {
      clearTimeout(delayConfirmationEmail);

      return Response.json({ error: data.error });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
