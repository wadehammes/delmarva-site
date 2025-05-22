import type { HTMLAttributes } from "react";
import type { SectionType } from "src/contentful/parseSections";
import { isReactNodeEmptyArray } from "src/utils/helpers";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  id: string;
  section?: SectionType | null;
  style?: React.CSSProperties;
}

export const Section = async (props: SectionProps) => {
  const { children, style, id } = props;

  return (
    <section id={id} style={style}>
      {!isReactNodeEmptyArray(children) ? <div>{children}</div> : null}
    </section>
  );
};
