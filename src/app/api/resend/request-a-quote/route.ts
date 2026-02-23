import { Resend } from "resend";
import type { RequestAQuoteInputs } from "src/components/RequestAQuoteForm/RequestAQuoteForm.component";
import { renderRequestAQuoteNotificationEmail } from "src/lib/emailRenderer";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res: RequestAQuoteInputs = await request.json();

  // Honeypot check - if website field is filled, it's likely a bot
  if (res.website && res.website.trim() !== "") {
    console.warn("Spam detected (honeypot): Request A Quote form", {
      email: res.email,
      name: res.name,
    });
    // Return success response to avoid alerting bots
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  // Verify reCAPTCHA token
  const isRecaptchaValid = await verifyRecaptchaToken(res.recaptchaToken);

  if (!isRecaptchaValid) {
    console.warn("Spam detected (reCAPTCHA failed): Request A Quote form", {
      email: res.email,
      name: res.name,
    });
    // Return success response to avoid alerting bots
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const companyName = res.companyName || "No company provided.";
  const projectDetails = res.projectDetails || "No details provided.";

  // Keyword-based spam detection
  // Combine all text fields for spam checking
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
    console.warn("Spam detected (keywords): Request A Quote form", {
      email,
      name,
      reasons: spamCheck.reasons,
    });
    // Return success response to avoid alerting bots
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  if (!email) {
    return new Response("no to: email provided", {
      status: 404,
    });
  }

  try {
    const notificationHtml = await renderRequestAQuoteNotificationEmail({
      companyName,
      email,
      name,
      phone,
      projectDetails,
    });

    const data = await resend.emails.send({
      from: "Delmarva Site Development <no-reply@delmarvasite.net>",
      html: notificationHtml,
      replyTo: `${name} <${email}>`,
      subject: `New Quote Request: ${companyName} — ${name}`,
      text: `New quote request received from ${name} at ${companyName}.`,
      to: "w@dehammes.com",
    });

    if (data.error) {
      return Response.json({ error: data.error });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
