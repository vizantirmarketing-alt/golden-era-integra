/** CLS-safe placeholder while SignatureWall loads client-side (signature_pad, modal). */
export function SignatureWallSkeleton() {
  return (
    <section
      id="signature-wall"
      aria-hidden
      className="gesi-chapter border-t border-[#2a2722] bg-[#1a1816] text-[#faf8f3]"
    >
      <div className="gesi-container">
        <header className="border-b border-[#2a2722] px-0 py-12">
          <div className="h-3 w-48 animate-pulse rounded bg-[#2a2722]" />
          <div className="mt-3 h-12 w-full max-w-md animate-pulse rounded bg-[#2a2722]" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-[#2a2722]" />
          <div className="mt-8 h-12 w-44 animate-pulse rounded-full bg-[#2a2722]" />
        </header>

        <div className="py-16">
          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="min-h-[220px] animate-pulse rounded border border-[#2a2722] bg-[#222019]"
              />
            ))}
          </div>
        </div>

        <footer className="border-t border-[#2a2722] py-8">
          <div className="h-3 w-56 animate-pulse rounded bg-[#2a2722]" />
        </footer>
      </div>
    </section>
  );
}
