import { ServiceProvider } from "src/components/Service/ServiceProvider";
import type { ServiceType } from "src/contentful/getServices";

interface ServiceComponentProps {
  service: ServiceType;
}

export const ServiceComponent = (props: ServiceComponentProps) => {
  const { service } = props;

  // Guard against undefined service
  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <ServiceProvider service={service}>
      <div>{service.serviceName}</div>
    </ServiceProvider>
  );
};

export default ServiceComponent;
