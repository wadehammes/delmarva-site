# Transactional email templates

React Email 6 templates for Resend. Rendered via [`src/lib/emailRenderer.tsx`](../../lib/emailRenderer.tsx).

## Templates (preview + production)

| File | Audience |
|------|----------|
| `JoinOurTeamNotificationTemplate` | Team — new application |
| `JoinOurTeamConfirmationTemplate` | Applicant — receipt |
| `GeneralInquiryNotificationTemplate` | Team — inquiry |
| `RequestAProposalNotificationTemplate` | Team — RFP |

Each exports `default` + `PreviewProps` for `pnpm email:dev`.

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
```

See [`src/lib/README.md`](../../lib/README.md) for Resend env and logo URL behavior.
