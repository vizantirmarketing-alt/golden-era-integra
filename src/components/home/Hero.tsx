import Image from "next/image";

export function Hero() {
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
      </div>
      <div className="gesi-hero__meta gesi-hero__meta--tr">
        <div>Vol. 01 / Issue 01</div>
        <div>1995 Acura Integra GS-R</div>
        <span className="gesi-hero__accent">A Documented Build</span>
      </div>

      <div className="gesi-hero__meta-jp gesi-hero__meta-jp--bl" lang="ja">
        鈴鹿製作所 1995
      </div>
      <div className="gesi-hero__meta-jp gesi-hero__meta-jp--br" lang="ja">
        本田技研工業
      </div>

      <div className="gesi-hero__grid gesi-hero__grid--enter">
        <div className="gesi-hero__media">
          <Image
            src="/hero/engine-bay.jpg"
            alt="1995 Acura Integra GS-R engine bay"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 40vw"
          />
        </div>
        <div className="gesi-hero__copy">
          <div className="gesi-hero__copy-inner">
            <div className="gesi-hero__eyebrow">
              <span className="gesi-hero__eyebrow-dot" aria-hidden />
              The Last Great Honda
            </div>
            <div className="gesi-hero__h1 text-ink">
              <span className="gesi-hero__line">Golden</span>
              <span className="gesi-hero__line gesi-hero__line--grad">Era</span>
              <span className="gesi-hero__line gesi-hero__line--outline">Integra.</span>
            </div>
            <p className="gesi-hero__title-jp" lang="ja">
              黄金時代のインテグラ
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
        </div>
      </div>
    </section>
  );
}
