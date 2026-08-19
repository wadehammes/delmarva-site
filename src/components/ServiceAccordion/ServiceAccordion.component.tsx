"use client";

import { gsap } from "gsap";
import type { RefObject } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Accordion } from "src/components/Accordion/Accordion.component";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import { ProjectCoverflowCarousel } from "src/components/ProjectCoverflowCarousel/ProjectCoverflowCarousel.component";
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

  const cleanupGSAP = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  const applyOpenAnimationStartState = useCallback(() => {
    gsap.set(
      [
        richTextRef.current,
        statsRef.current,
        statsGridRef.current,
        ctaRef.current,
        carouselRef.current,
      ].filter((el): el is HTMLDivElement | HTMLDListElement => el != null),
      {
        force3D: true,
        opacity: 0,
        y: 20,
      },
    );

    if (statsRef.current) {
      gsap.set(statsRef.current.querySelectorAll(`.${styles.statItem}`), {
        force3D: true,
        opacity: 0,
        y: 15,
      });
    }

    if (statsGridRef.current) {
      gsap.set(statsGridRef.current.querySelectorAll('[class*="stat"]'), {
        force3D: true,
        opacity: 0,
        y: 15,
      });
    }
  }, []);

  const playOpenAnimation = useCallback(() => {
    if (!timelineRef.current || !isMounted()) return;

    applyOpenAnimationStartState();

    gsap.delayedCall(0.05, () => {
      if (timelineRef.current && isMounted()) {
        timelineRef.current.play();
      }
    });
  }, [applyOpenAnimationStartState, isMounted]);

  const setupAnimation = useCallback(() => {
    const content = contentRef.current;
    if (!content || !isMounted()) return;

    cleanupGSAP();

    const tl = gsap.timeline({
      defaults: {
        duration: 0.18,
        ease: "power1.out",
      },
      paused: true,
    });
    timelineRef.current = tl;

    if (richTextRef.current) {
      tl.to(richTextRef.current, {
        duration: 0.15,
        ease: "power2.out",
        force3D: true,
        opacity: 1,
        y: 0,
      });
    }

    const statsContainers = [statsRef.current, statsGridRef.current].filter(
      (el): el is HTMLDivElement | HTMLDListElement => el != null,
    );
    if (statsContainers.length > 0) {
      tl.to(
        statsContainers,
        {
          duration: 0.2,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          y: 0,
        },
        "-=0.12",
      );
    }

    const listStatEls = statsRef.current?.querySelectorAll(
      `.${styles.statItem}`,
    );
    if (listStatEls && listStatEls.length > 0) {
      tl.to(
        listStatEls,
        {
          duration: 0.18,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          stagger: 0.05,
          y: 0,
        },
        "-=0.1",
      );
    }

    const gridStatEls =
      statsGridRef.current?.querySelectorAll('[class*="stat"]');
    if (gridStatEls && gridStatEls.length > 0) {
      tl.to(
        gridStatEls,
        {
          duration: 0.18,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          stagger: 0.05,
          y: 0,
        },
        "-=0.1",
      );
    }

    if (ctaRef.current) {
      tl.to(
        ctaRef.current,
        {
          duration: 0.2,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          y: 0,
        },
        "-=0.08",
      );
    }

    if (carouselRef.current) {
      tl.to(
        carouselRef.current,
        {
          duration: 0.22,
          ease: "power2.out",
          force3D: true,
          opacity: 1,
          y: 0,
        },
        "-=0.08",
      );
    }
  }, [isMounted, cleanupGSAP]);

  useLayoutEffect(() => {
    if (!defaultOpen) return;
    applyOpenAnimationStartState();
  }, [applyOpenAnimationStartState, defaultOpen]);

  useEffect(() => {
    setupAnimation();
    addCleanup(cleanupGSAP);

    if (defaultOpen) {
      playOpenAnimation();
    }

    return () => {
      removeCleanup(cleanupGSAP);
      cleanupGSAP();
    };
  }, [
    addCleanup,
    cleanupGSAP,
    defaultOpen,
    playOpenAnimation,
    removeCleanup,
    setupAnimation,
  ]);

  useEffect(() => {
    return () => {
      cleanupGSAP();
    };
  }, [cleanupGSAP]);

  const handleAccordionToggle = useCallback(
    (isOpen: boolean) => {
      setIsAccordionOpen(isOpen);

      if (!timelineRef.current || !isMounted()) return;

      if (isOpen) {
        playOpenAnimation();
      } else {
        timelineRef.current.reverse();
      }
    },
    [isMounted, playOpenAnimation],
  );

  return (
    <Accordion
      animateOpenOnMount={defaultOpen}
      defaultOpen={defaultOpen}
      headerElement="h3"
      onToggle={handleAccordionToggle}
      title={serviceName}
      trackingEvent="service-accordion-toggle"
      trackingLabel={serviceName}
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
              href={`/${SERVICES_PAGE_SLUG}/${slug}`}
              label={buttonText[locale]}
              variant="secondary"
            >
              {buttonText[locale]}
            </ButtonLink>
          </div>
        </div>
        <div className={styles.serviceAccordionCarousel} ref={carouselRef}>
          <ProjectCoverflowCarousel
            carouselId={`service-${slug}`}
            projects={projects}
            selectedServiceSlug={slug}
          />
        </div>
      </div>
    </Accordion>
  );
};
