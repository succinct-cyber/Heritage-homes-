export function formatNaira(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function purchaseTypeBadge(purchaseType) {
  switch (purchaseType) {
    case "sale":
      return "FOR SALE";
    case "rent":
      return "FOR RENT";
    case "lease":
      return "FOR LEASE";
    default:
      return purchaseType?.toUpperCase() || "";
  }
}
