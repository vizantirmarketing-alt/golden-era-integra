import { GradLine } from "@/components/GradHeading";

/**
 * Title overlay: gradient on a “key” segment — first comma split, else last word.
 */
export function JournalHeroTitle({ title }: { title: string }) {
  const trimmed = title.trim();
  const comma = trimmed.indexOf(",");
  if (comma !== -1) {
    const lead = trimmed.slice(0, comma + 1);
    const rest = trimmed.slice(comma + 1).trim();
    return (
      <>
        {lead}
        {rest ? (
          <>
            <br />
            <GradLine variant="grad">{rest}</GradLine>
          </>
        ) : null}
      </>
    );
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return <GradLine variant="grad">{trimmed}</GradLine>;
  }
  const grad = words.pop()!;
  const lead = words.join(" ");
  return (
    <>
      {lead}{" "}
      <GradLine variant="grad">{grad}</GradLine>
    </>
  );
}
