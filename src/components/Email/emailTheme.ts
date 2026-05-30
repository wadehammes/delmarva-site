import type { TailwindConfig } from "react-email";

/** Delmarva brand colors for transactional email (also used in Tailwind theme). */
export const emailBrand = {
  bg: "#1f1d1d",
  muted: "#9ca3af",
  /** Matches site `--colors-red` */
  red: "#e01e2d",
  success: "#34d399",
  surface: "#2d2a2a",
  text: "#e5e7eb",
} as const;

export const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        delmarva: { ...emailBrand },
      },
    },
  },
} satisfies TailwindConfig;
