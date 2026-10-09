import { Resend } from "resend";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "src/lib/emailRenderer";
import { resolveFormNotificationRecipients } from "src/lib/formNotificationRecipients";
import { parseJoinOurTeamPostRequest } from "src/lib/forms/joinOurTeamPostRequest";
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

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";
const formName = "Join Our Team form";

const buildAttachment = async (
  file: File,
  filenamePrefix: string,
  applicantName: string,
) => {
  const resumeBase64 = await blobToBase64(file);
  const extension = getFileExtension(file.name);

  return {
    content: resumeBase64,
    contentType: getMimeType(extension),
    filename: `${filenamePrefix}_${applicantName.replace(/\s+/g, "_")}.${extension}`,
  };
};

export async function POST(request: Request) {
  const parsedRequest = await parseJoinOurTeamPostRequest(request);

  if (!parsedRequest.success) {
    return Response.json(
      { error: parsedRequest.error },
      { status: parsedRequest.status },
    );
  }

  const { api: res, coverLetter, resume } = parsedRequest.data;

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const briefDescription = res.briefDescription || "No message provided.";
  const address = res.address || "No address provided.";
  const city = res.city || "No city provided.";
  const stateCode = res.state ?? "";
  const stateName = US_STATES_MAP[stateCode] || stateCode;
  const zipCode = res.zipCode || "No zip code provided.";
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

  try {
    const attachments = [
      await buildAttachment(resume, "Resume", name),
      ...(coverLetter instanceof File && coverLetter.size > 0
        ? [await buildAttachment(coverLetter, "CoverLetter", name)]
        : []),
    ];

    const notificationEmail = await renderNotificationEmail({
      address,
      briefDescription,
      city,
      coverLetter:
        coverLetter instanceof File && coverLetter.size > 0
          ? "File attached"
          : "No cover letter provided",
      email,
      name,
      phone,
      position,
      resume: "File attached",
      state: stateName,
      workEligibility: "Yes",
      zipCode,
    });

    const { to: notificationTo } = await resolveFormNotificationRecipients({
      fallbackTo: fallbackNotificationTo,
      formId: res.formId,
    });

    const data = await resend.emails.send({
      attachments,
      from: "Delmarva Site Development <mail@delmarvasite.net>",
      html: notificationEmail.html,
      replyTo: `${name} <${email}>`,
      subject: `New Job Application: ${name} for ${position}`,
      text: notificationEmail.text,
      to: notificationTo,
    });

    if (data.error) {
      return Response.json({ error: data.error }, { status: 502 });
    }

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

    return Response.json(data);
  } catch (error) {
    console.error(`[${formName}] Resend send failed:`, error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
