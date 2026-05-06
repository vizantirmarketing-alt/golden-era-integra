import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const body = "text-[rgba(26,24,22,0.78)]";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className={`mb-4 font-sans text-base leading-[1.7] ${body} last:mb-0`}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className={`mb-4 list-disc space-y-1 pl-5 font-sans text-base leading-[1.7] ${body} last:mb-0`}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className={`mb-4 list-decimal space-y-1 pl-5 font-sans text-base leading-[1.7] ${body} last:mb-0`}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#1a1816]">{children}</strong>,
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
          className="text-[#c8102e] underline decoration-[#c8102e]/40 underline-offset-2 transition-colors hover:decoration-[#c8102e]"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

type PartPortableTextProps = {
  value: PortableTextBlock[] | null | undefined;
};

export function PartPortableText({ value }: PartPortableTextProps) {
  if (!value?.length) {
    return null;
  }
  return (
    <div className="part-pt">
      <PortableText value={value} components={components} />
    </div>
  );
}
