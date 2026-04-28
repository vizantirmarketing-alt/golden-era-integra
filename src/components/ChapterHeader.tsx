import { cn } from "@/lib/cn";

type ChapterHeaderProps = {
  /** e.g. "Chapter 01" */
  chapterLabel: string;
  /** Large outline numeral, e.g. "01" */
  number: string;
  /** English label, e.g. "Origin Story" */
  label: string;
  /** Kanji annotation, e.g. 起源 */
  kanji: string;
  /** Sticks below the fixed nav (see reference `.col-side .sticky`). */
  sticky?: boolean;
  className?: string;
};

/**
 * 12-col sidebar (columns 1–3). In the reference layout this sits in `.col-side` with
 * a sticky block — pass `sticky` to mirror the HTML demo.
 */
export function ChapterHeader({
  chapterLabel,
  number,
  label,
  kanji,
  sticky = false,
  className,
}: ChapterHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col",
        sticky && "sticky top-[7.5rem] z-0",
        className
      )}
    >
      <p className="chapter-num-label">{chapterLabel}</p>
      <span aria-hidden className="chapter-num">
        {number}
      </span>
      <p className="chapter-tag">{label}</p>
      <span className="chapter-tag-jp" lang="ja">
        {kanji}
      </span>
    </header>
  );
}
