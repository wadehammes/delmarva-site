import type { CSSProperties } from "react";
import { Hr } from "react-email";
import { emailClasses } from "./emailClasses";
import { emailBrand } from "./emailTheme";

const dividerStyle: CSSProperties = {
  appearance: "none",
  border: "none",
  borderTop: `1px dashed ${emailBrand.divider}`,
  height: 0,
  width: "100%",
};

/** Subtle section break between blocks in notification emails. */
export function EmailDivider() {
  return <Hr className={emailClasses.hr} style={dividerStyle} />;
}
