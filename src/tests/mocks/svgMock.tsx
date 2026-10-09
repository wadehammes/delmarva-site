import type { Ref, SVGProps } from "react";

const SvgMock = ({
  ref,
  ...props
}: SVGProps<SVGSVGElement> & { ref?: Ref<SVGSVGElement> }) => (
  <svg ref={ref} {...props} />
);

export default SvgMock;
