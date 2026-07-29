declare module "*.svg" {
  import type { JSX, SVGProps } from "react";

  const SVG: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export default SVG;
}
