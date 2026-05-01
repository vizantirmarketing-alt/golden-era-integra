"use client";

import { cn } from "@/lib/cn";
import SignaturePadLib from "signature_pad";
import { useEffect, useRef, useState } from "react";

export type SignaturePadProps = {
  onChange: (svg: string | null) => void;
  className?: string;
  /** When `null`, clears the pad (controlled reset after submit). Omit for uncontrolled-only usage. */
  value?: string | null;
  /** For associating the field `<label htmlFor>`. */
  canvasId?: string;
};

function scaleCanvasToWrapper(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
): void {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = Math.max(1, Math.floor(cssWidth * ratio));
  canvas.height = Math.max(1, Math.floor(cssHeight * ratio));
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
  }
}

export function SignaturePad({
  onChange,
  className,
  value,
  canvasId,
}: SignaturePadProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    function syncOutput() {
      const p = padRef.current;
      if (!p) return;
      if (p.isEmpty()) {
        onChangeRef.current(null);
        setShowClear(false);
      } else {
        onChangeRef.current(p.toSVG());
        setShowClear(true);
      }
    }

    function fitAndPreserve() {
      const pad = padRef.current;
      if (!wrap || !canvas || !pad) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w <= 0 || h <= 0) return;
      const data = pad.toData();
      scaleCanvasToWrapper(canvas, w, h);
      pad.clear();
      if (data.length > 0) {
        pad.fromData(data);
      }
      syncOutput();
    }

    const w0 = wrap.clientWidth;
    const h0 = wrap.clientHeight;
    if (w0 > 0 && h0 > 0) {
      scaleCanvasToWrapper(canvas, w0, h0);
    }

    const pad = new SignaturePadLib(canvas, {
      penColor: "#1a1a1a",
      minWidth: 0.8,
      maxWidth: 2.5,
      velocityFilterWeight: 0.7,
      throttle: 16,
      backgroundColor: "rgba(0,0,0,0)",
    });
    padRef.current = pad;

    const onBegin = () => {
      setShowPlaceholder(false);
    };
    const onEnd = () => {
      syncOutput();
    };

    pad.addEventListener("beginStroke", onBegin);
    pad.addEventListener("endStroke", onEnd);

    fitAndPreserve();

    const ro = new ResizeObserver(() => {
      fitAndPreserve();
    });
    ro.observe(wrap);
    window.addEventListener("resize", fitAndPreserve);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fitAndPreserve);
      pad.removeEventListener("beginStroke", onBegin);
      pad.removeEventListener("endStroke", onEnd);
      padRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (value !== null) return;
    const pad = padRef.current;
    if (!pad) return;
    pad.clear();
    setShowPlaceholder(true);
    setShowClear(false);
  }, [value]);

  const handleClear = () => {
    const pad = padRef.current;
    if (!pad) return;
    pad.clear();
    setShowPlaceholder(true);
    setShowClear(false);
    onChange(null);
  };

  return (
    <div className={cn("gb-signature-pad", className)}>
      <div ref={wrapRef} className="gb-signature-pad-surface">
        <div className="gb-signature-pad-baseline" aria-hidden />
        <canvas
          id={canvasId}
          ref={canvasRef}
          className="gb-signature-pad-canvas"
          aria-label="Signature area"
        />
        {showPlaceholder ? (
          <span className="gb-signature-pad-placeholder">Sign here</span>
        ) : null}
      </div>
      <div className="gb-signature-pad-footer">
        {showClear ? (
          <button
            type="button"
            className="gb-signature-pad-clear"
            onClick={handleClear}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
