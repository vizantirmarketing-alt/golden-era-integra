"use client";

import type { Signature } from "@/lib/supabase/signatures";
import dynamic from "next/dynamic";
import { SignatureWallSkeleton } from "./SignatureWallSkeleton";

const SignatureWall = dynamic(() => import("./SignatureWall"), {
  ssr: false,
  loading: () => <SignatureWallSkeleton />,
});

export function SignatureWallLazy({
  adminToken,
  signatures,
  totalCount,
}: {
  adminToken?: string;
  signatures: Signature[];
  totalCount: number;
}) {
  return (
    <SignatureWall
      adminToken={adminToken}
      signatures={signatures}
      totalCount={totalCount}
    />
  );
}
