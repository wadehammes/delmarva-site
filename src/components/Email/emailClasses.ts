/** Tailwind class strings for Delmarva transactional emails (inlined by react-email). */
export const emailClasses = {
  body: "mx-auto bg-delmarva-bg font-sans",
  bullet: "m-0 p-0 text-sm leading-5 text-delmarva-text",
  bulletLast: "mb-6 mt-0 p-0 text-sm leading-5 text-delmarva-text",
  button:
    "box-border block w-full rounded bg-delmarva-red px-6 py-4 text-center text-sm font-semibold text-white no-underline",
  buttonCol: "align-top px-2",
  callout: "my-5 rounded-lg bg-delmarva-surface p-5",
  closing: "mb-2 mt-8 p-0 text-sm leading-6 text-delmarva-muted",
  contact: "mb-4 p-0 text-sm leading-6 text-delmarva-text",
  container: "mx-auto max-w-[560px] px-4 py-3 pb-6",
  content: "my-4",
  footerText: "m-0 text-center text-sm text-delmarva-muted",
  footerWrapper: "mt-10 pt-0",
  heading: "m-0 mb-5 p-0 text-center text-xl font-bold text-white",
  label:
    "m-0 mb-4 mt-8 p-0 text-xs font-semibold uppercase tracking-wide text-delmarva-muted",
  lead: "m-0 mb-3 p-0 text-lg font-semibold leading-7 text-white",
  link: "text-delmarva-red underline",
  meta: "m-0 mb-4 p-0 text-sm leading-6 text-delmarva-muted",
  muted: "mb-4 text-sm text-delmarva-muted italic",
  paragraph: "mb-6 p-0 text-sm leading-7 text-delmarva-text",
  signoff: "m-0 p-0 text-sm leading-6 text-delmarva-muted",
  success: "font-bold text-delmarva-success",
  textBlockLast: "m-0 p-0 text-sm leading-6 text-delmarva-text",
} as const;
