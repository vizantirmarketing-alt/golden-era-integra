export type VideoProvider = "youtube" | "vimeo";

export type ParsedVideo = {
  provider: VideoProvider;
  id: string;
};

/**
 * Extract YouTube or Vimeo id from common watch / share URLs.
 */
export function parseVideoUrl(url: string | undefined | null): ParsedVideo | null {
  if (!url || typeof url !== "string") {
    return null;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
        return { provider: "youtube", id };
      }
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.slice("/embed/".length).split("/")[0]?.split("?")[0];
        if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
          return { provider: "youtube", id };
        }
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.slice("/shorts/".length).split("/")[0]?.split("?")[0];
        if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
          return { provider: "youtube", id };
        }
      }
      const v = u.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) {
        return { provider: "youtube", id: v };
      }
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const segments = u.pathname.split("/").filter(Boolean);
      const raw = segments[segments.length - 1];
      if (raw && /^\d+$/.test(raw)) {
        return { provider: "vimeo", id: raw };
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function embedSrcForVideo(parsed: ParsedVideo | null, autoplay: boolean): string | null {
  if (!parsed) {
    return null;
  }
  const ap = autoplay ? 1 : 0;
  if (parsed.provider === "youtube") {
    return `https://www.youtube.com/embed/${parsed.id}?autoplay=${ap}&rel=0`;
  }
  return `https://player.vimeo.com/video/${parsed.id}?autoplay=${ap}`;
}

export function youtubePosterUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
