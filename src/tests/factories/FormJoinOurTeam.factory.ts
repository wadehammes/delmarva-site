import { BLOCKS, type Document } from "@contentful/rich-text-types";
import { faker } from "@faker-js/faker";
import type { FormJoinOurTeamType } from "src/contentful/parseFormJoinOurTeam";
import { BaseFactory } from "src/tests/factories/BaseFactory";
import type { KeysMatch } from "src/types/KeysMatch";

type FormJoinOurTeamFactoryOptions = Record<string, never>;

const OPEN_JOB_TITLES = [
  "Project Engineer",
  "Project Manager",
  "Estimator",
] as const;

function plainTextDocument(text: string): Document {
  return {
    content: [
      {
        content: [
          {
            data: {},
            marks: [],
            nodeType: "text",
            value: text,
          },
        ],
        data: {},
        nodeType: BLOCKS.PARAGRAPH,
      },
    ],
    data: {},
    nodeType: BLOCKS.DOCUMENT,
  };
}

class FormJoinOurTeamFactory extends BaseFactory<
  FormJoinOurTeamType,
  FormJoinOurTeamFactoryOptions
> {
  build(
    attributes?: Partial<FormJoinOurTeamType>,
    _options?: FormJoinOurTeamFactoryOptions,
  ) {
    const instance = {
      description: undefined,
      emailsToSendNotification: [faker.internet.email()],
      formSubmitSuccessMessage: plainTextDocument(faker.lorem.sentence()),
      id: faker.string.uuid(),
      openJobs: [
        faker.helpers.arrayElement(OPEN_JOB_TITLES),
        faker.helpers.arrayElement(OPEN_JOB_TITLES),
      ],
    } satisfies FormJoinOurTeamType;

    const factoryBuilt: FormJoinOurTeamType = {
      ...instance,
      ...(attributes ?? {}),
    };

    const _allKeysMustBeInTheInstance: KeysMatch<
      FormJoinOurTeamType,
      typeof instance
    > = undefined;

    return factoryBuilt;
  }
}

export const formJoinOurTeamFactory = new FormJoinOurTeamFactory();
