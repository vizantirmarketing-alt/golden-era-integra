"use client";

import type { SignaturePath } from "@/lib/supabase/signatures";
import { ALL_REGIONS } from "@/lib/states";
import { useCallback, useEffect, useRef, useState } from "react";

const COLORS = [
  { name: "ink", value: "#0a0a0a" },
  { name: "red", value: "#c8102e" },
  { name: "blue", value: "#1e40af" },
  { name: "green", value: "#15803d" },
];

const swBtnPrimary =
  "cursor-pointer rounded-full border-none bg-ink px-6 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-bg shadow-[0_6px_20px_rgba(26,14,46,0.15)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#c8102e] hover:shadow-[0_12px_30px_rgba(200,16,46,0.35)] disabled:cursor-not-allowed disabled:opacity-50";

const swBtnGhost =
  "cursor-pointer rounded-full border-none bg-transparent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50";

const swToolBtnOn =
  "border-ink bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bg";
const swToolBtnOff =
  "border-line bg-bg-warm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:border-ink hover:text-ink";

export function SignModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (entry: {
    name: string;
    location: string;
    state: string;
    note: string;
    paths: SignaturePath[];
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [strokes, setStrokes] = useState<SignaturePath[]>([]);
  const [current, setCurrent] = useState<SignaturePath | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const W = 600;
  const H = 240;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const all = current ? [...strokes, current] : strokes;
    for (const s of all) {
      if (s.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(s.points[0][0], s.points[0][1]);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i][0], s.points[i][1]);
      }
      ctx.stroke();
    }
  }, [strokes, current]);

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, []);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): [number, number] => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
      return [
        (point.clientX - rect.left) * scaleX,
        (point.clientY - rect.top) * scaleY,
      ];
    },
    [],
  );

  function start(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const pt = getPos(e);
    const strokeColor = tool === "eraser" ? "#ffffff" : color;
    const strokeSize = tool === "eraser" ? 16 : size;
    setCurrent({ color: strokeColor, size: strokeSize, points: [pt] });
  }

  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!current) return;
    e.preventDefault();
    const pt = getPos(e);
    setCurrent({ ...current, points: [...current.points, pt] });
  }

  function end() {
    if (!current) return;
    if (current.points.length > 1) setStrokes([...strokes, current]);
    setCurrent(null);
  }

  function handleClearClick() {
    if (strokes.length === 0) return;

    if (confirmingClear) {
      setStrokes([]);
      setConfirmingClear(false);
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }
      return;
    }

    setConfirmingClear(true);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    clearTimeoutRef.current = setTimeout(() => {
      setConfirmingClear(false);
      clearTimeoutRef.current = null;
    }, 3000);
  }

  async function submit() {
    setSubmitError(null);
    if (!state) {
      setSubmitError("Please select a state");
      return;
    }
    if (!name.trim()) {
      setSubmitError("Please add your name.");
      return;
    }
    if (strokes.length === 0) {
      setSubmitError("Please draw your signature first.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        location: location.trim(),
        state,
        note: note.trim(),
        paths: strokes,
      });
      setState("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-bg-deep/65 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-md border border-line bg-bg shadow-[0_24px_80px_rgba(26,14,46,0.22)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sw-modal-title"
      >
        <div
          className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-blue via-magenta to-orange"
          aria-hidden
        />
        <div className="flex items-center justify-between border-b border-line px-6 py-4 pt-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Leave your mark
            </div>
            <h2
              id="sw-modal-title"
              className="font-[family-name:var(--font-family-display)] text-2xl uppercase leading-tight tracking-tight text-ink"
            >
              Sign the Wall
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center font-mono text-lg leading-none text-ink transition-colors hover:bg-bg-warm"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Name *"
              value={name}
              onChange={setName}
              placeholder="Your name"
            />
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                State <span className="text-[#c8102e]">*</span>
              </span>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full rounded border border-line bg-bg-warm px-3 py-2 font-sans text-sm text-ink transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-ink-ghost focus:border-magenta focus:bg-bg focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,56,164,0.12)]"
              >
                <option value="">Select your state</option>
                {ALL_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="City, Country"
            />
          </div>
          <Field
            label="Note (optional)"
            value={note}
            onChange={setNote}
            placeholder="Say something — or don't"
            maxLength={60}
          />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <ToolButton active={tool === "pen"} onClick={() => setTool("pen")}>
              Pen
            </ToolButton>
            <ToolButton
              active={tool === "eraser"}
              onClick={() => setTool("eraser")}
            >
              Eraser
            </ToolButton>
            <div className="h-6 w-px bg-line" />
            <div className="flex gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setColor(c.value);
                    setTool("pen");
                  }}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    color === c.value && tool === "pen"
                      ? "scale-110 border-ink"
                      : "border-line"
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.name}
                />
              ))}
            </div>
            <div className="h-6 w-px bg-line" />
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="border border-line bg-bg-warm px-2 py-1 font-mono text-xs text-ink"
            >
              <option value={2}>Thin</option>
              <option value={3}>Medium</option>
              <option value={5}>Thick</option>
            </select>
            <button
              type="button"
              onClick={handleClearClick}
              className={`ml-auto cursor-pointer border-none bg-transparent font-mono text-[10px] uppercase tracking-widest underline decoration-1 underline-offset-[3px] transition-colors ${
                confirmingClear
                  ? "text-[#c8102e]"
                  : "text-ink-faint hover:text-[#c8102e]"
              }`}
            >
              {confirmingClear ? "Tap again to confirm" : "Redraw"}
            </button>
          </div>

          <div className="relative border border-line bg-bg-warm shadow-inner">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="block w-full touch-none"
              style={{
                aspectRatio: `${W} / ${H}`,
                cursor: tool === "eraser" ? "cell" : "crosshair",
              }}
              onMouseDown={start}
              onMouseMove={move}
              onMouseUp={end}
              onMouseLeave={end}
              onTouchStart={start}
              onTouchMove={move}
              onTouchEnd={end}
            />
            {strokes.length === 0 && !current ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="font-sans text-2xl font-light italic text-ink-ghost">
                  Sign here
                </span>
              </div>
            ) : null}
          </div>

          {submitError ? (
            <div className="border border-[#c8102e]/30 bg-[#c8102e]/5 px-3 py-2 font-mono text-xs text-[#c8102e]">
              {submitError}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={swBtnGhost}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className={swBtnPrimary}
            >
              {submitting ? "Adding…" : "Add to Wall →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 40,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded border border-line bg-bg-warm px-3 py-2 font-sans text-sm text-ink transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-ink-ghost focus:border-magenta focus:bg-bg focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,56,164,0.12)]"
      />
    </label>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border transition-colors ${active ? swToolBtnOn : swToolBtnOff}`}
    >
      {children}
    </button>
  );
}
