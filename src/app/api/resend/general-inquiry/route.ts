import { Resend } from "resend";
import type { GeneralInquiryInputs } from "src/components/GeneralInquiryForm/GeneralInquiryForm.component";
import { renderGeneralInquiryNotificationEmail } from "src/lib/emailRenderer";
import { resolveFormNotificationRecipients } from "src/lib/formNotificationRecipients";
import {
  checkFormSubmissionSpam,
  createSpamBlockedResponse,
  logBlockedFormSubmission,
} from "src/utils/formSpamProtection";

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";
const formName = "General Inquiry form";

export async function POST(request: Request) {
  const res: GeneralInquiryInputs = await request.json();

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const message = res.message || "No message provided.";

  const spamCheck = await checkFormSubmissionSpam({
    formStartedAt: res.formStartedAt,
    honeypot: res.website,
    recaptchaToken: res.recaptchaToken,
    spamContent: {
      companyName: "",
      email,
      message: [name, email, phone, message].filter(Boolean).join(" "),
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
    const notificationEmail = await renderGeneralInquiryNotificationEmail({
      email,
      message,
      name,
      phone,
    });

    const data = await resend.emails.send({
      bcc: bcc?.length ? bcc : undefined,
      from: "Delmarva Site Development <mail@delmarvasite.net>",
      html: notificationEmail.html,
      replyTo: `${name} <${email}>`,
      subject: `General Inquiry: ${name}`,
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
