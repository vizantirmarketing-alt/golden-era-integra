"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const links = [
  { href: "/#origin", label: "Story" },
  { href: "/build", label: "The Build" },
  { href: "/archive", label: "The Archive" },
  { href: "/sessions", label: "Sessions" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `nav-menu-${id}`;
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 border-b border-line-soft px-4 py-4 sm:px-6"
      style={{
        WebkitBackdropFilter: "blur(12px) saturate(1.2)",
        backdropFilter: "blur(12px) saturate(1.2)",
        background: "rgba(253, 246, 236, 0.78)",
      }}
    >
      <div className="relative mx-auto flex max-w-[var(--container)] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex max-w-[min(100%,280px)] items-center gap-3"
          onClick={close}
        >
          <Image
            src="/logo.png"
            alt="Golden Era Integra"
            width={44}
            height={44}
            className="h-9 w-9 object-contain sm:h-11 sm:w-11"
            priority
          />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-[15px] tracking-wider text-ink uppercase sm:text-lg">
              Golden Era Integra
            </span>
            <span className="mt-1 font-mono text-[8px] text-ink-ghost tracking-[0.3em] uppercase sm:text-[9px]">
              Las Vegas, NV
            </span>
          </div>
        </Link>

        <div
          id={panelId}
          className={cn(
            "absolute top-full right-0 left-0 z-10 flex max-h-[min(100vh,480px)] flex-col gap-0 overflow-y-auto border-b border-line bg-bg shadow-[0_12px_40px_rgba(26,14,46,0.08)] transition-[opacity,transform] duration-300",
            "md:static md:ml-auto md:max-h-none md:flex md:w-auto md:max-w-none md:flex-row md:items-center md:justify-end md:gap-6 lg:gap-8 md:overflow-visible md:border-0 md:bg-transparent md:shadow-none",
            open
              ? "max-md:visible translate-y-0 max-md:opacity-100"
              : "-translate-y-3 max-md:pointer-events-none max-md:invisible max-md:select-none max-md:opacity-0",
            "md:translate-y-0 md:opacity-100 md:pointer-events-auto"
          )}
        >
          {links.map(({ href, label }, index) => (
            <Link
              key={href}
              ref={index === 0 ? firstLinkRef : undefined}
              href={href}
              className="group relative border-b border-line-soft px-4 py-3.5 font-mono text-ink no-underline transition-colors last:max-md:border-b-0 max-md:text-xs md:border-0 md:px-0 md:py-0 md:text-[10px] lg:text-[11px] md:tracking-[0.16em] lg:tracking-[0.2em] uppercase sm:px-6"
              onClick={close}
            >
              {label}
              <span
                className="pointer-events-none absolute -bottom-1 left-0 hidden h-0.5 w-full origin-left scale-x-0 transform bg-gradient-to-r from-magenta to-orange transition-transform duration-300 group-hover:scale-x-100 md:block"
                aria-hidden
              />
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="z-20 flex h-10 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-line px-3 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-haspopup="true"
        >
          <span
            className={cn(
              "h-0.5 w-5 rounded-sm bg-ink transition-transform duration-300",
              open && "translate-y-1.5 rotate-45"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-5 rounded-sm bg-ink transition-opacity duration-300",
              open && "opacity-0"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-5 rounded-sm bg-ink transition-transform duration-300",
              open && "-translate-y-1.5 -rotate-45"
            )}
          />
        </button>
      </div>
    </nav>
  );
}
