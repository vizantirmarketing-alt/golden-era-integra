import type { GalleryImage, GridSpan } from "@/sanity/types";

export type PartsPhotoSpec = {
  file: string;
  order: number;
  gridSpan: GridSpan;
  caption: string;
  alt: string;
};

export type PartsSectionSpec = {
  titleEnglish: string;
  kanji: string;
  romaji: string;
  intro?: string;
  photos: readonly PartsPhotoSpec[];
};

/** Single source for /parts layout and `scripts/import-parts-phase.ts` (order, gridSpan, caption, alt). */
export const PARTS_SECTIONS: readonly PartsSectionSpec[] = [
  {
    titleEnglish: "ENGINE BAY",
    kanji: "機関室",
    romaji: "Kikanshitsu",
    intro:
      "The engine bay collection. Some pieces installed, some still in boxes, some passed through and moved on.",
    photos: [
      {
        file: "css.jpg",
        order: 10,
        gridSpan: "g6",
        caption:
          "CSS-machined block. Traum pistons inside, ready for the rebuild when the time comes.",
        alt: "CSS-machined engine block with Traum pistons",
      },
      {
        file: "password-jdm-cooling-plate.jpg",
        order: 20,
        gridSpan: "g3",
        caption: "Password:JDM carbon fiber radiator cooling plate. Came from Japan in a Fragile box.",
        alt: "Password JDM carbon fiber radiator cooling plate",
      },
      {
        file: "password-jdm-sparkplug-cover.jpg",
        order: 30,
        gridSpan: "g3",
        caption:
          "Password:JDM kevlar spark plug cover. The weave catches light differently than standard carbon.",
        alt: "Password JDM kevlar spark plug cover",
      },
      {
        file: "greddy-supreme-sp.jpg",
        order: 40,
        gridSpan: "g4",
        caption: "Greddy Supreme SP exhaust. The car has run a few different exhaust setups over the years.",
        alt: "Greddy Supreme SP exhaust system",
      },
      {
        file: "raychem-engine-tucked-wires.jpg",
        order: 50,
        gridSpan: "g4",
        caption:
          "Raychem DR-25 milspec heat shrink. The same stuff used in aerospace and motorsports wiring.",
        alt: "Raychem DR-25 heat shrink on tucked engine wiring",
      },
    ],
  },
  {
    titleEnglish: "STEERING WHEEL",
    kanji: "操舵",
    romaji: "Sōda",
    intro:
      "The Momo steering wheel that came stock in every JDM Integra Type R. Mine needed restoration. Sent it to Gabe Custom for a full rewrap — perforated leather, red cross-stitch.",
    photos: [
      {
        file: "jdm-steering-wheel-1.jpg",
        order: 60,
        gridSpan: "g6",
        caption: "Before. Faded, dirty, well-used. Forty years of hands.",
        alt: "JDM Momo steering wheel before restoration, worn leather",
      },
      {
        file: "jdm-steering-wheel-2.jpg",
        order: 70,
        gridSpan: "g6",
        caption: "The leather had given up. Time for fresh hide.",
        alt: "Worn steering wheel leather close-up",
      },
      {
        file: "jdm-steering-wheel-3.jpg",
        order: 80,
        gridSpan: "g6",
        caption: "After Gabe Custom. Perforated leather, red cross-stitch.",
        alt: "Restored steering wheel with perforated leather",
      },
      {
        file: "jdm-steering-wheel-4.jpg",
        order: 90,
        gridSpan: "g6",
        caption: "The stitch detail. Done by hand.",
        alt: "Hand cross-stitch detail on steering wheel",
      },
    ],
  },
  {
    titleEnglish: "SEATS",
    kanji: "座席",
    romaji: "Zaseki",
    intro:
      "Bride Stradia II Low Max in red gradation, on Bride Super Seat Rails. Stored — the car currently runs the reupholstered GS-R seats. These are ready when the mood changes.",
    photos: [
      {
        file: "bride-stradia-ii-kevlar-1.jpg",
        order: 100,
        gridSpan: "g4",
        caption: "Bride Stradia II Low Max. Red gradation fabric, kevlar shell.",
        alt: "Bride Stradia II Low Max seat red gradation kevlar",
      },
      {
        file: "bride-stradia-ii-kevlar-2.jpg",
        order: 110,
        gridSpan: "g4",
        caption: "The kevlar weave from the back. Made in Japan.",
        alt: "Back of Bride seat showing kevlar weave",
      },
      {
        file: "bride-seat-rail.jpg",
        order: 120,
        gridSpan: "g4",
        caption: "Bride Super Seat Rail. Made in Japan.",
        alt: "Bride Super Seat Rail hardware",
      },
    ],
  },
  {
    titleEnglish: "LIGHTING",
    kanji: "灯火",
    romaji: "Tōka",
    intro: "Two pieces from opposite ends of the car.",
    photos: [
      {
        file: "98-00-headlight.jpg",
        order: 130,
        gridSpan: "g6",
        caption:
          "JDM 98-00 one-piece headlight. The car runs USDM quad headlights — both 94-97 and 98-00 USDM Integras came with quads stock. This is the Japan-spec piece. Stored.",
        alt: "JDM 98-00 one-piece Integra headlight",
      },
      {
        file: "ukdm-tail-lights.jpg",
        order: 140,
        gridSpan: "g6",
        caption:
          "UKDM taillights. The clear corner sections give it away — USDM came all-red. On the car.",
        alt: "UKDM Integra taillights with clear corners",
      },
    ],
  },
  {
    titleEnglish: "GLASS & BODY",
    kanji: "硝子と外装",
    romaji: "Garasu to Gaisō",
    intro:
      "Honda genuine where it matters. The hatch came from a junkyard donor. Everything else came from Japan.",
    photos: [
      {
        file: "carbon-fiber-trunk-cover.jpg",
        order: 150,
        gridSpan: "g6",
        caption: "Carbon fiber rear parcel shelf cover. The weave runs the length of the piece.",
        alt: "Carbon fiber rear parcel shelf cover",
      },
      {
        file: "rear-windshield.jpg",
        order: 160,
        gridSpan: "g6",
        caption:
          "Rear hatch glass. Sourced from a junkyard donor when the original couldn't be saved.",
        alt: "Rear hatch windshield glass",
      },
      {
        file: "roof-liner.jpg",
        order: 170,
        gridSpan: "g4",
        caption: "Brand-new Honda genuine headliner. Made in Japan, still in the bag.",
        alt: "New Honda genuine headliner in packaging",
      },
      {
        file: "sun-roof-shade.jpg",
        order: 180,
        gridSpan: "g4",
        caption: "Brand-new Honda genuine sunroof shade. Shipped FedEx International from Japan.",
        alt: "New Honda genuine sunroof shade",
      },
    ],
  },
  {
    titleEnglish: "HARDWARE",
    kanji: "金具",
    romaji: "Kanagu",
    intro: "The small things. Where most builds cut corners.",
    photos: [
      {
        file: "front-reat-seatbelt-buckle.jpg",
        order: 190,
        gridSpan: "g4",
        caption:
          "Honda genuine seatbelt buckles. Part 04816-ST7-A05ZA, made in Japan. New in Honda boxes.",
        alt: "New Honda genuine seatbelt buckles in boxes",
      },
      {
        file: "rear-hatch-struts.jpg",
        order: 200,
        gridSpan: "g4",
        caption:
          "Honda genuine hatch struts on the left. Aftermarket on the right — for comparison. Honda still makes the right one.",
        alt: "OEM and aftermarket hatch struts compared",
      },
      {
        file: "heater-core.jpg",
        order: 210,
        gridSpan: "g4",
        caption: "AC evaporator core. New, sealed, ready when the old one finally gives up.",
        alt: "New AC evaporator core in box",
      },
    ],
  },
  {
    titleEnglish: "BRAKES",
    kanji: "制動装置",
    romaji: "Seidō Sōchi",
    intro: "Spoon Twin Block calipers in Spoon blue. On the car.",
    photos: [
      {
        file: "spoon-twinblock-stop-tech-rotor.jpg",
        order: 220,
        gridSpan: "g12",
        caption:
          "Spoon Twin Block monoblock caliper. Nissin internals. The blue is unmistakable.",
        alt: "Spoon Twin Block caliper and StopTech rotor",
      },
    ],
  },
] as const;

export const PARTS_IMPORT_ENTRIES: readonly PartsPhotoSpec[] = PARTS_SECTIONS.flatMap(
  (s) => [...s.photos],
);

export function galleryImagesForPartsSection(
  all: GalleryImage[],
  orders: readonly number[],
): GalleryImage[] {
  const map = new Map<number, GalleryImage>();
  for (const im of all) {
    if (typeof im.order === "number") {
      map.set(im.order, im);
    }
  }
  return orders.map((o) => map.get(o)).filter((im): im is GalleryImage => im !== undefined);
}
