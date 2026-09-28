export function formatRwf(amount: number) {
  return `RWF ${amount.toLocaleString("en-US")}`;
}

export function formatPrice(amount: number, period: "month" | "sale" | null) {
  const base = formatRwf(amount);
  if (period === "month") return `${base} / month`;
  return base;
}

export function formatSize(m2: number) {
  return `${m2.toLocaleString("en-US")} m²`;
}

export function locationLine(neighborhood: string, city: string) {
  if (neighborhood && neighborhood !== city) return `${city} · ${neighborhood}`;
  return city;
}

export function formatCompact(n: number) {
  return n.toLocaleString("en-US");
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function rwandaDigits(phone: string) {
  const d = phone.replace(/[^\d]/g, "");
  if (d.startsWith("250")) return d;
  if (d.startsWith("0")) return `250${d.slice(1)}`;
  return `250${d}`;
}

export function telHref(phone: string) {
  return `tel:+${rwandaDigits(phone)}`;
}

export function waHref(phone: string, text: string) {
  return `https://wa.me/${rwandaDigits(phone)}?text=${encodeURIComponent(text)}`;
}

export function formatPct(n: number) {
  return `${n.toFixed(n >= 10 ? 0 : 1)}%`;
}
