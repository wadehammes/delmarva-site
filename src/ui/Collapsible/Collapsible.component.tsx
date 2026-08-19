"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./Collapsible.module.css";

type RootProps = ComponentProps<typeof BaseCollapsible.Root>;
type TriggerProps = ComponentProps<typeof BaseCollapsible.Trigger>;
type PanelProps = ComponentProps<typeof BaseCollapsible.Panel>;

export const CollapsibleRoot = ({ className, ...props }: RootProps) => (
  <BaseCollapsible.Root className={clsx(styles.root, className)} {...props} />
);

export const CollapsibleTrigger = ({ className, ...props }: TriggerProps) => (
  <BaseCollapsible.Trigger
    className={clsx(styles.trigger, className)}
    {...props}
  />
);

export const CollapsiblePanel = ({ className, ...props }: PanelProps) => (
  <BaseCollapsible.Panel className={clsx(styles.panel, className)} {...props} />
);
