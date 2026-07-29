# AreasServicedMap

Mapbox GL map that displays service areas by county with a color-coded legend.

Handbook: [docs/handbook/components.md](../../../docs/handbook/components.md) (map components, loading states, CMS block).

## Usage (standalone page / module)

```tsx
import { AreasServicedMap } from "src/components/AreasServicedMap/AreasServicedMap.component";

<AreasServicedMap
  services={services}
  height="500px"
  autoFitBounds
/>
```

For App Router pages, prefer **`AreasServicedMapClient`** or **`AreasServicedMapServer`** so Mapbox loads with **`ssr: false`**.

## CMS block

**`contentAreasServicedMap`** entries use **`src/components/ContentAreasServicedMap/`** (parser → **ContentRenderer** → **`MapErrorBoundary`** → **`ContentAreasServicedMapClient`**).

## Data flow

1. **`parseServicesToServiceAreas`** reads county CSVs from Contentful services.
2. **`countiesToBoundaryLines`** POSTs to **`/api/boundaries/counties`** (chunked at 100 counties per request).
3. Mapbox layers are added on **`load`**; the loading overlay stays until **`isMapReady`**.

## Environment

Requires **`NEXT_PUBLIC_MAPBOX_API_TOKEN`**. Server boundaries API uses **`MAPBOX_API_TOKEN`**.

## Files

| File | Role |
|------|------|
| **`AreasServicedMap.component.tsx`** | Core client map |
| **`AreasServicedMapFromServices.component.tsx`** | Same logic for CMS parser shape |
| **`AreasServicedMapLoadingOverlay.component.tsx`** | Skeleton + status overlay |
| **`AreasServicedMapClient.component.tsx`** | **`dynamic`** wrapper (**`ssr: false`**) |
