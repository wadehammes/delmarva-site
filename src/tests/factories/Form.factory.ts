import { faker } from "@faker-js/faker";
import type { FormType } from "src/contentful/parseForm";
import { BaseFactory } from "src/tests/factories/BaseFactory";
import type { KeysMatch } from "src/types/KeysMatch";

type FormFactoryOptions = Record<string, never>;

const FORM_TYPES = [
  "General Inquiry Form",
  "Request a Proposal Form",
] as FormType["formType"][];

class FormFactory extends BaseFactory<FormType, FormFactoryOptions> {
  build(attributes?: Partial<FormType>, _options?: FormFactoryOptions) {
    const instance = {
      emailsToBcc: [faker.internet.email()],
      emailsToSendNotification: [faker.internet.email()],
      formType: faker.helpers.arrayElement(FORM_TYPES),
      id: faker.string.uuid(),
    } satisfies FormType;

    const factoryBuilt: FormType = {
      ...instance,
      ...(attributes ?? {}),
    };

    const _allKeysMustBeInTheInstance: KeysMatch<FormType, typeof instance> =
      undefined;

    return factoryBuilt;
  }
}

export const formFactory = new FormFactory();
