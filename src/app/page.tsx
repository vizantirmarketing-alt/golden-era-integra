import { GradHeading, GradLine } from "@/components/GradHeading";
import { Marquee } from "@/components/Marquee";

/**
 * Full home is Phase 2. The marquee and a compact `GradHeading` sample
 * keep shared components in use for quick visual checks.
 */
export default function Home() {
  return (
    <div>
      <Marquee />
      <div className="mx-auto max-w-[var(--container)] px-4 py-20 sm:px-8 sm:py-32">
        <p className="eyebrow-mono mb-6">System check</p>
        <GradHeading
          as="h1"
          className="!mb-6 !text-3xl !normal-case [text-transform:none] sm:!text-4xl"
        >
          <span className="text-ink">Layout shell, fonts, and tokens are wired.</span>{" "}
          <GradLine variant="grad" className="!normal-case [text-transform:none]">
            Phase 2 next.
          </GradLine>
        </GradHeading>
        <p className="body-copy max-w-xl">
          Navigation and footer are fixed for every route. Replace this content
          when the home page is ported from the HTML reference.
        </p>
      </div>
    </div>
  );
}
