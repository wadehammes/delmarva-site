import { Resend } from "resend";
import type { RequestAProposalInputs } from "src/components/RequestAProposalForm/RequestAProposalForm.component";
import { renderRequestAProposalNotificationEmail } from "src/lib/emailRenderer";
import { resolveFormNotificationRecipients } from "src/lib/formNotificationRecipients";
import {
  checkFormSubmissionSpam,
  createSpamBlockedResponse,
  logBlockedFormSubmission,
} from "src/utils/formSpamProtection";

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";
const formName = "Request A Proposal form";

export async function POST(request: Request) {
  const res: RequestAProposalInputs = await request.json();

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

  if (!email) {
    return new Response("no to: email provided", {
      status: 404,
    });
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
      return Response.json({ error: data.error });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
