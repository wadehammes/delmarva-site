"use client";

import clsx from "clsx";
import styles from "./Skeleton.module.css";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...props
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
      style={{ ...style, ...props.style }}
    />
  );
};

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
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

export const SkeletonCard = ({ className, ...props }: SkeletonCardProps) => (
  <div className={clsx(styles.card, className)}>
    <Skeleton {...props} style={{ height: "100%", width: "100%" }} />
  </div>
);
