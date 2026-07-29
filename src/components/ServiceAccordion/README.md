# ServiceAccordion

Service accordion with GSAP panel reveal when expanded. Uses the base **Accordion** component for structure and accessibility.

Handbook: [docs/handbook/components.md](../../../docs/handbook/components.md) (GSAP expand animations).

## Features

On open, content animates in sequence: rich text → stats container → individual stats (staggered) → CTA → project carousel. Closing reverses the timeline immediately.

Stats layout depends on count:

- **≤3 stats** — **Stat** components in a grid (**`statsGridRef`**)
- **>3 stats** — definition list (**`statsRef`**) with **`.statItem`** rows

Only one layout mounts at a time. GSAP targets must be guarded so empty refs or **`querySelectorAll`** results are never passed to **`gsap.to`** (see **MarketAccordion** for the same pattern).

## Props

```typescript
interface ServiceAccordionProps {
  defaultOpen?: boolean;
  locale: Locales;
  projects: ProjectType[];
  service: ServiceType;
}
```

## Usage

```tsx
<ServiceAccordion
  service={serviceData}
  locale="en"
  projects={projectData}
/>
```

## Dependencies

- **GSAP** — panel reveal timelines only (stat digits use **Stat** CSS ticker, not GSAP)
- **`useDOMCleanup`** — timeline cleanup on unmount
- **Accordion**, **RichText**, **Stat**, **ProjectCoverflowCarousel**
