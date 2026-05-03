import { cn } from "@/lib/cn";
import type { GalleryPhase } from "@/sanity/types";

const PHASE_EDITORIAL_LABEL: Record<GalleryPhase, string> = {
  before: "BEFORE",
  disassembly: "DISASSEMBLY",
  "body-prep": "BODY PREP",
  fitting: "FITTING",
  paint: "PAINT & BODY",
  engine: "ENGINE BUILD",
  assembly: "ASSEMBLY",
  finished: "FINISHED",
  parts: "PARTS",
};

const PHASE_KANJI: Record<GalleryPhase, string> = {
  before: "以前",
  disassembly: "分解",
  "body-prep": "下地",
  fitting: "仮合せ",
  paint: "塗装",
  engine: "エンジン",
  assembly: "組立",
  finished: "完成",
  parts: "部品",
};

type GalleryPhaseDividerProps = {
  /** Sub-chapter index within the gallery archive (first section = 2). */
  chapterNumber: number;
  phase: GalleryPhase;
  /** Earliest `capturedAt` year in this phase, or null when no dates. */
  year: string | null;
  className?: string;
};

export function GalleryPhaseDivider({
  chapterNumber,
  phase,
  year,
  className,
}: GalleryPhaseDividerProps) {
  const padded = String(chapterNumber).padStart(2, "0");
  const chapterLabel = `Chapter ${padded}`;

  return (
    <header
      className={cn("gesi-gallery-phase-divider flex flex-col", className)}
      aria-label={`${chapterLabel}: ${PHASE_EDITORIAL_LABEL[phase]}`}
    >
      <p className="chapter-num-label">{chapterLabel}</p>
      <span aria-hidden className="chapter-num">
        {padded}
      </span>
      <p className="chapter-tag">{PHASE_EDITORIAL_LABEL[phase]}</p>
      {year ? <p className="gesi-gallery-phase-year">{year}</p> : null}
      <span className="chapter-tag-jp" lang="ja">
        {PHASE_KANJI[phase]}
      </span>
    </header>
  );
}
