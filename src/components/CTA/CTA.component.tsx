import { ButtonLink } from "src/components/ButtonLink/ButtonLink.component";
import type { Cta } from "src/contentful/parseCta";
import { createInternalLink } from "src/utils/urlHelpers";

interface CTAProps {
  cta: Cta;
  size?: "small" | "medium" | "large";
  buttonStyle?: "solid" | "outline";
}

export const CTA = (props: CTAProps) => {
  const { cta, size = "medium", buttonStyle = "solid" } = props;
  let url = cta?.externalLink;

  if (!url && cta.pageLink) {
    url = createInternalLink(cta.pageLink);
  }

  if (!url) {
    return null;
  }

  return (
    <ButtonLink
      href={url}
      label={cta.text}
      size={size}
      buttonStyle={buttonStyle}
      event={`Clicked ${cta.text} CTA Button`}
    />
  );
};

export default CTA;
