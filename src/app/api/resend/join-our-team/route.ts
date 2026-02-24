import { Resend } from "resend";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "src/lib/emailRenderer";
import { US_STATES_MAP } from "src/utils/constants";
import {
  blobToBase64,
  getFileExtension,
  getMimeType,
  getNotificationTo,
} from "src/utils/emailHelpers";
import { isNonNullable } from "src/utils/helpers";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

const resend = new Resend(process.env.RESEND_API_KEY);

const fallbackNotificationTo = "w@dehammes.com";

function parseFormData(formData: FormData): JoinOurTeamInputs {
  const get = (key: string) => formData.get(key);
  const getString = (key: string) => (get(key) as string | null) ?? "";
  const workEligibilityRaw = getString("workEligibility");
  const workEligibility =
    workEligibilityRaw === "true" || workEligibilityRaw !== "false";
  const emailsRaw = get("emailsToSendNotification");
  const emailsToSendNotification =
    typeof emailsRaw === "string" && emailsRaw
      ? (JSON.parse(emailsRaw) as string[])
      : undefined;
  return {
    address: getString("address"),
    briefDescription: getString("briefDescription"),
    city: getString("city"),
    coverLetter: (get("coverLetter") as File | null) ?? null,
    email: getString("email"),
    emailsToSendNotification,
    name: getString("name"),
    phone: getString("phone"),
    position: getString("position"),
    recaptchaToken: getString("recaptchaToken"),
    resume: (get("resume") as File | null) ?? null,
    state: getString("state"),
    website: getString("website") || undefined,
    workEligibility,
    zipCode: getString("zipCode"),
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const res: JoinOurTeamInputs = contentType.includes("multipart/form-data")
    ? parseFormData(await request.formData())
    : await request.json();

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
    if (resume instanceof Blob && resume.size > 0) {
      try {
        const resumeBase64 = await blobToBase64(resume);
        const resumeName = resume instanceof File ? resume.name : "resume.pdf";
        const resumeExtension = getFileExtension(resumeName);
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
    if (coverLetter instanceof Blob && coverLetter.size > 0) {
      try {
        const coverLetterBase64 = await blobToBase64(coverLetter);
        const coverLetterName =
          coverLetter instanceof File ? coverLetter.name : "cover-letter.pdf";
        const coverLetterExtension = getFileExtension(coverLetterName);
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
      state: stateName, // Use the full state name
      workEligibility: workEligibility ? "Yes" : "No",
      zipCode,
    });

    const notificationTo = getNotificationTo(
      res.emailsToSendNotification && res.emailsToSendNotification.length > 0
        ? res.emailsToSendNotification
        : fallbackNotificationTo,
    );

    const data = await resend.emails.send({
      attachments: attachments.length > 0 ? attachments : undefined,
      from: "Delmarva Site Development <mail@delmarvasite.net>",
      html: notificationHtml,
      replyTo: `${name} <${email}>`,
      subject: `New Job Application: ${name} for ${position}`,
      text: `New job application received from ${name} for ${position}. Check the HTML version for full details.`,
      to: notificationTo,
    });

    const delayConfirmationEmail = setTimeout(async () => {
      const confirmationHtml = await renderConfirmationEmail({
        name,
        position,
      });

      await resend.emails.send({
        from: "Delmarva Site Development <mail@delmarvasite.net>",
        html: confirmationHtml,
        subject: `Application Received for ${position}`,
        text: `Hi ${name}, we've received your application for ${position}. We'll review it and get back to you soon.`,
        to: email,
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
