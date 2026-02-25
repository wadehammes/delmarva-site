import dynamic from "next/dynamic";

export const GeneralInquiryForm = dynamic(
  () =>
    import(
      "src/components/GeneralInquiryForm/GeneralInquiryForm.component"
    ).then((m) => ({ default: m.GeneralInquiryForm })),
  { ssr: true },
);

export const RequestAProposalForm = dynamic(
  () =>
    import(
      "src/components/RequestAProposalForm/RequestAProposalForm.component"
    ).then((m) => ({ default: m.RequestAProposalForm })),
  { ssr: true },
);
