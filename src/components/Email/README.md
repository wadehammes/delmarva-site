# Transactional email templates

React Email 6 templates for Resend. Rendered via [`src/lib/emailRenderer.tsx`](../../lib/emailRenderer.tsx).

## Templates (preview + production)

| File | Audience |
|------|----------|
| `JoinOurTeamNotificationTemplate` | Team — new application |
| `JoinOurTeamConfirmationTemplate` | Applicant — receipt (English preview) |
| `JoinOurTeamConfirmationTemplateEs` | Same template — Spanish preview (`pnpm email:dev`) |
| `GeneralInquiryNotificationTemplate` | Team — inquiry |
| `RequestAProposalNotificationTemplate` | Team — RFP |

Each exports `default` + `PreviewProps` for `pnpm email:dev`.

**Applicant confirmation** (`JoinOurTeamConfirmationTemplate`) is localized: copy comes from `JoinOurTeamConfirmationEmail` in `src/i18n/messages/` via [`emailTranslations.ts`](../../lib/emailTranslations.ts). The form sends `locale` (`en` | `es`); team notification emails stay English.

In **`pnpm email:dev`**, open **JoinOurTeamConfirmationTemplate** for English or **JoinOurTeamConfirmationTemplateEs** for Spanish (separate sidebar entry; React Email supports one `PreviewProps` per file).

## Shared components

| Component | Role |
|-----------|------|
| `EmailLayout` | `Html`, `Head`, `Preview`, `Tailwind`, `Body`, `Container` |
| `EmailHeader` / `EmailFooter` | Logo + site link |
| `EmailSection` | Uppercase section label + children |
| `EmailFieldBlock` | Label + body text |
| `EmailHighlightedField` | Emphasized field (e.g. work eligibility) |
| `EmailDocumentField` | Resume / cover letter |
| `EmailDivider` | Dashed section break (`#404040`) |
| `EmailContactLinks` | Email · phone links |
| `EmailQuickActions` | Reply / Call callout |

## Theming

- [`emailTheme.ts`](emailTheme.ts) — brand colors + Tailwind config
- [`emailClasses.ts`](emailClasses.ts) — class strings (`delmarva-*` utilities)
- [`emailDocumentConstants.ts`](emailDocumentConstants.ts) — empty / attachment sentinel strings
- [`emailPreviewProps.ts`](emailPreviewProps.ts) — sample data for dev preview

## Commands

```bash
pnpm email:dev      # http://localhost:3030
pnpm email:export   # out/emails/*.html (CI)
pnpm email:resend:setup
pnpm test:ci -- src/lib/emailTranslations.test.ts src/lib/emailRenderer.test.ts
```

**Tests:** [`emailTranslations.test.ts`](../../lib/emailTranslations.test.ts) covers locale parsing and `en`/`es` copy (including message-key parity). [`emailRenderer.test.ts`](../../lib/emailRenderer.test.ts) verifies confirmation subjects and the html + plain-text render path (with `react-email` mocked in Jest).

See [`src/lib/README.md`](../../lib/README.md) for form routes, Resend env, test recipients, and logo URL behavior.
