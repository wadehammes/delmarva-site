"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import styles from "src/components/MediaGalleryCarousel/MediaGalleryCarousel.module.css";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import CloseIcon from "src/icons/Close.svg";
import ExpandIcon from "src/icons/expand.svg";
import { useMediaQuery } from "usehooks-ts";

function startViewTransition(callback: () => void) {
  if ("startViewTransition" in document) {
    (
      document as Document & { startViewTransition: (cb: () => void) => void }
    ).startViewTransition(callback);
  } else {
    callback();
  }
}

interface MediaGalleryCarouselProps {
  assets: ContentfulAsset[];
  autoplay?: boolean;
  variant?: "default" | "header";
}

export const MediaGalleryCarousel = (props: MediaGalleryCarouselProps) => {
  const { assets, autoplay = false, variant = "default" } = props;

  const isMobile = useMediaQuery("(max-width: 768px)", {
    defaultValue: false,
    initializeWithValue: false,
  });
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const openFullscreen = useCallback((index: number) => {
    setFullscreenIndex(index);
    startViewTransition(() => setFullscreenOpen(true));
  }, []);

  const closeFullscreen = useCallback(() => {
    startViewTransition(() => setFullscreenOpen(false));
  }, []);

  const goPrev = useCallback(() => {
    setFullscreenIndex((i) => (i <= 0 ? assets.length - 1 : i - 1));
  }, [assets.length]);

  const goNext = useCallback(() => {
    setFullscreenIndex((i) => (i >= assets.length - 1 ? 0 : i + 1));
  }, [assets.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenOpen) return;
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    if (fullscreenOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenOpen, closeFullscreen, goPrev, goNext]);

  useEffect(() => {
    if (fullscreenOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreenOpen]);

  if (assets.length === 0) return null;

  const currentAsset = assets[fullscreenIndex];

  const fullscreenContent = (
    <div
      aria-label="Full screen image viewer"
      aria-modal="true"
      className={styles.fullscreen}
      role="dialog"
    >
      <button
        aria-label="Close"
        className={styles.backdrop}
        onClick={closeFullscreen}
        type="button"
      />
      <button
        aria-label="Close full screen"
        className={styles.closeButton}
        onClick={closeFullscreen}
        type="button"
      >
        <CloseIcon className={styles.closeIcon} />
      </button>
      <button
        aria-label="Previous image"
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        onClick={goPrev}
        type="button"
      >
        ←
      </button>
      <button
        aria-label="Next image"
        className={`${styles.navButton} ${styles.navButtonNext}`}
        onClick={goNext}
        type="button"
      >
        →
      </button>
      <div className={styles.fullscreenContent}>
        <ContentfulAssetRenderer asset={currentAsset} />
      </div>
      <div className={styles.pagination}>
        {fullscreenIndex + 1} / {assets.length}
      </div>
    </div>
  );

  const headerFullscreenContent = (
    <div
      aria-label="Full screen image viewer"
      aria-modal="true"
      className={`${styles.fullscreen} ${styles.fullscreenHeader}`}
      role="dialog"
    >
      <button
        aria-label="Close"
        className={styles.backdrop}
        onClick={closeFullscreen}
        type="button"
      />
      <div className={styles.fullscreenInner}>
        <div className={styles.fullscreenContent}>
          <div className={styles.fullscreenImageWrapper}>
            <ContentfulAssetRenderer asset={currentAsset} />
          </div>
        </div>
        <div className={styles.fullscreenControls}>
          <button
            aria-label="Close full screen"
            className={styles.closeButton}
            onClick={closeFullscreen}
            type="button"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
          <button
            aria-label="Previous image"
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            onClick={goPrev}
            type="button"
          >
            ←
          </button>
          <div className={styles.pagination}>
            {fullscreenIndex + 1} / {assets.length}
          </div>
          <button
            aria-label="Next image"
            className={`${styles.navButton} ${styles.navButtonNext}`}
            onClick={goNext}
            type="button"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.carouselWrapper}>
        <Carousel
          autoplay={autoplay}
          controlsSize={variant === "header" && isMobile ? "Small" : "Regular"}
          onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        >
          {assets.map((asset, index) => (
            <button
              className={styles.slideButton}
              key={asset.id}
              onClick={() => openFullscreen(index)}
              type="button"
            >
              <ContentfulAssetRenderer asset={asset} />
            </button>
          ))}
        </Carousel>
        <button
          aria-label="View full screen"
          className={styles.expandButton}
          onClick={() => openFullscreen(activeSlideIndex)}
          type="button"
        >
          <ExpandIcon className={styles.expandIcon} />
        </button>
      </div>

      {fullscreenOpen &&
        typeof document !== "undefined" &&
        createPortal(
          variant === "header" ? headerFullscreenContent : fullscreenContent,
          document.body,
        )}
    </>
  );
};
