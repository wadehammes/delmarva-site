import { cached } from "src/contentful/cache";
import { cacheKeys } from "src/contentful/cacheKeys";
import { contentfulClient } from "src/contentful/client";
import { type FormEntry, parseContentfulForm } from "src/contentful/parseForm";
import {
  type FormJoinOurTeamEntry,
  parseFormJoinOurTeam,
} from "src/contentful/parseFormJoinOurTeam";
import { isTypeForm, isTypeFormJoinOurTeam } from "src/contentful/types";

export type ResolvedFormRecipients = {
  emailsToSendNotification: string[];
  emailsToBcc?: string[];
};

export async function fetchFormRecipients(
  formId: string,
): Promise<ResolvedFormRecipients | null> {
  if (!formId.trim()) {
    return null;
  }

  const { key, tags } = cacheKeys.formRecipients(formId);

  return cached({
    fn: async () => {
      const entry =
        await contentfulClient().withoutUnresolvableLinks.getEntry(formId);

      if (isTypeForm(entry)) {
        const parsed = parseContentfulForm(entry as FormEntry);
        if (!parsed) {
          return null;
        }

        return {
          emailsToBcc: parsed.emailsToBcc,
          emailsToSendNotification: parsed.emailsToSendNotification,
        };
      }

      if (isTypeFormJoinOurTeam(entry)) {
        const parsed = parseFormJoinOurTeam(entry as FormJoinOurTeamEntry);
        if (!parsed) {
          return null;
        }

        return {
          emailsToSendNotification: parsed.emailsToSendNotification ?? [],
        };
      }

      return null;
    },
    key,
    tags,
  });
}
