"use client";

import { Link } from "src/i18n/routing";
import { SERVICES_PAGE_SLUG } from "src/utils/constants";
import { hexToRgba } from "src/utils/mapUtils";
import type { ServiceArea } from "src/utils/serviceAreaUtils";
import styles from "./AreasServicedList.module.css";

interface AreasServicedListProps {
  className?: string;
  serviceAreas: ServiceArea[];
}

/**
 * Client component that displays a list of counties grouped by service
 */
export const AreasServicedList = ({
  className,
  serviceAreas,
}: AreasServicedListProps) => {
  if (serviceAreas.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <ul className={styles.serviceList}>
        {serviceAreas.map((serviceArea) => (
          <ServiceItem
            key={serviceArea.serviceSlug}
            serviceArea={serviceArea}
          />
        ))}
      </ul>
    </div>
  );
};

interface ServiceItemProps {
  serviceArea: ServiceArea;
}

const ServiceItem = ({ serviceArea }: ServiceItemProps) => {
  const boxStyle = {
    backgroundColor: hexToRgba(serviceArea.color, 0.4),
    borderColor: serviceArea.color,
  };

  return (
    <li className={styles.serviceItem}>
      <div className={styles.serviceHeader}>
        <div className={styles.serviceColorBox} style={boxStyle} />
        <h3 className={styles.serviceName}>{serviceArea.serviceName}</h3>
      </div>
      <ul className={styles.countiesList}>
        {serviceArea.counties.map((county) => (
          <li key={`${serviceArea.serviceSlug}-${county}`}>
            <Link
              className={styles.countyLink}
              href={`/${SERVICES_PAGE_SLUG}/${serviceArea.serviceSlug}`}
            >
              {county}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};
