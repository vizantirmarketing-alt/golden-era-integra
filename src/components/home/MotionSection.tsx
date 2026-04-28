"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

type MotionSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
} & Omit<HTMLMotionProps<"section">, "children">;

export function MotionSection({
  id,
  className,
  children,
  ...rest
}: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      className={cn(className)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0% 0% -8% 0%" }}
      transition={{ duration: 0.8, ease }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
