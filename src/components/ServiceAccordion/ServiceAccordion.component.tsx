import { Accordion } from "src/components/Accordion/Accordion.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ServiceType } from "src/contentful/getServices";

interface ServiceAccordionProps {
  service: ServiceType;
}

export const ServiceAccordion = (props: ServiceAccordionProps) => {
  const { service } = props;

  return (
    <Accordion headerElement="h3" title={service.serviceName}>
      <RichText document={service.description} />
    </Accordion>
  );
};
