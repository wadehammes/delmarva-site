import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "src/tests/testUtils";
import { DeployButton } from "./DeployButton.component";

export interface DeployButtonProps {
  accessToken?: string;
  label: string;
  target: "staging" | "production";
}

export class DeployButtonPO extends BasePageObject {
  setupApiMocks() {
    return undefined;
  }

  render(props?: Partial<DeployButtonProps>) {
    const mergedProps = { ...this.defaultProps, ...props };
    return render(<DeployButton {...mergedProps} />);
  }

  private defaultProps: DeployButtonProps = {
    label: "Deploy Test",
    target: "staging",
  };
}
