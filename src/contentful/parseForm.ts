import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  isTypeForm,
  type TypeFormFields,
  type TypeFormWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type FormTypeType = ExtractSymbolType<TypeFormFields["formType"]>;

export interface FormType {
  id: string;
  formType: FormTypeType;
  emailsToSendNotification: string[];
  emailsToBcc?: string[];
}

const _validateFormCheck: ContentfulTypeCheck<FormType, TypeFormFields, "id"> =
  true;

export type FormEntry = TypeFormWithoutUnresolvableLinksResponse | undefined;

export function parseContentfulForm(form: FormEntry): FormType | null {
  if (!form || !isTypeForm(form)) {
    return null;
  }

  return {
    emailsToBcc: form.fields.emailsToBcc,
    emailsToSendNotification: form.fields.emailsToSendNotification,
    formType: form.fields.formType,
    id: form.sys.id,
  };
}
