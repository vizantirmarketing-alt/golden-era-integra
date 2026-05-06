"use client";

import { GradHeading } from "@/components/GradHeading";
import type { BuildOutro, BuildSection } from "@/data/build-sections";
import { useCallback, useEffect, useRef, useState } from "react";

type BuildPageContentProps = {
  sections: readonly BuildSection[];
  introParagraphs: readonly string[];
  outro: BuildOutro;
};

const TYPE_R_RED = "#c8102e";
const DARK = "#1a1816";

function scrollSectionIntoView(
  id: string,
  behavior: ScrollBehavior,
): void {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  el.scrollIntoView({ behavior, block: "start" });
}

export function BuildPageContent({
  sections,
  introParagraphs,
  outro,
}: BuildPageContentProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [readPct, setReadPct] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const chipRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const scrollTicking = useRef(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const setChipRef = useCallback((id: string, el: HTMLAnchorElement | null) => {
    const map = chipRefs.current;
    if (el) {
      map.set(id, el);
    } else {
      map.delete(id);
    }
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-build-section]");
    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) {
          return;
        }
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const next = visible[0]?.target.id;
        if (next) {
          setActiveId(next);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (activeId === null) {
      return;
    }
    const chip = chipRefs.current.get(activeId);
    if (!chip) {
      return;
    }
    chip.scrollIntoView({
      inline: "center",
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [activeId, reducedMotion]);

  useEffect(() => {
    const onScroll = () => {
      if (scrollTicking.current) {
        return;
      }
      scrollTicking.current = true;
      requestAnimationFrame(() => {
        scrollTicking.current = false;
        const docEl = document.documentElement;
        const scrollable = docEl.scrollHeight - window.innerHeight;
        const next =
          scrollable > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
            : 0;
        setReadPct(next);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollSectionIntoView(id, reducedMotion ? "auto" : "smooth");
  };

  const stats: { value: string; label: string; cellClass?: string }[] = [
    { value: "04", label: "Years" },
    { value: "00", label: "Rust" },
    { value: "R-81", label: "Paint" },
    { value: "B18C1", label: "Engine", cellClass: "hidden md:block" },
    { value: "10", label: "Sections", cellClass: "hidden md:block" },
  ];

  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        {/* Hero */}
        <header className="mb-12 max-w-[48rem] md:mb-16">
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-[rgba(26,24,22,0.55)] uppercase">
            Vol. 01 — The Build
          </p>
          <GradHeading
            as="h1"
            className="!mb-6 !text-[clamp(36px,6vw,64px)] !leading-[0.95] !tracking-normal sm:!pr-4"
          >
            Hunted, not <span className="grad">bought</span>.
          </GradHeading>
          <p className="max-w-[42rem] font-sans text-base leading-[1.7] text-[rgba(26,24,22,0.78)]">
            Four years of sourcing, restoring, and waiting. The full build story.
          </p>

          <div
            className="mt-10 grid grid-cols-3 border-y border-[rgba(26,24,22,0.1)] md:grid-cols-5"
            aria-label="Build snapshot"
          >
            {stats.map((cell) => (
              <div
                key={cell.label}
                className={`flex flex-col items-center justify-center gap-1 border-[rgba(26,24,22,0.1)] border-r px-2 py-4 last:border-r-0 md:px-3 ${cell.cellClass ?? ""}`}
              >
                <span
                  className="font-display text-[22px] leading-none"
                  style={{ color: TYPE_R_RED }}
                >
                  {cell.value}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[rgba(26,24,22,0.55)] uppercase">
                  / {cell.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* Mobile section chips */}
        <div
          className="sticky z-10 -mx-6 w-screen max-w-[100vw] border-[rgba(26,24,22,0.1)] border-b bg-[#faf8f3] md:hidden"
          style={{
            top: "var(--nav-offset)",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          <div
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <a
                  key={s.id}
                  ref={(el) => setChipRef(s.id, el)}
                  href={`#${s.id}`}
                  data-section-id={s.id}
                  onClick={(e) => onNavClick(e, s.id)}
                  className={`shrink-0 snap-center rounded-sm px-3 py-2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-150 ${
                    active
                      ? "text-[#faf8f3]"
                      : "border border-[rgba(26,24,22,0.2)] text-[rgba(26,24,22,0.55)]"
                  }`}
                  style={
                    active
                      ? { backgroundColor: TYPE_R_RED }
                      : { backgroundColor: "transparent" }
                  }
                  aria-current={active ? "location" : undefined}
                >
                  <span className="opacity-80">{s.number}</span>{" "}
                  <span>{s.eyebrow}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
          {/* Desktop rail */}
          <aside className="relative hidden md:block">
            <div className="sticky top-24 flex min-h-[calc(100dvh-6rem)] flex-col gap-8">
              <div>
                <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-[rgba(26,24,22,0.55)] uppercase">
                  Sections
                </p>
                <nav aria-label="Build sections">
                  <ul className="flex flex-col gap-0">
                    {sections.map((s) => {
                      const active = activeId === s.id;
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={(e) => onNavClick(e, s.id)}
                            className={`block border-l-2 py-2.5 pr-2 pl-3 transition-colors duration-150 ${
                              active
                                ? "border-[#c8102e] bg-[rgba(200,16,46,0.08)] text-[#1a1816]"
                                : "border-transparent text-[rgba(26,24,22,0.45)]"
                            }`}
                            aria-current={active ? "location" : undefined}
                          >
                            <span className="mr-2 font-mono text-[9px] tracking-wider opacity-70">
                              {s.number}
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                              {s.eyebrow}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div className="mt-auto border-[rgba(26,24,22,0.1)] border-t pt-4">
                <div
                  className="h-[3px] w-full rounded-full bg-[rgba(26,24,22,0.12)]"
                  role="progressbar"
                  aria-valuenow={Math.round(readPct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Reading progress"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${readPct}%`,
                      backgroundColor: TYPE_R_RED,
                    }}
                  />
                </div>
                <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-[rgba(26,24,22,0.55)] uppercase">
                  {Math.round(readPct)}% read
                </p>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="min-w-0">
            <div className="space-y-6 pb-10">
              {introParagraphs.map((text, i) => (
                <p
                  key={`intro-${i}`}
                  className="max-w-[64ch] font-sans text-base leading-[1.7] text-[rgba(26,24,22,0.78)]"
                >
                  {text}
                </p>
              ))}
            </div>

            {sections.map((section, index) => {
              const isLast = index === sections.length - 1;
              const borderBlock = isLast
                ? ""
                : "border-[rgba(26,24,22,0.1)] border-b pb-10 mb-10";

              return (
                <section
                  key={section.id}
                  id={section.id}
                  data-build-section
                  className={`scroll-mt-24 ${borderBlock}`}
                >
                  <p className="mb-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[#c8102e]">
                    {section.number} / {section.eyebrow}
                  </p>
                  <h2 className="font-display text-[clamp(24px,4vw,34px)] leading-[0.95] tracking-[0.01em] text-[#1a1816] uppercase">
                    {section.headline}
                  </h2>
                  <div className="mt-6 space-y-6">
                    {section.paragraphs.map((text, pi) => (
                      <p
                        key={`${section.id}-p-${pi}`}
                        className="max-w-[64ch] font-sans text-base leading-[1.7] text-[rgba(26,24,22,0.78)]"
                      >
                        {text}
                      </p>
                    ))}
                  </div>

                  {section.id === "paint" ? (
                    <div
                      className="mt-8 flex max-w-md items-center gap-3 rounded px-4 py-3"
                      style={{ backgroundColor: DARK, borderRadius: 4 }}
                    >
                      <div
                        className="h-9 w-9 shrink-0"
                        style={{ backgroundColor: TYPE_R_RED }}
                        aria-hidden
                      />
                      <p className="font-sans text-sm leading-snug text-[#faf8f3]">
                        Honda code / R-81 Milano Red
                      </p>
                    </div>
                  ) : null}

                  {section.tags && section.tags.length > 0 ? (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {section.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-[2px] px-[9px] py-[3px] text-[11px] tracking-[0.04em] text-[#faf8f3]"
                          style={{ backgroundColor: DARK }}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}

            <footer className="mt-16 border-[rgba(26,24,22,0.1)] border-t pt-10">
              <h2 className="font-display text-[clamp(24px,4vw,34px)] leading-[0.95] tracking-[0.01em] text-[#1a1816] uppercase">
                {outro.headline}
              </h2>
              <div className="mt-6 space-y-6">
                {outro.paragraphs.map((text, i) => (
                  <p
                    key={`outro-${i}`}
                    className="max-w-[64ch] font-sans text-base leading-[1.7] text-[rgba(26,24,22,0.78)]"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
