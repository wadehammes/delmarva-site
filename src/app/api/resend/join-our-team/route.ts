import { Resend } from "resend";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "src/lib/emailRenderer";
import { US_STATES_MAP } from "src/utils/constants";
import {
  fileToBase64,
  getFileExtension,
  getMimeType,
} from "src/utils/emailHelpers";
import { isNonNullable } from "src/utils/helpers";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res: JoinOurTeamInputs = await request.json();

  // Honeypot check - if website field is filled, it's likely a bot
  if (res.website && res.website.trim() !== "") {
    console.warn("Spam detected (honeypot): Join Our Team form", {
      email: res.email,
      name: res.name,
      position: res.position,
    });
    // Return success response to avoid alerting bots
    return Response.json({ id: "spam-blocked", message: "success" });
  }

  // Verify reCAPTCHA token
  const isRecaptchaValid = await verifyRecaptchaToken(res.recaptchaToken);

  if (!isRecaptchaValid) {
    console.warn("Spam detected (reCAPTCHA failed): Join Our Team form", {
      email: res.email,
      name: res.name,
      position: res.position,
    });
    // Return success response to avoid alerting bots
    return Response.json({ id: "spam-blocked", message: "success" });
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

  // Keyword-based spam detection
  // Combine all text fields for spam checking
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

  const spamCheck = isSpam({
    email,
    message: combinedContent,
    name,
  });

  if (spamCheck.isSpam) {
    console.warn("Spam detected (keywords): Join Our Team form", {
      email,
      name,
      position,
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
    // Prepare email attachments
    const attachments: Array<{
      filename: string;
      content: string;
      contentType: string;
    }> = [];

    // Add resume attachment if provided
    if (resume instanceof File && resume.size > 0) {
      try {
        const resumeBase64 = await fileToBase64(resume);
        const resumeExtension = getFileExtension(resume.name);
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

    // Add cover letter attachment if provided
    if (coverLetter instanceof File && coverLetter.size > 0) {
      try {
        const coverLetterBase64 = await fileToBase64(coverLetter);
        const coverLetterExtension = getFileExtension(coverLetter.name);
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

    // Render the notification email using React Email
    const notificationHtml = await renderNotificationEmail({
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
      resume:
        resume instanceof File && resume.size > 0
          ? "File attached"
          : "No resume provided",
      state: stateName, // Use the full state name
      workEligibility: workEligibility ? "Yes" : "No",
      zipCode,
    });

    const data = await resend.emails.send({
      attachments: attachments.length > 0 ? attachments : undefined,
      from: "Delmarva Site Development - New Application <forms@delmarvasite.com>",
      html: notificationHtml,
      replyTo: `${name} <${email}>`,
      subject: `New Job Application: ${name} for ${position}`,
      text: `New job application received from ${name} for ${position}. Check the HTML version for full details.`,
      to: "delivered+joinOurTeam@resend.dev",
    });

    const delayConfirmationEmail = setTimeout(async () => {
      const confirmationHtml = await renderConfirmationEmail({
        name,
        position,
      });

      await resend.emails.send({
        from: "Delmarva Site Development - <hello@delmarvasite.com>",
        html: confirmationHtml,
        subject: `Application Received for ${position}`,
        text: `Hi ${name}, we've received your application for ${position}. We'll review it and get back to you soon.`,
        to: "delivered+joinOurTeam@resend.dev",
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
