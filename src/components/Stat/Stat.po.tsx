import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "src/tests/testUtils";
import { Stat, type StatProps } from "./Stat.component";

export class StatPO extends BasePageObject {
  private defaultProps: StatProps = {
    stat: {
      description: "Test description",
      type: "Numerical",
      value: 1000,
    },
  };

  render(props?: Partial<StatProps>) {
    const mergedProps = { ...this.defaultProps, ...props };
    return render(<Stat {...mergedProps} />);
  }
}
