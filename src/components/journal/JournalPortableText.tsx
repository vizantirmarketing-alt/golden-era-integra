import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/client";
import type { SanityImageField } from "@/sanity/types";

type CalloutValue = {
  _type: "callout";
  title?: string;
  body?: string;
};

type CodeBlockValue = {
  _type: "codeBlock";
  filename?: string;
  language?: string;
  code?: string;
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="gesi-journal-p">{children}</p>,
    h2: ({ children }) => <h2 className="gesi-journal-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="gesi-journal-h3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="gesi-journal-bq">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="gesi-journal-ul">{children}</ul>,
    number: ({ children }) => <ol className="gesi-journal-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="gesi-journal-li">{children}</li>,
    number: ({ children }) => <li className="gesi-journal-li">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!href) {
        return <>{children}</>;
      }
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="gesi-journal-link"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const img = value as SanityImageField | undefined;
      if (!img?.asset) {
        return null;
      }
      const src = urlFor(img).width(1600).quality(82).url();
      const alt =
        typeof (value as { alt?: string })?.alt === "string"
          ? (value as { alt: string }).alt
          : "";
      const caption =
        typeof (value as { caption?: string })?.caption === "string"
          ? (value as { caption: string }).caption
          : "";
      return (
        <figure className="gesi-journal-figure">
          <div className="gesi-journal-figure-frame">
            <Image
              src={src}
              alt={alt || caption || "Journal image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, min(900px, 90vw)"
            />
          </div>
          {caption ? (
            <figcaption className="gesi-journal-figcaption">{caption}</figcaption>
          ) : null}
        </figure>
      );
    },
    callout: ({ value }) => {
      const v = value as CalloutValue;
      return (
        <aside className="gesi-journal-callout" aria-label={v.title || "Callout"}>
          {v.title ? <p className="gesi-journal-callout-title">{v.title}</p> : null}
          {v.body ? <p className="gesi-journal-callout-body">{v.body}</p> : null}
        </aside>
      );
    },
    codeBlock: ({ value }) => {
      const v = value as CodeBlockValue;
      const lang = v.language ?? "plaintext";
      return (
        <div className="gesi-journal-code-wrap">
          {v.filename ? (
            <div className="gesi-journal-code-filename font-mono">{v.filename}</div>
          ) : null}
          <pre className="gesi-journal-code">
            <code className={`language-${lang}`}>{v.code ?? ""}</code>
          </pre>
        </div>
      );
    },
  },
};

export function JournalPortableText({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value?.length) {
    return null;
  }
  return (
    <div className="gesi-journal-prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
