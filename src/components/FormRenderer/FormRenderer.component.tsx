import {
  GeneralInquiryForm,
  RequestAProposalForm,
} from "src/components/FormRenderer/FormRendererRegistry";
import type { FormType } from "src/contentful/parseForm";

interface FormRendererProps {
  fields: FormType;
}

export const FormRenderer = (props: FormRendererProps) => {
  const { fields } = props;

  switch (fields.formType) {
    case "General Inquiry Form": {
      return <GeneralInquiryForm fields={fields} />;
    }
    case "Request a Proposal Form": {
      return <RequestAProposalForm fields={fields} />;
    }
    default: {
      return null;
    }
  }
};
