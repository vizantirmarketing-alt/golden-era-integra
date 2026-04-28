import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3";

type GradHeadingProps = {
  as?: HeadingTag;
  className?: string;
  id?: string;
  children: ReactNode;
};

/**
 * H2 (default) for chapter-style titles. Use with inline spans: `<span className="grad">`,
 * `<span className="outline">` or unstyled for solid ink, matching the static reference.
 */
export function GradHeading({
  as: Comp = "h2",
  className,
  id,
  children,
}: GradHeadingProps) {
  return (
    <Comp className={cn("chapter-h", className)} id={id}>
      {children}
    </Comp>
  );
}

type SpanVariant = "grad" | "outline" | "solid";

type GradLineProps = { variant?: SpanVariant; className?: string; children: ReactNode };

/**
 * Optional span helper for the three text treatments; `font-display` and sizing come from
 * the parent `GradHeading` / `chapter-h` in CSS. Use `solid` for unstyled ink in all caps
 * (inherits color).
 */
export function GradLine({ variant = "solid", className, children }: GradLineProps) {
  if (variant === "grad") {
    return <span className={cn("grad", className)}>{children}</span>;
  }
  if (variant === "outline") {
    return <span className={cn("outline", className)}>{children}</span>;
  }
  return <span className={className}>{children}</span>;
}
