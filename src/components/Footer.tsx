import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";

const sections = [
  { href: "/story", label: "Story" },
  { href: "/build", label: "The Build" },
  { href: "/archive", label: "The Archive" },
  { href: "/sessions", label: "Sessions" },
] as const;

const follow: ReadonlyArray<{
  href: string;
  label: string;
  ext: boolean;
}> = [
  { href: "https://www.instagram.com/golden.era.integra", label: "Instagram", ext: true },
  { href: "https://www.youtube.com/@golden.era.integra", label: "YouTube", ext: true },
  { href: "https://www.tiktok.com/@golden.era.integra", label: "TikTok", ext: true },
  { href: "https://www.facebook.com/share/1H5uPBoKaf/", label: "Facebook", ext: true },
];

const credits: ReadonlyArray<{
  href: string;
  label: string;
  ext: boolean;
}> = [
  { href: "https://vizantir.com", label: "Site by Vizantir", ext: true },
  { href: "/#", label: "Las Vegas, NV", ext: false },
];

export function Footer() {
  return (
    <footer
      className="relative border-t border-line bg-bg"
      id="colophon"
    >
      <div className="mx-auto max-w-[var(--container)] px-6 py-20 pb-8 sm:px-8">
        <div className="mb-12 grid max-w-full grid-cols-2 gap-8 sm:max-md:grid-cols-2 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <div className="flex max-w-sm items-center gap-4">
              <Image
                src="/logo.png"
                alt="Golden Era Integra"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
                sizes="80px"
                quality={85}
              />
              <div>
                <p className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-[0.95] text-ink uppercase">
                  Golden <br className="max-sm:hidden" />
                  Era
                  <br className="sm:hidden" />
                  <span className="grad">Integra.</span>
                </p>
                <span
                  className="mt-2 block text-[12px] font-normal tracking-[0.06em] text-[color-mix(in_srgb,var(--ink)_40%,transparent)] [font-family:var(--font-family-jp)]"
                  lang="ja"
                >
                  黄金時代のインテグラ
                </span>
                <p className="mt-4 font-mono text-ink-ghost text-[11px] tracking-[0.3em] uppercase">
                  Las Vegas, Nevada / Vol. 01
                </p>
              </div>
            </div>
          </div>
          <nav
            className="col-span-1 md:col-span-3"
            aria-label="Footer site sections"
          >
            <h2 className="eyebrow-mono mb-4 text-magenta">Sections</h2>
            <ul className="space-y-2">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link
                    className="cursor-pointer text-ink-soft text-sm transition-colors hover:text-magenta"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav
            className="col-span-1 md:col-span-2"
            aria-label="Follow"
          >
            <h2 className="eyebrow-mono mb-4 text-magenta">Follow</h2>
            <ul className="space-y-2">
              {follow.map((item) => (
                <li key={item.label}>
                  <a
                    className={cn(
                      "text-ink-soft text-sm transition-colors hover:text-magenta",
                      "cursor-pointer"
                    )}
                    href={item.href}
                    rel={item.ext ? "noopener noreferrer" : undefined}
                    target={item.ext ? "_blank" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav
            className="col-span-1 md:col-span-2"
            aria-label="Credits"
          >
            <h2 className="eyebrow-mono mb-4 text-magenta">Credits</h2>
            <ul className="space-y-2">
              {credits.map((item) => (
                <li key={item.label}>
                  {item.ext ? (
                    <a
                      className="cursor-pointer text-ink-soft text-sm transition-colors hover:text-magenta"
                      href={item.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <a
                      className="text-ink-soft text-sm"
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="font-mono flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-ink-ghost text-[10px] tracking-[0.3em] uppercase sm:flex-row sm:items-center">
          <p>© 2026 Golden Era / All Frames Reserved</p>
          <p>Designed With Restraint. Built With Patience.</p>
          <p>1995 — Forever</p>
        </div>
      </div>
    </footer>
  );
}
