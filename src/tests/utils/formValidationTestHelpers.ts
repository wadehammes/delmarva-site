import userEvent from "@testing-library/user-event";
import { screen } from "src/tests/testUtils";

export const expectEmptySubmitShowsRequiredErrors = async (options: {
  firstRequiredLabel: string;
  mockSubmit: jest.Mock;
  renderForm: () => void;
  submitButtonName: string;
}) => {
  const user = userEvent.setup();
  options.renderForm();

  const firstField = screen.getByLabelText(options.firstRequiredLabel);
  expect(firstField.closest("[data-invalid]")).toBeNull();

  await user.click(
    screen.getByRole("button", { name: options.submitButtonName }),
  );

  expect(firstField.closest("[data-invalid]")).toBeTruthy();
  expect(firstField.parentElement?.className).toMatch(/inputHasError/);
  expect(screen.getAllByText("messages.fieldRequired").length).toBeGreaterThan(
    0,
  );
  expect(options.mockSubmit).not.toHaveBeenCalled();
};
