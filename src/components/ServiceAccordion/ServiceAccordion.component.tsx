"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { Accordion } from "src/components/Accordion/Accordion.component";
import { ButtonLink } from "src/components/ButtonLink/ButtonLink.component";
import { ProjectCarousel } from "src/components/ProjectCarousel/ProjectCarousel.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ServiceType } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./ServiceAccordion.module.css";

const buttonText: Record<Locales, string> = {
  en: "View Service",
  es: "Ver Servicio",
};

interface ServiceAccordionProps {
  service: ServiceType;
  locale: Locales;
  projects: ProjectType[];
}

export const ServiceAccordion = (props: ServiceAccordionProps) => {
  const { service, locale, projects } = props;
  const { serviceName, description, stats, slug } = service;

  const contentRef = useRef<HTMLDivElement>(null);
  const richTextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Animation setup
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create a new timeline
    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // Initial state - hide all elements
    gsap.set(
      [
        richTextRef.current,
        statsRef.current,
        ctaRef.current,
        carouselRef.current,
      ],
      {
        opacity: 0,
        y: 8,
      },
    );

    // Hide individual stat items initially
    if (statsRef.current) {
      gsap.set(statsRef.current.querySelectorAll(`.${styles.statItem}`), {
        opacity: 0,
        y: 6,
      });
    }

    // Animate elements in sequence with better timing
    tl.to(richTextRef.current, {
      duration: 0.35,
      ease: "power1.out",
      opacity: 1,
      y: 0,
    })
      .to(
        statsRef.current,
        {
          duration: 0.3,
          ease: "power1.out",
          opacity: 1,
          y: 0,
        },
        "-=0.15",
      )
      .to(
        statsRef.current?.querySelectorAll(`.${styles.statItem}`) || [],
        {
          duration: 0.25,
          ease: "power1.out",
          opacity: 1,
          stagger: 0.06,
          y: 0,
        },
        "-=0.1",
      )
      .to(
        ctaRef.current,
        {
          duration: 0.3,
          ease: "power1.out",
          opacity: 1,
          y: 0,
        },
        "-=0.08",
      )
      .to(
        carouselRef.current,
        {
          duration: 0.35,
          ease: "power1.out",
          opacity: 1,
          y: 0,
        },
        "-=0.12",
      );

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  const handleAccordionToggle = (isOpen: boolean) => {
    if (!timelineRef.current) return;

    if (isOpen) {
      // Add a small delay to let the accordion height animation start first
      gsap.delayedCall(0.1, () => {
        timelineRef.current?.play();
      });
    } else {
      // Reverse immediately when closing
      timelineRef.current.reverse();
    }
  };

  return (
    <Accordion
      headerElement="h3"
      onToggle={handleAccordionToggle}
      title={serviceName}
    >
      <div className={styles.serviceAccordion} ref={contentRef}>
        <div className={styles.serviceAccordionContent}>
          <div ref={richTextRef}>
            <RichText document={description} />
          </div>
          <dl className={styles.statsList} ref={statsRef}>
            {stats?.map((stat) => {
              if (!stat) {
                return null;
              }

              return (
                <div className={styles.statItem} key={stat.id}>
                  <dt className={styles.statDescription}>{stat.description}</dt>
                  <dd className={styles.statValue}>
                    {formatNumber(stat.value ?? 0, stat.type)}
                  </dd>
                </div>
              );
            })}
          </dl>
          <div className={styles.serviceAccordionCta} ref={ctaRef}>
            <ButtonLink
              data-tracking-click="service-accordion-cta"
              href={`/services/${slug}`}
              label={buttonText[locale]}
            >
              {buttonText[locale]}
            </ButtonLink>
          </div>
        </div>
        <div ref={carouselRef} style={{ width: "100%" }}>
          <ProjectCarousel projects={projects} selectedServiceSlug={slug} />
        </div>
      </div>
    </Accordion>
  );
};
