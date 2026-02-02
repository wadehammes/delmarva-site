import type { ExtractSymbolType } from "src/contentful/helpers";
import type { TypeServiceFields } from "src/contentful/types/TypeService";

type ServiceCountiesMapColor = ExtractSymbolType<
  NonNullable<TypeServiceFields["serviceCountiesMapColor"]>
>;

export function mapServiceColorToCss(color?: ServiceCountiesMapColor): string {
  switch (color) {
    case "Red":
      return "#e01e2d";
    case "Orange":
      return "#ff6600";
    case "Blue":
      return "#0066cc";
    case "Green":
      return "#00cc66";
    case "Pink":
      return "#ff66cc";
    case "Purple":
      return "#9966ff";
    case "White":
      return "#ffffff";
    case "Yellow":
      return "#ffcc00";
    default:
      return "#e01e2d";
  }
}
