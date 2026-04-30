import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Image from "next/image";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

function isHeroSlide(value: unknown): value is HeroSlide {
  if (!value || typeof value !== "object") {
    return false;
  }
  const rec = value as Record<string, unknown>;
  return (
    typeof rec.src === "string" &&
    typeof rec.label === "string" &&
    typeof rec.alt === "string" &&
    rec.src.startsWith("/hero/")
  );
}

async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const manifestPath = join(process.cwd(), "public", "hero", "manifest.json");
    const content = await readFile(manifestPath, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isHeroSlide);
  } catch {
    return [];
  }
}

export async function Hero() {
  const slides = await getHeroSlides();

  return (
    <section
      className="gesi-hero -mt-[var(--nav-offset)] min-h-dvh"
      aria-label="Hero"
    >
      <div className="gesi-hero__bg" aria-hidden />

      <div className="gesi-hero__meta gesi-hero__meta--tl">
        <div>N 36°10′30″ W 115°08′11″</div>
        <div>Las Vegas, Nevada</div>
        <span className="gesi-hero__accent">Chassis No. DC2-1102847</span>
        <span className="gesi-hero__meta-jp">鈴鹿製作所 1995</span>
      </div>
      <div className="gesi-hero__meta gesi-hero__meta--tr">
        <div>Vol. 01 / Issue 01</div>
        <div>1995 Acura Integra GS-R</div>
        <span className="gesi-hero__accent">A Documented Build</span>
        <span className="gesi-hero__meta-jp">本田技研工業</span>
      </div>

      <div className="gesi-hero__grid gesi-hero__grid--enter">
        <div className="gesi-hero__copy">
          <div className="gesi-hero__eyebrow">
            <span className="gesi-hero__eyebrow-dot" aria-hidden />
            The Last Great Honda
          </div>
          <h1 className="gesi-hero__h1 text-ink">
            <span className="gesi-hero__line">Golden</span>
            <span className="gesi-hero__line gesi-hero__line--grad">Era</span>
            <span className="gesi-hero__line gesi-hero__line--outline">Integra.</span>
          </h1>
          <p className="gesi-hero__title-jp" lang="ja">
            黄金時代のインテグラ
          </p>
          <p className="gesi-hero__sub">
            A 1995 Acura Integra GS-R in Milano Red. Built in Suzuka, found in
            Pasadena, driven in Las Vegas. This is the documented restoration of
            the last car Honda built before the world stopped paying attention.
          </p>
          <div className="gesi-hero__chips" role="list">
            <span className="gesi-chip gesi-chip--milano" role="listitem">
              Milano Red R-81
            </span>
            <span className="gesi-chip" role="listitem">
              DC2 Chassis
            </span>
            <span className="gesi-chip" role="listitem">
              B18C1 VTEC
            </span>
            <span className="gesi-chip" role="listitem">
              8,100 RPM
            </span>
          </div>
        </div>
        <div className="gesi-hero__logo">
          {slides.length > 0 ? (
            <HeroCarousel slides={slides} />
          ) : (
            <Image
              src="/logo.png"
              alt="Golden Era Integra logo"
              width={520}
              height={520}
              className="gesi-hero__logo-img h-auto w-full"
              priority
              sizes="(max-width: 899px) min(92vw, 520px), (max-width: 1279px) 45vw, 520px"
            />
          )}
        </div>
      </div>
    </section>
  );
}
