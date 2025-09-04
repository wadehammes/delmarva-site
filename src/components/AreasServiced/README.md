# AreasServiced Component

A Mapbox GL JS powered map component that displays service area tiles for specified zip codes using the Delmarva brand colors.

## Features

- **Interactive Map**: Powered by Mapbox GL JS with custom styling
- **Service Area Visualization**: Displays zip code areas as red tiles using brand colors
- **Responsive Design**: Mobile-first approach with customizable height
- **Customizable**: Configurable center point, zoom level, and styling
- **TypeScript Support**: Fully typed with comprehensive interfaces

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `zipCodes` | `string[]` | Required | Array of zip codes to display as service areas |
| `mapboxAccessToken` | `string` | Auto-loaded | Mapbox access token from environment variables |
| `className` | `string` | `undefined` | Additional CSS class for styling |
| `height` | `string` | `"400px"` | Height of the map container |
| `center` | `[number, number]` | Auto-calculated | Map center coordinates (longitude, latitude) |
| `zoom` | `number` | `8` | Initial zoom level |
| `autoFitBounds` | `boolean` | `true` | Automatically fit map bounds to show all service areas |

## Usage

```tsx
import { AreasServiced } from "src/components/AreasServiced/AreasServiced.component";

const MyComponent = () => {
  const zipCodes = ["19901", "19902", "19903", "19904"];

  return (
    <AreasServiced
      zipCodes={zipCodes}
      height="500px"
      center={[-75.5, 38.5]}
      zoom={9}
    />
  );
};
```

## Environment Variables

Add your Mapbox access token to your environment variables:

```bash
MAPBOX_API_TOKEN=your_mapbox_token_here
```

## Styling

The component uses CSS modules and follows the project's design system:

- Uses `--colors-red` for service area tiles
- Responsive design with mobile-first approach
- Custom Mapbox control styling
- Rounded corners and subtle shadows

## Implementation Notes

**Zip Code Data**: The component uses the Mapbox Geocoding API to fetch real zip code boundaries. This provides accurate geographic data for service area visualization.

**API Integration**: 
- Uses `https://api.mapbox.com/geocoding/v5/mapbox.places/{zipcode}.json?types=postcode`
- Handles both Polygon and MultiPolygon geometries
- Includes error handling for failed requests
- Shows loading states during data fetching

**Performance**: 
- Fetches all zip code boundaries in parallel using `Promise.all()`
- Caches results during component lifecycle
- Gracefully handles missing or invalid zip codes

## Dependencies

- `mapbox-gl`: Mapbox GL JS library
- `@types/mapbox-gl`: TypeScript definitions

## Browser Support

Requires modern browsers with WebGL support. Mapbox GL JS supports:
- Chrome 51+
- Firefox 53+
- Safari 10+
- Edge 79+
