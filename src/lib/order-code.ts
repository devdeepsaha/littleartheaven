export function generateOrderCode() {
  const stamp = new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LAH-${stamp}-${suffix}`;
}
