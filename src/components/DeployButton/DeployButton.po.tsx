import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "src/tests/testUtils";
import { DeployButton } from "./DeployButton.component";

export interface DeployButtonProps {
  deployHook: string;
  label: string;
}

export class DeployButtonPO extends BasePageObject {
  public mockDeploy = jest.fn();

  setupApiMocks() {
    this.mockDeploy.mockResolvedValue({ ok: true });
  }

  render(props?: Partial<DeployButtonProps>) {
    const mergedProps = { ...this.defaultProps, ...props };
    return render(<DeployButton {...mergedProps} />);
  }

  private defaultProps: DeployButtonProps = {
    deployHook: "https://api.vercel.com/v1/integrations/deploy/test",
    label: "Deploy Test",
  };
}
