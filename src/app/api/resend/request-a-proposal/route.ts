import { Resend } from "resend";
import { renderRequestAProposalNotificationEmail } from "src/lib/emailRenderer";
import { resolveFormNotificationRecipients } from "src/lib/formNotificationRecipients";
import { requestAProposalApiSchema } from "src/lib/forms/requestAProposalForm.schema";
import {
  checkFormSubmissionSpam,
  createSpamBlockedResponse,
  logBlockedFormSubmission,
} from "src/utils/formSpamProtection";

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";
const formName = "Request A Proposal form";

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = requestAProposalApiSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const res = parsed.data;
  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const companyName = res.companyName || "No company provided.";
  const projectDetails = res.projectDetails || "No details provided.";

  const spamCheck = await checkFormSubmissionSpam({
    formStartedAt: res.formStartedAt,
    honeypot: res.website,
    recaptchaToken: res.recaptchaToken,
    spamContent: {
      companyName,
      email,
      message: [name, companyName, email, phone, projectDetails]
        .filter(Boolean)
        .join(" "),
      name,
    },
  });

  if (!spamCheck.allowed) {
    logBlockedFormSubmission(formName, spamCheck, { email, name });
    return createSpamBlockedResponse();
  }

  const { to, bcc } = await resolveFormNotificationRecipients({
    fallbackTo: fallbackNotificationTo,
    formId: res.formId,
  });

  try {
    const notificationEmail = await renderRequestAProposalNotificationEmail({
      companyName,
      email,
      name,
      phone,
      projectDetails,
    });

    const data = await resend.emails.send({
      bcc: bcc?.length ? bcc : undefined,
      from: "Delmarva Site Development <mail@delmarvasite.net>",
      html: notificationEmail.html,
      replyTo: `${name} <${email}>`,
      subject: `Request for Proposal: ${companyName} — ${name}`,
      text: notificationEmail.text,
      to,
    });

    if (data.error) {
      return Response.json({ error: data.error }, { status: 502 });
    }

    return Response.json(data);
  } catch (error) {
    console.error(`[${formName}] Resend send failed:`, error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
