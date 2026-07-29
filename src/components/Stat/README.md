# Stat

Displays a CMS stat block (number + description) with a **CSS translateY ticker** animation when the stat enters the viewport—or when **`trigger`** is set (e.g. from an open accordion).

Handbook: [docs/handbook/components.md](../../../docs/handbook/components.md) (Stat section). **Does not use GSAP**—accordion panel motion uses GSAP separately.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **`stat`** | **`ContentStatBlock`** | Required | Parsed Contentful stat fields |
| **`size`** | **`"small" \| "medium" \| "large"`** | **`"medium"`** | Typography scale |
| **`align`** | **`"left" \| "center" \| "right"`** | **`"center"`** | Text alignment |
| **`trigger`** | **`boolean`** | **`false`** | When **`true`**, animates immediately (accordion grids) instead of waiting for in-view |
| **`className`** | **`string`** | — | Optional module class |

## Usage

```tsx
import { Stat } from "src/components/Stat/Stat.component";

<Stat stat={parsedStatBlock} size="small" align="left" />
```

With explicit trigger (accordion):

```tsx
<Stat stat={stat} size="small" align="left" trigger={isAccordionOpen} />
```

## Animation

**`TickerNumber`** rolls digits via CSS **`transform`** and transitions when **`useOptimizedInView`** reports in-view (or **`trigger`** is **`true`**). Respects reduced-motion via CSS where configured in **`Stat.module.css`**.

## Contentful

Stat blocks are parsed from CMS entries used in sections and accordions. Types live under **`src/contentful/types/`**; shape helpers in **`src/utils/stat.helpers.ts`**.

## Testing

**[Stat.po.tsx](./Stat.po.tsx)** and **[Stat.test.tsx](./Stat.test.tsx)** — page object holds render helpers; spec asserts behavior with **`screen`**.
