import { api } from "src/api/urls";
import type { FormJoinOurTeamType } from "src/contentful/parseFormJoinOurTeam";
import { BasePageObject } from "src/tests/basePageObject.po";
import { formJoinOurTeamFactory } from "src/tests/factories/FormJoinOurTeam.factory";
import { render } from "src/tests/testUtils";
import { JoinOurTeam } from "./JoinOurTeamForm.component";

jest.mock("src/utils/publicEnv", () => ({
  getRecaptchaSiteKey: jest.fn(() => "test-site-key"),
}));

export class JoinOurTeamFormPO extends BasePageObject {
  fields: FormJoinOurTeamType = formJoinOurTeamFactory.build();
  mockJoinOurTeam = jest.fn().mockResolvedValue({});

  setupMocks() {
    this.mockJoinOurTeam.mockReset().mockResolvedValue({});
    jest.spyOn(api, "joinOurTeam").mockImplementation(this.mockJoinOurTeam);
  }

  render(fieldsOverrides?: Partial<FormJoinOurTeamType>) {
    this.fields = formJoinOurTeamFactory.build(fieldsOverrides);
    return render(<JoinOurTeam fields={this.fields} />);
  }
}
