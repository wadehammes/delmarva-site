import { Resend } from "resend";
import type { GeneralInquiryInputs } from "src/components/GeneralInquiryForm/GeneralInquiryForm.component";
import { renderGeneralInquiryNotificationEmail } from "src/lib/emailRenderer";
import { sendResendFormEmail } from "src/lib/resendFormEmail";
import { resolveResendBcc } from "src/utils/emailHelpers";
import { FORM_FALLBACK_NOTIFICATION_TO } from "src/utils/formRoute.helpers";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res: GeneralInquiryInputs = await request.json();

  if (res.website && res.website.trim() !== "") {
    console.warn("Spam detected (honeypot): General Inquiry form", {
      email: res.email,
      name: res.name,
    });
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  const isRecaptchaValid = await verifyRecaptchaToken(res.recaptchaToken);

  if (!isRecaptchaValid) {
    console.warn("Spam detected (reCAPTCHA failed): General Inquiry form", {
      email: res.email,
      name: res.name,
    });
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const message = res.message || "No message provided.";

  const combinedContent = [name, email, phone, message]
    .filter(Boolean)
    .join(" ");

  const spamCheck = isSpam({
    companyName: "",
    email,
    message: combinedContent,
    name,
  });

  if (spamCheck.isSpam) {
    console.warn("Spam detected (keywords): General Inquiry form", {
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
    : [FORM_FALLBACK_NOTIFICATION_TO];

  try {
    const notificationEmail = await renderGeneralInquiryNotificationEmail({
      email,
      message,
      name,
      phone,
    });

    const data = await sendResendFormEmail(
      resend,
      {
        bcc: resolveResendBcc(res.emailsToBcc),
        from: "Delmarva Site Development <mail@delmarvasite.net>",
        html: notificationEmail.html,
        replyTo: `${name} <${email}>`,
        subject: `General Inquiry: ${name}`,
        text: notificationEmail.text,
      },
      toAddresses,
    );

    if (data.error) {
      console.error("General inquiry send failed:", data.error);
      return Response.json({ error: data.error }, { status: 502 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("General inquiry form error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error sending email",
      },
      { status: 500 },
    );
  }
}
