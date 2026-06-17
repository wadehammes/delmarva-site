"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type TrackEventParams = Record<
  string,
  string | number | boolean | undefined
>;

export function trackEvent(event: string, params?: TrackEventParams): void {
  if (params) {
    sendGAEvent("event", event, params);
    return;
  }

  sendGAEvent("event", event);
}
