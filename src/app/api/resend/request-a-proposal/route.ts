import { Resend } from "resend";
import type { RequestAProposalInputs } from "src/components/RequestAProposalForm/RequestAProposalForm.component";
import { renderRequestAProposalNotificationEmail } from "src/lib/emailRenderer";
import { getNotificationTo } from "src/utils/emailHelpers";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";

export async function POST(request: Request) {
  const res: RequestAProposalInputs = await request.json();

  if (res.website && res.website.trim() !== "") {
    console.warn("Spam detected (honeypot): Request A Proposal form", {
      email: res.email,
      name: res.name,
    });
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  const isRecaptchaValid = await verifyRecaptchaToken(res.recaptchaToken);

  if (!isRecaptchaValid) {
    console.warn("Spam detected (reCAPTCHA failed): Request A Proposal form", {
      email: res.email,
      name: res.name,
    });
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const companyName = res.companyName || "No company provided.";
  const projectDetails = res.projectDetails || "No details provided.";

  const combinedContent = [name, companyName, email, phone, projectDetails]
    .filter(Boolean)
    .join(" ");

  const spamCheck = isSpam({
    companyName,
    email,
    message: combinedContent,
    name,
  });

  if (spamCheck.isSpam) {
    console.warn("Spam detected (keywords): Request A Proposal form", {
      email,
      name,
      reasons: spamCheck.reasons,
    });
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  if (!email) {
    return new Response("no to: email provided", {
      status: 404,
    });
  }

  const toAddresses = res.emailsToSendNotification?.length
    ? res.emailsToSendNotification
    : [fallbackNotificationTo];

  const to = getNotificationTo(toAddresses);

  try {
    const notificationHtml = await renderRequestAProposalNotificationEmail({
      companyName,
      email,
      name,
      phone,
      projectDetails,
    });

    const data = await resend.emails.send({
      bcc: res.emailsToBcc,
      from: "Delmarva Site Development <mail@delmarvasite.net>",
      html: notificationHtml,
      replyTo: `${name} <${email}>`,
      subject: `Request for Proposal: ${companyName} — ${name}`,
      text: `Request for Proposal received from ${name} at ${companyName}.`,
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
