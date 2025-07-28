import { ButtonLink } from "src/components/ButtonLink/ButtonLink.component";
import type { Cta } from "src/contentful/parseCta";
import { parseCtaUrl } from "src/utils/urlHelpers";

interface CTAProps {
  cta: Cta;
  buttonVariant?: "primary" | "secondary";
}

export const CTA = (props: CTAProps) => {
  const { cta, buttonVariant = "primary" } = props;
  const url = parseCtaUrl(cta);

  if (!url) {
    return null;
  }

  return (
    <ButtonLink
      data-tracking-click={`Clicked ${cta.text} CTA Button`}
      href={url}
      label={cta.text}
      variant={buttonVariant}
    />
  );
};

export default CTA;
