"use client";

import { useId, useRef, useState } from "react";

export type InquiryFormProps = {
  partTitle: string;
  partSlug: string;
  partNumber?: string | null;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function InquiryForm({ partTitle, partSlug, partNumber }: InquiryFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const open = () => {
    setClientError(null);
    setServerError(null);
    setStatus("idle");
    dialogRef.current?.showModal();
  };

  const close = () => {
    dialogRef.current?.close();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);
    setServerError(null);

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();
    if (!n || !em || !msg) {
      setClientError("Name, email, and message are required.");
      return;
    }
    if (!isValidEmail(em)) {
      setClientError("Enter a valid email address.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/garage-sale-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: n,
          email: em,
          message: msg,
          partTitle,
          partSlug,
          partNumber: partNumber?.trim() || "",
          website: honeypotRef.current?.value ?? "",
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
      if (!res.ok) {
        const errMsg = typeof obj?.error === "string" ? obj.error : "Something went wrong. Try again.";
        setServerError(errMsg);
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setServerError("Network error. Try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="w-full rounded-sm border border-[#c8102e] bg-[#c8102e] px-6 py-4 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#faf8f3] uppercase transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.99]"
      >
        Inquire about this part
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(100%,28rem)] border border-[rgba(26,24,22,0.12)] bg-[#faf8f3] p-0 text-[#1a1816] shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop:bg-black/40"
        aria-labelledby={titleId}
        onClose={() => {
          setStatus("idle");
          setClientError(null);
          setServerError(null);
        }}
      >
        <div className="border-b border-[rgba(26,24,22,0.1)] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="font-mono text-[10px] tracking-[0.2em] text-[#c8102e] uppercase">
              Part inquiry
            </h2>
            <button
              type="button"
              onClick={close}
              className="font-mono text-[10px] tracking-[0.16em] text-[rgba(26,24,22,0.55)] uppercase underline-offset-2 hover:text-[#1a1816] hover:underline"
            >
              Close
            </button>
          </div>
          <p className="mt-2 font-sans text-sm leading-snug text-[rgba(26,24,22,0.72)]">{partTitle}</p>
        </div>

        <div className="px-5 py-5">
          {status === "success" ? (
            <p className="text-center font-mono text-xs leading-relaxed text-[rgba(26,24,22,0.78)]">
              Got it. I&apos;ll reply within a day or two.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <input type="hidden" name="partTitle" value={partTitle} readOnly />
              <input type="hidden" name="partSlug" value={partSlug} readOnly />
              <input type="hidden" name="partNumber" value={partNumber ?? ""} readOnly />

              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-[rgba(26,24,22,0.55)] uppercase">
                  Name
                </span>
                <input
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-sm border border-[rgba(26,24,22,0.15)] bg-white px-3 py-2.5 font-sans text-sm text-[#1a1816] outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-[rgba(26,24,22,0.55)] uppercase">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-[rgba(26,24,22,0.15)] bg-white px-3 py-2.5 font-sans text-sm text-[#1a1816] outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-[rgba(26,24,22,0.55)] uppercase">
                  Message
                </span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full resize-y rounded-sm border border-[rgba(26,24,22,0.15)] bg-white px-3 py-2.5 font-sans text-sm text-[#1a1816] outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40"
                  required
                />
              </label>

              {/* Honeypot — must stay blank */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Website
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                </label>
              </div>

              {clientError ? (
                <p className="font-mono text-xs text-[#c8102e]" role="alert">
                  {clientError}
                </p>
              ) : null}
              {serverError ? (
                <p className="font-mono text-xs text-[#c8102e]" role="alert">
                  {serverError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-sm border border-[#1a1816] bg-[#1a1816] px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.22em] text-[#faf8f3] uppercase transition-opacity disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send inquiry"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
