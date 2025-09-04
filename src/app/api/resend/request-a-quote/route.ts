import { Resend } from "resend";
import type { RequestAQuoteInputs } from "src/components/RequestAQuoteForm/RequestAQuoteForm.component";
import { renderRequestAQuoteNotificationEmail } from "src/lib/emailRenderer";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res: RequestAQuoteInputs = await request.json();

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const companyName = res.companyName || "No company provided.";
  const projectDetails = res.projectDetails || "No details provided.";

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
      from: "Delmarva Site Development - Quote Request <forms@delmarvasite.com>",
      html: notificationHtml,
      replyTo: `${name} <${email}>`,
      subject: `New Quote Request: ${companyName} — ${name}`,
      text: `New quote request received from ${name} at ${companyName}.`,
      to: "delivered+requestAQuote@resend.dev",
    });

    if (data.error) {
      return Response.json({ error: data.error });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
