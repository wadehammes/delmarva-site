"use client";

import clsx from "clsx";
import { gsap } from "gsap";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion } from "src/components/Accordion/Accordion.component";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import { ProjectCoverflowCarousel } from "src/components/ProjectCoverflowCarousel/ProjectCoverflowCarousel.component";
import { RichText } from "src/components/RichText/RichText.component";
import { Stat } from "src/components/Stat/Stat.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import type { MarketType } from "src/contentful/parseMarket";
import { useDOMCleanup } from "src/hooks/useIsBrowser";
import type { Locales } from "src/i18n/routing";
import { MARKETS_PAGE_SLUG } from "src/utils/constants";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./MarketAccordion.module.css";

const buttonText: Record<Locales, string> = {
  en: "View Market",
  es: "Ver Mercado",
};

interface MarketAccordionStatsProps {
  isAccordionOpen: boolean;
  stats: (ContentStatBlock | null)[] | undefined;
  statsGridRef: RefObject<HTMLDivElement | null>;
  statsRef: RefObject<HTMLDListElement | null>;
}

const MarketAccordionStats = ({
  isAccordionOpen,
  stats,
  statsGridRef,
  statsRef,
}: MarketAccordionStatsProps) => {
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

interface MarketAccordionProps {
  defaultOpen?: boolean;
  locale: Locales;
  market: MarketType;
  projects: ProjectType[];
}

export const MarketAccordion = (props: MarketAccordionProps) => {
  const { defaultOpen = false, locale, market, projects } = props;
  const { marketTitle, description, slug, stats } = market;
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

  const setupAnimation = useCallback(() => {
    const content = contentRef.current;
    if (!content || !isMounted()) return;

    cleanupGSAP();

    const tl = gsap.timeline({
      defaults: {
        duration: 0.3,
        ease: "power1.out",
      },
      paused: true,
    });
    timelineRef.current = tl;

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

  useEffect(() => {
    setupAnimation();
    addCleanup(cleanupGSAP);

    return () => {
      removeCleanup(cleanupGSAP);
      cleanupGSAP();
    };
  }, [setupAnimation, addCleanup, removeCleanup, cleanupGSAP]);

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

        gsap.delayedCall(0.1, () => {
          if (timelineRef.current && isMounted()) {
            timelineRef.current.play();
          }
        });
      } else {
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
      title={marketTitle ?? slug}
    >
      <div className={styles.marketAccordion} ref={contentRef}>
        <div className={styles.marketAccordionContent}>
          {description && (
            <div ref={richTextRef}>
              <RichText document={description} enlargeBoldText />
            </div>
          )}
          <MarketAccordionStats
            isAccordionOpen={isAccordionOpen}
            stats={stats}
            statsGridRef={statsGridRef}
            statsRef={statsRef}
          />
          <div className={styles.marketAccordionCta} ref={ctaRef}>
            <ButtonLink
              arrow="Right Arrow"
              data-tracking-click="market-accordion-cta"
              href={`/${MARKETS_PAGE_SLUG}/${slug}`}
              label={buttonText[locale]}
              variant="secondary"
            >
              {buttonText[locale]}
            </ButtonLink>
          </div>
        </div>
        <div
          className={clsx(
            styles.marketAccordionCarousel,
            projects.length === 1 && styles.singleCard,
          )}
          ref={carouselRef}
        >
          <ProjectCoverflowCarousel
            carouselId={`market-${slug}`}
            projects={projects}
          />
        </div>
      </div>
    </Accordion>
  );
};
