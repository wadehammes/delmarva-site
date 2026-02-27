"use client";

import clsx from "clsx";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  className?: string;
  height?: number;
  variant?: "block" | "line" | "media";
  width?: number;
}

export const Skeleton = ({
  className,
  height,
  variant = "block",
  width,
}: SkeletonProps) => {
  const style =
    width || height
      ? {
          height: height ? `${height}px` : undefined,
          width: width ? `${width}px` : undefined,
        }
      : undefined;

  return (
    <div
      aria-hidden
      className={clsx(
        styles.block,
        {
          [styles.line]: variant === "line",
          [styles.media]: variant === "media",
        },
        className,
      )}
      role="presentation"
      style={style}
    />
  );
};

interface SkeletonCardProps {
  className?: string;
  lineCount?: number;
}

interface SkeletonCardTrackProps {
  cardCount?: number;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "projects";
}

export const SkeletonCardTrack = ({
  cardCount = 4,
  children,
  className,
  variant = "default",
}: SkeletonCardTrackProps) => (
  <div
    className={clsx(
      styles.cardTrack,
      { [styles.cardTrackProjects]: variant === "projects" },
      className,
    )}
  >
    {children ??
      Array.from({ length: cardCount }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export const SkeletonCard = ({
  className,
  lineCount = 2,
}: SkeletonCardProps) => (
  <div className={clsx(styles.card, className)}>
    <Skeleton className={styles.media} variant="media" />
    <div className={styles.cardContent}>
      <Skeleton className={styles.title} variant="line" />
      {Array.from({ length: lineCount }).map((_, i) => (
        <Skeleton
          className={clsx(styles.descriptionLine, i === 0 && styles.lineWide)}
          key={i}
          variant="line"
        />
      ))}
      <div className={styles.statsList}>
        <div className={styles.stat}>
          <Skeleton className={styles.statLabel} variant="line" />
          <Skeleton className={styles.statValue} variant="line" />
        </div>
        <div className={styles.stat}>
          <Skeleton className={styles.statLabel} variant="line" />
          <Skeleton className={styles.statValue} variant="line" />
        </div>
      </div>
    </div>
  </div>
);
