import { ButtonLink } from "src/components/Button/ButtonLink.component";
import type { Cta } from "src/contentful/parseCta";
import { parseCtaUrl } from "src/utils/urlHelpers";

interface CTAProps {
  cta: Cta;
  className?: string;
}

export const CTA = (props: CTAProps) => {
  const { cta, className } = props;
  const url = parseCtaUrl(cta);

  if (!url) {
    return null;
  }

  const { variant, arrow } = cta;

  const buttonVariant = variant === "Primary" ? "primary" : "secondary";

  return (
    <ButtonLink
      arrow={arrow}
      className={className}
      data-tracking-click={`Clicked ${cta.text} CTA Button`}
      href={url}
      label={cta.text}
      variant={buttonVariant}
    />
  );
};

export default CTA;
