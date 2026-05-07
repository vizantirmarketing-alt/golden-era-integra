"use client";

import type { Signature, SignaturePath } from "@/lib/supabase/signatures";
import { MotionSection } from "@/components/home/MotionSection";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SignatureCard } from "./SignatureCard";
import { SignModal } from "./SignModal";

const swBtnPrimary =
  "group relative inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[#faf8f3] px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1a1816] shadow-[0_6px_20px_rgba(0,0,0,0.2)] transition-[transform,box-shadow,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-[#c8102e] hover:text-[#faf8f3] hover:shadow-[0_12px_30px_rgba(200,16,46,0.35)]";

export default function SignatureWall({
  adminToken,
  signatures: initialSignatures,
  totalCount: initialTotalCount,
}: {
  adminToken?: string;
  signatures: Signature[];
  totalCount: number;
}) {
  const [signatures, setSignatures] = useState<Signature[]>(initialSignatures);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = !!adminToken;
  const visibleSignatureCount = signatures.length;
  const desktopGridClassName =
    visibleSignatureCount === 1
      ? "md:max-w-[560px] md:grid-cols-1"
      : visibleSignatureCount === 2
        ? "md:max-w-[820px] md:grid-cols-2"
        : "md:max-w-[1200px] md:grid-cols-3";

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  async function handleSubmit(entry: {
    name: string;
    location: string;
    state: string;
    note: string;
    paths: SignaturePath[];
  }) {
    const res = await fetch("/api/signatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const json = (await res.json()) as { error?: string; signature: Signature };
    if (!res.ok) throw new Error(json.error || "Failed to submit");
    setSignatures((prev) => [json.signature, ...prev].slice(0, initialSignatures.length));
    setTotalCount((prev) => prev + 1);
    setOpen(false);
  }

  function handleDeleteClick(id: string) {
    if (!adminToken) return;

    if (confirmingDelete === id) {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = null;
      }
      setConfirmingDelete(null);
      void performDelete(id);
      return;
    }

    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    setConfirmingDelete(id);
    deleteTimeoutRef.current = setTimeout(() => {
      setConfirmingDelete(null);
      deleteTimeoutRef.current = null;
    }, 3000);
  }

  async function performDelete(id: string) {
    if (!adminToken) return;
    const res = await fetch(`/api/signatures/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    setSignatures((prev) => prev.filter((s) => s.id !== id));
    setTotalCount((prev) => Math.max(0, prev - 1));
  }

  return (
    <>
      <style>{`
        .sw-grid-bg {
          background-image:
            linear-gradient(rgba(250, 248, 243, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 248, 243, 0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .sw-card-tilt-1 { transform: rotate(-0.6deg); }
        .sw-card-tilt-2 { transform: rotate(0.4deg); }
        .sw-card-tilt-3 { transform: rotate(-0.3deg); }
        .sw-card-tilt-4 { transform: rotate(0.7deg); }
        .sw-pin {
          position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
          width: 10px; height: 10px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ef4444, #991b1b);
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
      `}</style>

      <MotionSection
        id="signature-wall"
        className="gesi-chapter border-t border-[#2a2722] bg-[#1a1816] text-[#faf8f3]"
      >
        <div className="gesi-container">
          <header className="sw-grid-bg border-b border-[#2a2722] px-0 py-12">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#a8a29e]">
              Golden Era · 1994 — 2001
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-family-display)] text-[clamp(2.25rem,6vw,3.75rem)] uppercase leading-[0.95] tracking-tight text-[#faf8f3]">
              The Signature Wall
            </h2>
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[#a8a29e]">
              Owner, admirer, or just passing through — leave your mark. Sign the
              wall, drop a note, become part of the page.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => setOpen(true)} className={swBtnPrimary}>
                Sign The Wall
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <span className="font-mono text-xs text-[#a8a29e]">
                {totalCount.toString().padStart(3, "0")} signatures
              </span>
              {isAdmin ? (
                <span className="bg-[#c8102e] px-2 py-1 font-mono text-xs uppercase tracking-wider text-white">
                  ADMIN MODE
                </span>
              ) : null}
            </div>
          </header>

          <div className="py-16">
            {error ? (
              <div className="py-20 text-center font-mono text-sm text-[#c8102e]">
                {error}
              </div>
            ) : signatures.length === 0 ? (
              <div className="py-20 text-center font-mono text-sm text-[#a8a29e]">
                Be the first to sign the wall.
              </div>
            ) : (
              <>
                <div
                  className={`mx-auto grid w-full grid-cols-1 gap-6 ${desktopGridClassName}`}
                >
                  {signatures.map((sig, i) => (
                    <SignatureCard
                      key={sig.id}
                      sig={sig}
                      tilt={`sw-card-tilt-${(i % 4) + 1}`}
                      isAdmin={isAdmin}
                      deleteConfirmArmed={confirmingDelete === sig.id}
                      onDelete={() => handleDeleteClick(sig.id)}
                    />
                  ))}
                </div>
                {totalCount > signatures.length ? (
                  <div className="mt-10">
                    <Link
                      href="/signatures"
                      className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[rgba(250,248,243,0.65)] transition-colors hover:text-[#faf8f3]"
                    >
                      <span>View all {totalCount} signatures</span>
                      <span className="text-[#c8102e] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <footer className="border-t border-[#2a2722] py-8">
            <div className="flex flex-wrap items-center justify-start gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#a8a29e]">
                DC2 · DB8 · DC4 — Built different.
              </p>
            </div>
          </footer>
        </div>
      </MotionSection>

      {open ? (
        <SignModal onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      ) : null}
    </>
  );
}
