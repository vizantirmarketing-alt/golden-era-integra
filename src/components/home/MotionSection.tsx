"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MotionSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "children">;

export function MotionSection({
  id,
  className,
  children,
  ...rest
}: MotionSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
