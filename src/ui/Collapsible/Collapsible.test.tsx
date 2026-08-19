import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "src/ui/Collapsible/Collapsible.component";

describe("Collapsible", () => {
  it("opens the panel when the trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CollapsibleRoot>
        <CollapsibleTrigger>Section</CollapsibleTrigger>
        <CollapsiblePanel>Panel content</CollapsiblePanel>
      </CollapsibleRoot>,
    );

    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Section" }));

    expect(screen.getByText("Panel content")).toBeVisible();
  });
});
