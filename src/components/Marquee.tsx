import { cn } from "@/lib/cn";
import { Fragment, type ReactNode } from "react";

type MarqueeSegment = {
  type: "text" | "jp" | "ghost";
  value: string;
  key: string;
};

const DEFAULT_SEGMENTS: MarqueeSegment[] = [
  { type: "text", value: "The Last Great Honda", key: "honda" },
  { type: "jp", value: "本田", key: "jp1" },
  { type: "ghost", value: "B18C1 VTEC", key: "vtec" },
  { type: "text", value: "Milano Red", key: "color" },
  { type: "jp", value: "鈴鹿 1995", key: "jp2" },
  { type: "text", value: "170 Horsepower", key: "hp" },
  { type: "ghost", value: "8,100 RPM", key: "rpm" },
  { type: "jp", value: "走行", key: "jp3" },
  { type: "text", value: "Las Vegas", key: "lv" },
];

function MarqueeGroup({ segments }: { segments: MarqueeSegment[] }) {
  return (
    <div
      className={cn(
        "flex items-center pr-6 font-display",
        "text-[length:clamp(1.3rem,3.2vw,2.5rem)]",
        "flex-none uppercase tracking-wider [letter-spacing:0.02em]"
      )}
    >
      {segments.map((seg) => (
        <Fragment key={seg.key}>
          {seg.type === "text" && <span className="whitespace-nowrap">{seg.value}</span>}
          {seg.type === "jp" && (
            <span
              className="whitespace-nowrap font-jp text-[0.7em] font-medium [letter-spacing:0.1em] [text-transform:none]"
              lang="ja"
            >
              {seg.value}
            </span>
          )}
          {seg.type === "ghost" && (
            <span
              className="whitespace-nowrap [color:transparent] [font-size:0.85em] [-webkit-text-stroke:1.4px_#fff]"
            >
              {seg.value}
            </span>
          )}
          <span
            className="mx-1 inline-block px-1 text-center text-white [font-size:0.65em] sm:px-1.5"
            aria-hidden
          >
            ✦
          </span>
        </Fragment>
      ))}
    </div>
  );
}

type MarqueeProps = {
  /**
   * Defaults to the reference strip. Pass a custom set of `MarqueeSegment[]`
   * with unique `key` values to repeat your own phrasing.
   */
  segments?: MarqueeSegment[];
  className?: string;
  /** Additional non-scrolling content (e.g. accessible description). */
  children?: ReactNode;
};

export function Marquee({ segments = DEFAULT_SEGMENTS, className, children }: MarqueeProps) {
  return (
    <section
      className={cn("relative z-10 overflow-hidden py-7", className)}
      style={{
        background: "linear-gradient(90deg, var(--blue), var(--magenta), var(--orange))",
        color: "white",
      }}
    >
      {children}
      <div className="gesi-marquee" aria-hidden>
        <MarqueeGroup segments={segments} />
        <MarqueeGroup segments={segments} />
      </div>
    </section>
  );
}
