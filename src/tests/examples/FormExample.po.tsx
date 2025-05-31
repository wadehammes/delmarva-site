import { BasePageObject } from "src/tests/basePageObject.po";
import { FormExample } from "src/tests/examples/FormExample.component";
import { render } from "src/tests/testUtils";

export interface FormExampleProps {
  onSubmit?: (data: { name: string; email: string }) => Promise<void>;
}

export class FormExamplePO extends BasePageObject {
  public mockSubmit = jest.fn();

  setupApiMocks() {
    this.mockSubmit.mockResolvedValue(undefined);
  }

  render(props?: Partial<FormExampleProps>) {
    const mergedProps = {
      onSubmit: this.mockSubmit,
      ...props,
    };
    return render(<FormExample {...mergedProps} />);
  }
}
