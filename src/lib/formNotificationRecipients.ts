import { fetchFormRecipients } from "src/contentful/getFormEntry";
import { getNotificationTo } from "src/utils/emailHelpers";
import { EMAIL_VALIDATION_REGEX } from "src/utils/regex";

const sanitizeEmails = (emails: string[] | undefined): string[] => {
  if (!emails?.length) {
    return [];
  }

  return emails
    .map((email) => email.trim())
    .filter((email) => EMAIL_VALIDATION_REGEX.test(email));
};

export const resolveFormNotificationRecipients = async ({
  formId,
  fallbackTo,
}: {
  formId?: string;
  fallbackTo: string;
}): Promise<{ to: string | string[]; bcc?: string[] }> => {
  let toAddresses = [fallbackTo];
  let bccAddresses: string[] | undefined;

  if (formId) {
    const recipients = await fetchFormRecipients(formId);
    const notificationEmails = sanitizeEmails(
      recipients?.emailsToSendNotification,
    );

    if (notificationEmails.length > 0) {
      toAddresses = notificationEmails;
    }

    const bccEmails = sanitizeEmails(recipients?.emailsToBcc);
    if (bccEmails.length > 0) {
      bccAddresses = bccEmails;
    }
  }

  return {
    bcc: bccAddresses,
    to: getNotificationTo(toAddresses),
  };
};
