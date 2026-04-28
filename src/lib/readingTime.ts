import type { PortableTextBlock } from "@portabletext/types";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function collectTextFromBlocks(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !("children" in block) || !block.children) {
        return "";
      }
      return block.children
        .map((child) => {
          if (child._type === "span" && "text" in child && typeof child.text === "string") {
            return child.text;
          }
          return "";
        })
        .join("");
    })
    .join(" ");
}

function collectFromCustomNodes(body: unknown[]): string {
  let extra = "";
  for (const node of body) {
    if (!node || typeof node !== "object" || !("_type" in node)) {
      continue;
    }
    const t = (node as { _type: string })._type;
    if (t === "callout" && "body" in node && typeof (node as { body?: string }).body === "string") {
      extra += ` ${(node as { body: string }).body}`;
    }
    if (t === "codeBlock" && "code" in node && typeof (node as { code?: string }).code === "string") {
      extra += ` ${(node as { code: string }).code}`;
    }
  }
  return extra;
}

/**
 * Rough reading time from Portable Text (blocks + callout/code text), words / 200, min 1.
 */
export function estimateReadingTimeMinutes(
  blocks: PortableTextBlock[] | null | undefined
): number {
  if (!blocks?.length) {
    return 1;
  }
  const text = `${collectTextFromBlocks(blocks)} ${collectFromCustomNodes(blocks as unknown[])}`.trim();
  if (!text) {
    return 1;
  }
  const words = countWords(text);
  return Math.max(1, Math.round(words / 200));
}
