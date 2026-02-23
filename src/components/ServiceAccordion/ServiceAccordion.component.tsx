"use client";

import { gsap } from "gsap";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion } from "src/components/Accordion/Accordion.component";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import { ProjectCarousel } from "src/components/ProjectCarousel/ProjectCarousel.component";
import { RichText } from "src/components/RichText/RichText.component";
import { Stat } from "src/components/Stat/Stat.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ServiceType } from "src/contentful/getServices";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { useDOMCleanup } from "src/hooks/useIsBrowser";
import type { Locales } from "src/i18n/routing";
import { SERVICES_PAGE_SLUG } from "src/utils/constants";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./ServiceAccordion.module.css";

const buttonText: Record<Locales, string> = {
  en: "View Service",
  es: "Ver Servicio",
};

interface ServiceAccordionStatsProps {
  isAccordionOpen: boolean;
  stats: (ContentStatBlock | null)[] | undefined;
  statsGridRef: RefObject<HTMLDivElement | null>;
  statsRef: RefObject<HTMLDListElement | null>;
}

const ServiceAccordionStats = ({
  isAccordionOpen,
  stats,
  statsGridRef,
  statsRef,
}: ServiceAccordionStatsProps) => {
  const numberOfStats = stats?.length;

  if (!numberOfStats) return null;

  if (numberOfStats <= 3) {
    return (
      <div className={styles.statsGrid} ref={statsGridRef}>
        {stats.map((stat) => {
          if (!stat) return null;

          return (
            <Stat
              align="left"
              key={stat.id}
              size="small"
              stat={stat}
              trigger={isAccordionOpen}
            />
          );
        })}
      </div>
    );
  }

  return (
    <dl className={styles.statsList} ref={statsRef}>
      {stats.map((stat) => {
        if (!stat) return null;

        return (
          <div className={styles.statItem} key={stat.id}>
            <dt className={styles.statDescription}>{stat.statDescription}</dt>
            <dd className={styles.statValue}>
              {formatNumber({
                decorator: stat.decorator,
                keepInitialValue: true,
                num: stat.stat ?? 0,
                type: stat.statType,
              })}
            </dd>
          </div>
        );
      })}
    </dl>
  );
};

interface ServiceAccordionProps {
  defaultOpen?: boolean;
  locale: Locales;
  projects: ProjectType[];
  service: ServiceType;
}

export const ServiceAccordion = (props: ServiceAccordionProps) => {
  const { defaultOpen = false, service, locale, projects } = props;
  const { serviceName, description, stats, slug } = service;
  const [isAccordionOpen, setIsAccordionOpen] = useState(defaultOpen);

  const contentRef = useRef<HTMLDivElement>(null);
  const richTextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { isMounted, addCleanup, removeCleanup } = useDOMCleanup();

  // GSAP cleanup function
  const cleanupGSAP = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  // Memoized animation setup
  const setupAnimation = useCallback(() => {
    const content = contentRef.current;
    if (!content || !isMounted()) return;

    // Kill any existing timeline
    cleanupGSAP();

    // Create a new timeline with optimized settings
    const tl = gsap.timeline({
      defaults: {
        duration: 0.3,
        ease: "power1.out",
      },
      paused: true,
    });
    timelineRef.current = tl;

    // Don't set initial hidden state - let CSS handle initial visibility
    // This prevents issues during hot reload when accordion is open

    // Animate elements in sequence with optimized properties
    tl.to(richTextRef.current, {
      duration: 0.2,
      ease: "power2.out",
      force3D: true,
      opacity: 1,
      y: 0,
    })
      .to(
        [statsRef.current, statsGridRef.current].filter(Boolean),
        {
          duration: 0.35,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          y: 0,
        },
        "-=0.2",
      )
      .to(
        statsRef.current?.querySelectorAll(`.${styles.statItem}`) || [],
        {
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          stagger: 0.08,
          y: 0,
        },
        "-=0.15",
      )
      .to(
        statsGridRef.current?.querySelectorAll('[class*="stat"]') || [],
        {
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          stagger: 0.08,
          y: 0,
        },
        "-=0.15",
      )
      .to(
        ctaRef.current,
        {
          duration: 0.35,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          y: 0,
        },
        "-=0.1",
      )
      .to(
        carouselRef.current,
        {
          duration: 0.4,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          y: 0,
        },
        "-=0.1",
      );
  }, [isMounted, cleanupGSAP]);

  // Setup animation on mount
  useEffect(() => {
    setupAnimation();
    addCleanup(cleanupGSAP);

    return () => {
      removeCleanup(cleanupGSAP);
      cleanupGSAP();
    };
  }, [setupAnimation, addCleanup, removeCleanup, cleanupGSAP]);

  // Cleanup on locale change
  useEffect(() => {
    return () => {
      cleanupGSAP();
    };
  }, [cleanupGSAP]);

  // Memoized accordion toggle handler
  const handleAccordionToggle = useCallback(
    (isOpen: boolean) => {
      setIsAccordionOpen(isOpen);

      if (!timelineRef.current || !isMounted()) return;

      if (isOpen) {
        // Set initial hidden state when opening
        gsap.set(
          [
            richTextRef.current,
            statsRef.current,
            statsGridRef.current,
            ctaRef.current,
            carouselRef.current,
          ],
          {
            force3D: true,
            opacity: 0,
            y: 20,
          },
        );

        // Hide individual stat items initially
        if (statsRef.current) {
          gsap.set(statsRef.current.querySelectorAll(`.${styles.statItem}`), {
            force3D: true,
            opacity: 0,
            y: 15,
          });
        }

        // Hide individual stat components in grid initially
        if (statsGridRef.current) {
          gsap.set(statsGridRef.current.querySelectorAll('[class*="stat"]'), {
            force3D: true,
            opacity: 0,
            y: 15,
          });
        }

        // Add a small delay to let the accordion height animation start first
        gsap.delayedCall(0.1, () => {
          if (timelineRef.current && isMounted()) {
            timelineRef.current.play();
          }
        });
      } else {
        // Reverse immediately when closing
        if (timelineRef.current) {
          timelineRef.current.reverse();
        }
      }
    },
    [isMounted],
  );

  return (
    <Accordion
      defaultOpen={defaultOpen}
      headerElement="h3"
      onToggle={handleAccordionToggle}
      title={serviceName}
    >
      <div className={styles.serviceAccordion} ref={contentRef}>
        <div className={styles.serviceAccordionContent}>
          <div ref={richTextRef}>
            <RichText document={description} enlargeBoldText />
          </div>
          <ServiceAccordionStats
            isAccordionOpen={isAccordionOpen}
            stats={stats}
            statsGridRef={statsGridRef}
            statsRef={statsRef}
          />
          <div className={styles.serviceAccordionCta} ref={ctaRef}>
            <ButtonLink
              arrow="Right Arrow"
              data-tracking-click="service-accordion-cta"
              href={`/${SERVICES_PAGE_SLUG}/${slug}`}
              label={buttonText[locale]}
              variant="secondary"
            >
              {buttonText[locale]}
            </ButtonLink>
          </div>
        </div>
        <div className={styles.serviceAccordionCarousel} ref={carouselRef}>
          <ProjectCarousel
            carouselId={`service-${slug}`}
            projects={projects}
            selectedServiceSlug={slug}
          />
        </div>
      </div>
    </Accordion>
  );
};
