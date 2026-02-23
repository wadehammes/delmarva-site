const STATIC_STYLE = "mapbox/satellite-streets-v12";
const PIN_COLOR = "e01e2d";
const CARD_ZOOM = 14;
const CARD_WIDTH = 360;
const CARD_HEIGHT = 202;

export function getProjectMapStaticUrl(
  lon: number,
  lat: number,
  token: string,
  options?: { width?: number; height?: number; zoom?: number },
): string {
  const width = options?.width ?? CARD_WIDTH;
  const height = options?.height ?? CARD_HEIGHT;
  const zoom = options?.zoom ?? CARD_ZOOM;
  const overlay = encodeURIComponent(`pin-l+${PIN_COLOR}(${lon},${lat})`);
  const position = `${lon},${lat},${zoom}`;
  const size = `${width}x${height}@2x`;
  return `https://api.mapbox.com/styles/v1/${STATIC_STYLE}/static/${overlay}/${position}/${size}?access_token=${encodeURIComponent(token)}`;
}
