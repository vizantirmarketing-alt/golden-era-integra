"use client";

import { cn } from "@/lib/cn";
import { containsProfanity } from "@/lib/profanity";
import {
  avatarForName,
  filterHandleCore,
  timeAgoFromIso,
} from "@/lib/guestbookUi";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { SignaturePad } from "@/components/guestbook/SignaturePad";

type GuestbookPublicRow = {
  id: string;
  name: string;
  handle: string | null;
  message: string;
  signature_svg?: string | null;
  created_at: string;
};

function instagramHref(handle: string): string {
  const user = handle.replace(/^@/, "");
  return `https://instagram.com/${encodeURIComponent(user)}`;
}

function GuestbookEntrySignature({ svg }: { svg: string }) {
  const html = useMemo(
    () =>
      DOMPurify.sanitize(svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
      }),
    [svg],
  );
  return (
    <div
      className="gb-entry-signature"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function GuestbookClient() {
  const [entries, setEntries] = useState<GuestbookPublicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [handleCore, setHandleCore] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [enteringIds, setEnteringIds] = useState(() => new Set<string>());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/guestbook");
        if (!res.ok) throw new Error("fetch failed");
        const data: unknown = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setEntries(data as GuestbookPublicRow[]);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!status) return;
    const t = window.setTimeout(() => setStatus(null), 4000);
    return () => window.clearTimeout(t);
  }, [status]);

  const msgLen = message.length;
  const counterWarn = msgLen > 250;

  const handleCoreChange = useCallback((raw: string) => {
    setHandleCore(filterHandleCore(raw));
  }, []);

  const validateClient = useCallback((): string | null => {
    const n = name.trim();
    const m = message.trim();
    if (!n) return "Name is required.";
    if (n.length > 40) return "Name must be 40 characters or fewer.";
    if (!m) return "Message is required.";
    if (m.length < 4) return "Message is too short.";
    if (m.length > 280) return "Message must be 280 characters or fewer.";
    const handleOut =
      handleCore.length > 0 ? (`@${handleCore}` as const) : null;
    const parts = [n, m, ...(handleOut ? [handleOut] : [])];
    for (const p of parts) {
      if (containsProfanity(p)) {
        return "Your post contains language that isn't allowed.";
      }
    }
    return null;
  }, [name, message, handleCore]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const err = validateClient();
      if (err) {
        setStatus({ kind: "error", text: err });
        return;
      }

      const n = name.trim();
      const m = message.trim();
      const handlePayload =
        handleCore.length > 0 ? `@${handleCore}` : undefined;

      setSubmitting(true);
      try {
        const res = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: n,
            message: m,
            signature_svg: signature,
            ...(handlePayload !== undefined ? { handle: handlePayload } : {}),
          }),
        });

        const payload: unknown = await res.json().catch(() => ({}));
        const body = payload as { error?: string };

        if (res.status === 429) {
          setStatus({
            kind: "error",
            text: body.error ?? "Too many posts. Try again later.",
          });
          return;
        }

        if (!res.ok) {
          setStatus({
            kind: "error",
            text:
              body.error ??
              (res.status === 400
                ? "Could not submit your entry."
                : "Something went wrong."),
          });
          return;
        }

        const row = payload as GuestbookPublicRow;
        if (!row?.id) {
          setStatus({ kind: "error", text: "Unexpected response from server." });
          return;
        }

        setEnteringIds((prev) => new Set(prev).add(row.id));
        setEntries((prev) => {
          const rest = prev.filter((x) => x.id !== row.id);
          return [row, ...rest];
        });
        setName("");
        setHandleCore("");
        setMessage("");
        setSignature(null);
        setStatus({ kind: "success", text: "Thanks — your note is live." });
      } finally {
        setSubmitting(false);
      }
    },
    [handleCore, message, name, signature, validateClient],
  );

  const countLabel = useMemo(() => {
    const n = entries.length;
    return `${n} ${n === 1 ? "Entry" : "Entries"}`;
  }, [entries.length]);

  return (
    <div className="gesi-guestbook-layout">
      <div className="gb-form">
        <div className="gb-form-title">Leave a Message</div>
        <div className="gb-form-sub">記帳</div>

        <form onSubmit={onSubmit} noValidate>
          <div className="gb-field">
            <label htmlFor="gb-name">
              Name <span className="req">*</span>
            </label>
            <input
              id="gb-name"
              className="gb-input"
              type="text"
              maxLength={40}
              autoComplete="name"
              placeholder="James T."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="gb-field">
            <label htmlFor="gb-handle">Instagram Handle</label>
            <div className="gb-handle-row">
              <span className="gb-handle-prefix" aria-hidden>
                @
              </span>
              <input
                id="gb-handle"
                className="gb-input gb-input--handle"
                type="text"
                maxLength={31}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="golden.era.integra"
                value={handleCore}
                onChange={(e) => handleCoreChange(e.target.value)}
              />
            </div>
          </div>

          <div className="gb-field">
            <label htmlFor="gb-msg">
              Message <span className="req">*</span>
            </label>
            <textarea
              id="gb-msg"
              className="gb-textarea"
              maxLength={280}
              rows={5}
              placeholder="Beautiful build. That Milano Red hits different at golden hour."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              className={cn("gb-counter", counterWarn && "warn")}
              aria-live="polite"
            >
              {msgLen} / 280
            </div>
          </div>

          <div className="gb-field">
            <label htmlFor="gb-signature-canvas">Sign the log</label>
            <div className="gb-field-sub-kanji">記帳</div>
            <SignaturePad
              canvasId="gb-signature-canvas"
              value={signature}
              onChange={setSignature}
            />
          </div>

          <button
            type="submit"
            className="gb-submit"
            disabled={submitting}
          >
            Sign Guestbook →
          </button>

          {status ? (
            <div
              className={cn(
                "gb-status show",
                status.kind === "success" ? "success" : "error",
              )}
              role="status"
            >
              {status.text}
            </div>
          ) : null}
        </form>
      </div>

      <div className="gb-feed-wrap">
        <div className="gb-feed-head">
          <div className="title">Recent Entries</div>
          <div className="count">{countLabel}</div>
        </div>

        <div className="gb-feed">
          {loading ? (
            <div className="gb-empty">Loading…</div>
          ) : loadError ? (
            <div className="gb-empty">Could not load entries.</div>
          ) : entries.length === 0 ? (
            <div className="gb-empty">— No entries yet. Be the first. —</div>
          ) : (
            entries.map((entry) => {
              const avatar = avatarForName(entry.name);
              const isEntering = enteringIds.has(entry.id);
              return (
                <motion.article
                  key={entry.id}
                  className="gb-entry"
                  initial={isEntering ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onAnimationComplete={() => {
                    setEnteringIds((prev) => {
                      if (!prev.has(entry.id)) return prev;
                      const next = new Set(prev);
                      next.delete(entry.id);
                      return next;
                    });
                  }}
                >
                  <div className="gb-entry-head">
                    <div
                      className="gb-avatar"
                      style={{ background: avatar.gradient }}
                      aria-hidden
                    >
                      {avatar.initial}
                    </div>
                    <div className="gb-entry-headline">
                      <span className="gb-name">{entry.name}</span>
                      {entry.handle ? (
                        <>
                          <span className="gb-entry-sep" aria-hidden>
                            {" "}
                            ·{" "}
                          </span>
                          <a
                            className="gb-handle"
                            href={instagramHref(entry.handle)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {entry.handle}
                          </a>
                        </>
                      ) : null}
                      <span className="gb-entry-sep" aria-hidden>
                        {" "}
                        ·{" "}
                      </span>
                      <span className="gb-time">
                        {timeAgoFromIso(entry.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="gb-entry-body">
                    <div className="gb-msg">{entry.message}</div>
                    {entry.signature_svg ? (
                      <GuestbookEntrySignature svg={entry.signature_svg} />
                    ) : null}
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
