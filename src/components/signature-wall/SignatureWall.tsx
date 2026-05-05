"use client";

import type { Signature, SignaturePath } from "@/lib/supabase/signatures";
import { MotionSection } from "@/components/home/MotionSection";
import { useCallback, useEffect, useRef, useState } from "react";
import { SignatureCard } from "./SignatureCard";
import { SignModal } from "./SignModal";

const PAGE_SIZE = 60;

const swBtnPrimary =
  "group relative inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[#faf8f3] px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1a1816] shadow-[0_6px_20px_rgba(0,0,0,0.2)] transition-[transform,box-shadow,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-[#c8102e] hover:text-[#faf8f3] hover:shadow-[0_12px_30px_rgba(200,16,46,0.35)]";

const swBtnOutline =
  "cursor-pointer rounded-full border border-[#6b6560] bg-transparent px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a29e] transition-[border-color,color,opacity] duration-300 hover:border-[#faf8f3] hover:text-[#faf8f3] disabled:cursor-not-allowed disabled:opacity-50";

export default function SignatureWall({
  adminToken,
}: {
  adminToken?: string;
}) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = !!adminToken;

  const fetchPage = useCallback(async (offset: number) => {
    const res = await fetch(
      `/api/signatures?limit=${PAGE_SIZE}&offset=${offset}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to load signatures");
    const json = (await res.json()) as { signatures: Signature[] };
    return json.signatures;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const first = await fetchPage(0);
        if (!alive) return;
        setSignatures(first);
        setHasMore(first.length === PAGE_SIZE);
      } catch (e: unknown) {
        if (alive)
          setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fetchPage]);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchPage(signatures.length);
      setSignatures((prev) => [...prev, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSubmit(entry: {
    name: string;
    location: string;
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
    setSignatures((prev) => [json.signature, ...prev]);
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
      alert("Delete failed");
      return;
    }
    setSignatures((prev) => prev.filter((s) => s.id !== id));
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
                {signatures.length.toString().padStart(3, "0")} signatures
              </span>
              {isAdmin ? (
                <span className="bg-[#c8102e] px-2 py-1 font-mono text-xs uppercase tracking-wider text-white">
                  ADMIN MODE
                </span>
              ) : null}
            </div>
          </header>

          <div className="py-16">
            {loading ? (
              <div className="py-20 text-center font-mono text-sm text-[#a8a29e]">
                Loading signatures…
              </div>
            ) : error ? (
              <div className="py-20 text-center font-mono text-sm text-[#c8102e]">
                {error}
              </div>
            ) : signatures.length === 0 ? (
              <div className="py-20 text-center font-mono text-sm text-[#a8a29e]">
                Be the first to sign the wall.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                {hasMore ? (
                  <div className="mt-12 text-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className={swBtnOutline}
                    >
                      {loadingMore ? "Loading…" : "Load More"}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <footer className="border-t border-[#2a2722] py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#a8a29e]">
                DC2 · DB8 · DC4 — Built different.
              </p>
              <p className="font-mono text-xs text-[#6b6560]">
                Vizantir · Golden Era Integra
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
