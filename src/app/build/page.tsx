import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { client } from "@/sanity/client";
import { specCategoriesQuery } from "@/sanity/queries";
import type { SpecCategory } from "@/sanity/types";
import { cn } from "@/lib/cn";

export default async function BuildPage() {
  const categories = await client.fetch<SpecCategory[]>(
    specCategoriesQuery,
    {},
    { next: { revalidate: 300 } }
  );

  const list = categories ?? [];
  const total = list.length;

  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-16">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 02"
                number="02"
                label="Specification"
                kanji="仕様"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-8 !text-balance sm:!pr-4">
              Period-correct.
              <br />
              <span className="grad">Driven daily.</span>
            </GradHeading>
            <p className="body-copy max-w-[36rem]">
              Every modification on this car could have plausibly been performed in
              2002. No coilovers with Bluetooth controllers. No carbon fiber where
              carbon fiber doesn&apos;t belong. The catalog is short and considered.
            </p>
          </div>
        </div>

        {total === 0 ? (
          <p className="body-copy max-w-md">
            Specification categories will appear here once they are published in
            Sanity Studio.
          </p>
        ) : (
          <div className="gesi-specs-grid">
            {list.map((cat, i) => (
              <article key={cat._id} className="gesi-spec-cat">
                <div className="gesi-spec-cat-head">
                  <div className="gesi-spec-name-block">
                    <div className="gesi-spec-cat-name">{cat.title}</div>
                    {cat.kanji ? (
                      <span className="gesi-spec-cat-kanji" lang="ja">
                        {cat.kanji}
                      </span>
                    ) : null}
                  </div>
                  <div className="gesi-spec-cat-idx" aria-label="Category index">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(total).padStart(2, "0")}
                  </div>
                </div>
                {(cat.items ?? []).map((item, rowIdx) => (
                  <div
                    key={item._key ?? `row-${rowIdx}`}
                    className="gesi-spec-row"
                  >
                    <span className="gesi-spec-lbl">{item.label}</span>
                    <span
                      className={cn(
                        "gesi-spec-val",
                        item.isMilano && "gesi-spec-val--milano"
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
