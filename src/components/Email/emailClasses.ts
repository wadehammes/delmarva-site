/** Tailwind class strings for Delmarva transactional emails (inlined by react-email). */
export const emailClasses = {
  applicantContact: "m-0 mb-2 p-0 text-sm leading-6 text-delmarva-text",
  applicantDetail: "m-0 mb-2 p-0 text-sm leading-6 text-delmarva-muted",
  applicantLead: "m-0 mb-2 p-0 text-lg font-semibold leading-7 text-white",
  body: "mx-auto bg-delmarva-bg font-sans",
  bullet: "m-0 p-0 text-sm leading-5 text-delmarva-text",
  bulletLast: "mb-6 mt-0 p-0 text-sm leading-5 text-delmarva-text",
  button:
    "box-border block w-full rounded bg-delmarva-red px-6 py-4 text-center text-sm font-semibold text-white no-underline",
  buttonCol: "align-top px-2",
  callout: "my-5 rounded-lg bg-delmarva-surface p-5",
  closing: "mb-2 mt-8 p-0 text-sm leading-6 text-white",
  container: "mx-auto max-w-[560px] px-4 py-3 pb-6",
  content: "my-4",
  footerText: "m-0 text-center text-sm text-delmarva-muted",
  footerWrapper: "mt-10 pt-0",
  heading: "m-0 mb-5 p-0 text-center text-xl font-bold text-white",
  hr: "mx-0 my-6 w-full",
  label:
    "m-0 mb-2 mt-6 p-0 text-xs font-semibold uppercase tracking-wide text-delmarva-muted",
  labelFirst:
    "m-0 mb-2 mt-0 p-0 text-xs font-semibold uppercase tracking-wide text-delmarva-muted",
  link: "text-delmarva-red underline",
  muted: "m-0 mb-0 p-0 text-sm text-delmarva-muted italic",
  paragraph: "mb-6 p-0 text-sm leading-7 text-delmarva-text",
  signoff: "m-0 p-0 text-sm leading-6 text-white",
  success: "font-bold text-delmarva-success",
  textBlockLast: "m-0 p-0 text-sm leading-6 text-delmarva-text",
} as const;
