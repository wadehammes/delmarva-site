import { forwardRef, type SVGProps } from "react";

const SvgMock = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => <svg ref={ref} {...props} />,
);
SvgMock.displayName = "SvgMock";

export default SvgMock;
