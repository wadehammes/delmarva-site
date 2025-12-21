import { ServiceCountiesMapColor } from "src/contentful/interfaces";

/**
 * Maps ServiceCountiesMapColor enum to hex color values for Mapbox
 * Mapbox doesn't support CSS variables, so we return hex values directly
 * Defaults to brand red if color is missing
 */
export function mapServiceColorToCss(color?: ServiceCountiesMapColor): string {
  switch (color) {
    case ServiceCountiesMapColor.Red:
      return "#e01e2d";
    case ServiceCountiesMapColor.Orange:
      return "#ff6600";
    case ServiceCountiesMapColor.Blue:
      return "#0066cc";
    case ServiceCountiesMapColor.Green:
      return "#00cc66";
    case ServiceCountiesMapColor.Pink:
      return "#ff66cc";
    case ServiceCountiesMapColor.Purple:
      return "#9966ff";
    case ServiceCountiesMapColor.White:
      return "#ffffff";
    case ServiceCountiesMapColor.Yellow:
      return "#ffcc00";
    default:
      return "#e01e2d"; // Default to brand red
  }
}
