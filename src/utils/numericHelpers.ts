export const formatToCents = (
  price: string | number | null,
  fractionDigits = 1,
  nanValue = "--",
): string => {
  const convertPrice = Number(price) * 100;
  const priceToString = String(convertPrice);
  const parsedPrice = Number.parseFloat(priceToString ?? "0");

  if (!Number.isFinite(parsedPrice)) {
    return nanValue;
  }

  return parsedPrice.toFixed(fractionDigits);
};
