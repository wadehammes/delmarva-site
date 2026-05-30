import "server-only";

import { Resend } from "resend";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "src/lib/emailRenderer";
import { sendResendFormEmail } from "src/lib/resendFormEmail";
import { US_STATES_MAP } from "src/utils/constants";
import {
  blobToBase64,
  getFileExtension,
  getMimeType,
} from "src/utils/emailHelpers";
import { FORM_FALLBACK_NOTIFICATION_TO } from "src/utils/formRoute.helpers";
import { verifyRecaptchaForForm } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";
import { isNonNullable } from "src/utils/value.helpers";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SubmitCareersApplicationResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

export const submitCareersApplication = async (
  res: JoinOurTeamInputs,
): Promise<SubmitCareersApplicationResult> => {
  if (res.website?.trim()) {
    console.warn("Spam detected (honeypot): Join Our Team form", {
      email: res.email,
      name: res.name,
      position: res.position,
    });
    return { id: "spam-blocked", ok: true };
  }

  const isRecaptchaValid = await verifyRecaptchaForForm(res.recaptchaToken);

  if (!isRecaptchaValid) {
    console.warn("Spam detected (reCAPTCHA failed): Join Our Team form", {
      email: res.email,
      name: res.name,
      position: res.position,
    });
    return { id: "spam-blocked", ok: true };
  }

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

  const combinedContent = [
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
    .join(" ");

  const spamCheck = isSpam({ email, message: combinedContent, name });

  if (spamCheck.isSpam) {
    console.warn("Spam detected (keywords): Join Our Team form", {
      email,
      name,
      position,
      reasons: spamCheck.reasons,
    });
    return { id: "spam-blocked", ok: true };
  }

  if (!email) {
    return { message: "Email is required", ok: false };
  }

  const attachments: Array<{
    filename: string;
    content: string;
    contentType: string;
  }> = [];

  if (resume instanceof Blob && resume.size > 0) {
    const resumeBase64 = await blobToBase64(resume);
    const resumeName = resume instanceof File ? resume.name : "resume.pdf";
    const resumeExtension = getFileExtension(resumeName);
    attachments.push({
      content: resumeBase64,
      contentType: getMimeType(resumeExtension),
      filename: `Resume_${name.replace(/\s+/g, "_")}.${resumeExtension}`,
    });
  }

  if (coverLetter instanceof Blob && coverLetter.size > 0) {
    const coverLetterBase64 = await blobToBase64(coverLetter);
    const coverLetterName =
      coverLetter instanceof File ? coverLetter.name : "cover-letter.pdf";
    const coverLetterExtension = getFileExtension(coverLetterName);
    attachments.push({
      content: coverLetterBase64,
      contentType: getMimeType(coverLetterExtension),
      filename: `CoverLetter_${name.replace(/\s+/g, "_")}.${coverLetterExtension}`,
    });
  }

  const notificationTo =
    res.emailsToSendNotification && res.emailsToSendNotification.length > 0
      ? res.emailsToSendNotification
      : FORM_FALLBACK_NOTIFICATION_TO;

  const [notificationEmail, confirmationEmail] = await Promise.all([
    renderNotificationEmail({
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
    }),
    renderConfirmationEmail({
      locale: res.locale,
      name,
      position,
    }),
  ]);

  const [notificationResult, confirmationResult] = await Promise.all([
    sendResendFormEmail(
      resend,
      {
        attachments: attachments.length > 0 ? attachments : undefined,
        from: "Delmarva Site Development <mail@delmarvasite.net>",
        html: notificationEmail.html,
        replyTo: `${name} <${email}>`,
        subject: `New Job Application: ${name} for ${position}`,
        text: notificationEmail.text,
      },
      notificationTo,
    ),
    sendResendFormEmail(
      resend,
      {
        from: "Delmarva Site Development <mail@delmarvasite.net>",
        html: confirmationEmail.html,
        subject: confirmationEmail.subject,
        text: confirmationEmail.text,
      },
      email,
    ),
  ]);

  if (notificationResult.error) {
    console.error(
      "Join Our Team notification send failed:",
      notificationResult.error,
    );
    const resendMessage =
      typeof notificationResult.error === "object" &&
      notificationResult.error &&
      "message" in notificationResult.error
        ? String(notificationResult.error.message)
        : "Notification email failed";
    return { message: resendMessage, ok: false };
  }

  if (confirmationResult.error) {
    console.error(
      "Join Our Team confirmation send failed:",
      confirmationResult.error,
    );
    const resendMessage =
      typeof confirmationResult.error === "object" &&
      confirmationResult.error &&
      "message" in confirmationResult.error
        ? String(confirmationResult.error.message)
        : "Confirmation email failed";
    return { message: resendMessage, ok: false };
  }

  return {
    id: notificationResult.data?.id ?? "sent",
    ok: true,
  };
};
