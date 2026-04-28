"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  return (
    <section
      className="gesi-hero -mt-[var(--nav-offset)] min-h-dvh pt-[var(--nav-offset)]"
      aria-label="Hero"
    >
      <div className="gesi-hero__bg" aria-hidden />

      <div className="gesi-hero__meta gesi-hero__meta--tl max-md:[top:4.5rem] max-md:max-w-[40%] max-md:[font-size:8px] max-md:leading-[1.5] max-md:[letter-spacing:0.15em]">
        <div>N 36°10′30″ W 115°08′11″</div>
        <div>Las Vegas, Nevada</div>
        <span className="gesi-hero__accent">Chassis No. DC2-1102847</span>
        <span className="gesi-hero__meta-jp">鈴鹿製作所 1995</span>
      </div>
      <div className="gesi-hero__meta gesi-hero__meta--tr max-md:[top:4.5rem] max-md:max-w-[40%] max-md:[font-size:8px] max-md:leading-[1.5] max-md:[letter-spacing:0.15em]">
        <div>Vol. 01 / Issue 01</div>
        <div>1995 Acura Integra GS-R</div>
        <span className="gesi-hero__accent">A Documented Build</span>
        <span className="gesi-hero__meta-jp">本田技研工業</span>
      </div>

      <motion.div
        className="gesi-hero__grid"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease }}
      >
        <div>
          <div className="gesi-hero__eyebrow">
            <span className="gesi-hero__eyebrow-dot" aria-hidden />
            The Last Great Honda
          </div>
          <h1 className="gesi-hero__h1 text-ink">
            <span className="gesi-hero__line">Golden</span>
            <span className="gesi-hero__line gesi-hero__line--grad">Era</span>
            <span className="gesi-hero__line gesi-hero__line--outline">Integra.</span>
          </h1>
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
          <Image
            src="/logo.png"
            alt="Golden Era Integra logo"
            width={520}
            height={520}
            className="gesi-hero__logo-img h-auto w-full"
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </motion.div>
    </section>
  );
}
