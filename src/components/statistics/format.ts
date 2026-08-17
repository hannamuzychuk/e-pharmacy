const integerFormatter = new Intl.NumberFormat("en-US");
const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatInteger(value: number) {
  return integerFormatter.format(value);
}

export function formatMoney(value: number) {
  return moneyFormatter.format(Math.abs(value));
}

export function formatSignedMoney(value: number) {
  const formatted = formatMoney(value);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}
