import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "Golden Era Integra — Las Vegas, Nevada — 1995 Acura Integra GS-R";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const logoPath = join(process.cwd(), "public", "logo.png");
  const logoBuf = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: 56,
          background: "linear-gradient(135deg, #fdf6ec 0%, #fde8d4 45%, #f25d8e33 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={280}
          height={280}
          style={{
            borderRadius: "50%",
            flexShrink: 0,
            boxShadow: "0 24px 80px rgba(26, 14, 46, 0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
            maxWidth: 620,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textTransform: "uppercase",
              color: "#1a0e2e",
            }}
          >
            Golden Era Integra
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(26, 14, 46, 0.55)",
            }}
          >
            Las Vegas · Nevada
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 26,
              lineHeight: 1.35,
              color: "rgba(26, 14, 46, 0.72)",
            }}
          >
            1995 Acura Integra GS-R · Milano Red · DC2
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
