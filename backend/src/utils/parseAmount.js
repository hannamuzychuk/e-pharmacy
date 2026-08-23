function parseAmount(value) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  const raw = String(value).trim();
  const isNegative = raw.includes("-");
  const digits = raw.replace(/[^\d.,]/g, "");

  const normalized =
    digits.includes(",") && digits.includes(".")
      ? digits.replace(/,/g, "")
      : digits.replace(",", ".");

  const amount = Number.parseFloat(normalized) || 0;

  if (isNegative && amount > 0) {
    return -amount;
  }

  return amount;
}

module.exports = parseAmount;
