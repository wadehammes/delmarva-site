import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "src/tests/testUtils";
import { Stat, type StatProps } from "./Stat.component";

export class StatPO extends BasePageObject {
  private defaultProps: StatProps = {
    value: 1000,
    description: "Test description",
  };

  render(props?: Partial<StatProps>) {
    const mergedProps = { ...this.defaultProps, ...props };
    return render(<Stat {...mergedProps} />);
  }
}
