import "server-only";

import type { CreateEmailOptions, Resend } from "resend";
import { resolveResendRecipients } from "src/utils/emailHelpers";

type SendEmailPayload = Parameters<Resend["emails"]["send"]>[0];
type SendEmailPayloadWithoutTo = Omit<SendEmailPayload, "to">;

/** Sends form email; redirects recipients on local/staging via `resolveResendRecipients`. */
export async function sendResendFormEmail(
  resend: Resend,
  payload: SendEmailPayloadWithoutTo,
  productionTo: string | string[],
) {
  return resend.emails.send({
    ...payload,
    to: resolveResendRecipients(productionTo),
  } as CreateEmailOptions);
}
