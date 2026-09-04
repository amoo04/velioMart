export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
