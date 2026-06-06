"use client";

import type { Signature } from "@/lib/supabase/signatures";
import dynamic from "next/dynamic";
import { SignatureWallSkeleton } from "./SignatureWallSkeleton";

const SignatureWall = dynamic(() => import("./SignatureWall"), {
  ssr: false,
  loading: () => <SignatureWallSkeleton />,
});

export function SignatureWallLazy({
  signatures,
  totalCount,
}: {
  signatures: Signature[];
  totalCount: number;
}) {
  return (
    <SignatureWall
      signatures={signatures}
      totalCount={totalCount}
    />
  );
}
