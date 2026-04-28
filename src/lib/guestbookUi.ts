/**
 * Avatar gradient + initial — matches `reference/golden-era-integra-hybrid.html` guestbook script.
 */
export function avatarForName(name: string): {
  gradient: string;
  initial: string;
} {
  const palettes: readonly [string, string][] = [
    ["#3a4fd9", "#e838a4"],
    ["#e838a4", "#f59e3a"],
    ["#3a4fd9", "#f59e3a"],
    ["#f59e3a", "#e8224d"],
    ["#b6132c", "#f59e3a"],
    ["#2a1a3e", "#e838a4"],
  ];
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [c1, c2] = palettes[hash % palettes.length]!;
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return {
    gradient: `linear-gradient(135deg, ${c1}, ${c2})`,
    initial,
  };
}

export function timeAgoFromIso(iso: string): string {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) {
    return "";
  }
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Core username only; max 31 so `@` + core ≤ 32. */
export function filterHandleCore(raw: string): string {
  let s = raw.trim();
  while (s.startsWith("@")) {
    s = s.slice(1);
  }
  const core = [...s].filter((c) => /[a-zA-Z0-9._]/.test(c)).join("");
  return core.slice(0, 31);
}
