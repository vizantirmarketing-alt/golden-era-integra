/** Shared copy for metadata / OG descriptions — keep in sync with page intros where sensible. */
export const seo = {
  siteName: "Golden Era Integra",
  defaultDescription:
    "A 1995 Acura Integra GS-R in Milano Red — Las Vegas, Nevada. Premium build documentation and photography.",
  home: {
    titleAbsolute: "Golden Era Integra — Las Vegas, Nevada",
    description:
      "A documented restoration of a 1995 Acura Integra GS-R in Milano Red. Suzuka-built, Vegas-driven — specifications, gallery, and film.",
  },
  build: {
    title: "Specification",
    description:
      "Period-correct DC2 build specifications — engine, chassis, wheels, exterior — documented like a factory sheet set.",
  },
  buildStory: {
    titleAbsolute: "The Build · Golden Era Integra",
    title: "The Build",
    description:
      "Four years of sourcing genuine Honda parts, restoring glass, and rebuilding the B18C — the full build story of a 1995 Acura Integra GS-R.",
  },
  gallery: {
    title: "Gallery",
    description:
      "Photography from Las Vegas and the open road — film and digital frames from the Golden Era Integra archive.",
  },
  film: {
    title: "In Motion",
    description:
      "Video episodes — featured drives, garage notes, and the car in motion.",
  },
  notFound: {
    title: "Page not found",
    description: "That page doesn’t exist. Return home or explore the build archive.",
  },
} as const;
