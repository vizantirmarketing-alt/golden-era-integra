/** Shared copy for metadata / OG descriptions — keep in sync with page intros where sensible. */
export const seo = {
  siteName: "Golden Era Integra",
  defaultDescription:
    "A 1995 Acura Integra GS-R in Milano Red — Las Vegas, Nevada. Premium build documentation and journal.",
  home: {
    titleAbsolute: "Golden Era Integra — Las Vegas, Nevada",
    description:
      "A documented restoration of a 1995 Acura Integra GS-R in Milano Red. Suzuka-built, Vegas-driven — specifications, gallery, journal, and film.",
  },
  build: {
    title: "Specification",
    description:
      "Period-correct DC2 build specifications — engine, chassis, wheels, exterior — documented like a factory sheet set.",
  },
  gallery: {
    title: "Gallery",
    description:
      "Photography from Las Vegas and the open road — film and digital frames from the Golden Era Integra archive.",
  },
  journal: {
    title: "Build Journal",
    description:
      "Long-form entries on acquisition, restoration, and driving — the recorded history of this DC2.",
  },
  film: {
    title: "In Motion",
    description:
      "Video episodes — featured drives, garage notes, and the car in motion.",
  },
  guestbook: {
    title: "Guestbook",
    description:
      "Sign the visitor’s log — leave a note for fellow drivers and builders.",
  },
  notFound: {
    title: "Page not found",
    description: "That page doesn’t exist. Return home or explore the build archive.",
  },
} as const;
