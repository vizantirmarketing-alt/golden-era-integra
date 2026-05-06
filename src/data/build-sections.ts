export type BuildSection = {
  id: string;
  number: string;
  eyebrow: string;
  headline: string;
  paragraphs: readonly string[];
  tags?: readonly string[];
};

export type BuildOutro = {
  headline: string;
  paragraphs: readonly string[];
};

/** Intro copy appears before the numbered build sections (verbatim from the build page). */
export const buildIntroParagraphs: readonly string[] = [
  "It started during COVID. Everyone was bored, including me. I bought this car cheap, mostly so my buddy and I would have something to do on weekends. Hang out at my garage, drink some beers, work on a Honda. Nothing serious.",
  "Then one thing led to another. A small fix turned into a bigger one. A bigger one turned into a teardown. The teardown turned into a vision. Somewhere in the middle of that I stopped pretending it was a casual project. It became an expensive hobby. Then it became the hobby. The car only went out when something needed it — tuning, machining, paint booth for the bodywork, anything I couldn't do at home. Everything else happened in the garage.",
  "When I bought the car in 2021, I didn't have a plan. By the time I knew what I was building, I was already two years in. The plan caught up with the work — restore it with as much Honda genuine as I could find. Not because anyone was checking. I just wanted it done right.",
  "The car has zero rust. Thirty years old, original shell, no cancer anywhere. That's the foundation everything else got built on.",
  "Honda genuine parts are hard to come by. Most of what made it onto this car is discontinued — gone from Honda's catalog, never coming back. New old stock from Japan when I could get it. Junkyard pulls when I couldn't. A lot of late nights tracking down listings. A lot of phone calls. Four years of looking. Whatever I couldn't find genuine, I made sure was new and correct.",
];

/** Closing section after the numbered build sections (verbatim). */
export const buildOutro: BuildOutro = {
  headline: "The point",
  paragraphs: [
    "When you spend four years hunting parts, the car isn't really the point anymore. The hunt is the point. So is the time in the shop. So is finding a brand-new 98 bumper on some Acura dealer's shelf in the middle of nowhere.",
    "Most of this car came from people letting things go — Japan parting out cars I'll never see, junkyards where someone pulled a clean rear bumper before it got crushed, a shelf at a dealer that hadn't moved in twenty years, a UK seller holding onto a set of Type R floor mats for two decades. Parts from Japan, the UK, and everywhere in between.",
    "The car is mostly done. Small things still on the list. There's always small things.",
  ],
};

export const buildSections: BuildSection[] = [
  {
    id: "body",
    number: "01",
    eyebrow: "The body",
    headline: "98-spec front. Hunted rear.",
    paragraphs: [
      "The car is a '95 GS-R, but I wanted the 98-spec front and rear — that's the look I prefer. An Acura dealer in the States happened to have a brand-new 98-spec front bumper sitting on a shelf. I bought it. The rear bumper I hunted at junkyards until I found a clean one. The trunk weather strip took months — I wasn't going to settle for one that was almost right.",
      "Type R Optional front lip, Type R rear spoiler, Type T side skirts, Type T rear valance, UKDM taillights. Everything had to be mint. If it wasn't right, I waited. The car runs a First Molding carbon kevlar hood from Japan — the original OEM hood is in storage as a backup.",
      "I shaved the rear windshield washer nozzle, the antenna, and both door bumpers. Small details, but they keep the body lines clean. The fenders, trunk, and side mirrors all came with the car in good condition. Sometimes the right move is leaving original stuff alone.",
    ],
    tags: [
      "Type R Optional lip",
      "Type R rear spoiler",
      "Type T side skirts",
      "UKDM taillights",
      "First Molding hood",
    ],
  },
  {
    id: "paint",
    number: "02",
    eyebrow: "Paint",
    headline: "R-81. Same code as the VIN.",
    paragraphs: [
      "R-81. Same code as the VIN. No wraps, no color change. To do it legit I had to pull every piece of glass before paint — I don't like taping around rubber trim. The whole car came down to bare metal first. Sand-down, prep, paint, clear. About fifteen thousand dollars in paint work. Worth every dollar.",
      "Anything that needed to be black got powder coated matte. Brackets, hardware, suspension components. The shell deserved better than rattle can.",
    ],
  },
  {
    id: "glass",
    number: "03",
    eyebrow: "Glass and trim",
    headline: "Honda stamp or nothing.",
    paragraphs: [
      "Most of the glass on the car came from somewhere I had to hunt for. I wanted as many pieces as I could find with the Honda stamp on them. New old stock from Japan when I could get it. Junkyard pulls when I couldn't.",
      "The rear hatch glass story is the one I tell most. I bought a whole rear hatch from a junkyard just so my glass guy could carefully cut the back window out with the weather strip intact. Anything I could find with a Honda stamp on it went on this car. Roof liner, sun shade, seatbelt buckles, windshield molding, weather strip, wipers, horns, bolts. Brand-new Honda genuine windshield cowl — most cars on the road have a cracked or warped one, mine is new. Most of it sourced from Japan.",
      "The windshield, driver and passenger windows, sunroof glass, and one quarter panel ended up generic — those weren't available genuine. But everything around them is Honda.",
    ],
  },
  {
    id: "wheels",
    number: "04",
    eyebrow: "Wheels",
    headline: "Volk TE37. Bronze. 16x8 +35.",
    paragraphs: [
      "Volk TE37 in bronze. 16x8 +35. Wrapped in 225/45ZR16 Toyo Proxes. The TE37 is the wheel that defined this generation of Honda — putting them on a Milano Red GS-R isn't a flex, it's just where the car was always supposed to end up.",
    ],
  },
  {
    id: "suspension",
    number: "05",
    eyebrow: "Suspension",
    headline: "Spoon throughout.",
    paragraphs: [
      "KW V3 coilovers. Spoon Sports bushings throughout — every bushing in the chassis. Spoon Sports strut bar up front. ASR sway bars front and rear. PCI front upper control arms and PCI rear lower control arms.",
      "The ride doesn't fight you. The car turns in like it knows where you're going.",
    ],
  },
  {
    id: "brakes",
    number: "06",
    eyebrow: "Brakes",
    headline: "Twin blocks. Pedal feel direct.",
    paragraphs: [
      "Spoon Sports twin-block calipers. StopTech rotors. Spoon Sports pads. Spoon Sports stainless steel lines.",
      "Pedal feel is direct. No spongy modern car nonsense. You press, the car stops.",
    ],
  },
  {
    id: "engine",
    number: "07",
    eyebrow: "Engine",
    headline: "B18C1. Stock displacement. Not stock.",
    paragraphs: [
      "The B18C1 is stock displacement, but it's not stock. The block went to CSS for a full machine job: bore and hone, deck, jet wash, crank straightness check, crank micropolish, ring gap set, bearing clearance set. Reassembled with Traum forged 81.5mm 10:1 flat-top pistons, Scat forged H-beam connecting rods, ARP 2000 rod bolts, full set of race bearings.",
      "The head went through the same jet wash process but kept stock GS-R internals — no cams, no porting. The factory head on a B18C1 is already a piece of art. I didn't want to mess with what Honda did.",
      "Skunk2 Pro Series intake manifold. GruppeM carbon fiber air intake. Skunk2 throttle body. 5Zigen Jasma-certified header. Greddy Extreme catback. Skunk2 Alpha radiator with a Spal fan. DigitDizzy distributor delete with coil-on-plug conversion. Walbro fuel pump with Injector Dynamics injectors. Hondata for tuning.",
      "A few different valve covers in rotation. I like being able to switch the look without touching anything else.",
    ],
  },
  {
    id: "engineBay",
    number: "08",
    eyebrow: "The engine bay",
    headline: "R-81 bay. Tucked. Decluttered.",
    paragraphs: [
      "The bay itself I painted R-81 to match the body. Wires tucked with a Wireworx milspec engine harness. Chase Bay brake booster delete, Chase Bay power steering reservoir, Chase Bay oil catch can — the whole firewall is decluttered. Downstar engine dress up kit in burnt titanium. Every nut, bolt, and washer in the bay, same finish, top to bottom.",
      "It's the section of the car I spend the most time looking at.",
    ],
  },
  {
    id: "drivetrain",
    number: "09",
    eyebrow: "Drivetrain",
    headline: "Mechanical shift. Honest Honda feel.",
    paragraphs: [
      "Competition Clutch with a lightweight flywheel. Transmission rebuilt with Synchrotech synchros. M-Factory limited slip differential. Insane Shaft axles to handle the power.",
      "Shifting is short, mechanical, and honest. The way a Honda transmission is supposed to feel.",
    ],
  },
  {
    id: "interior",
    number: "10",
    eyebrow: "Interior",
    headline: "OEM read. Custom feel.",
    paragraphs: [
      "Original GS-R seats — front and rear — reupholstered in leather with red stitching. Original door cards retrimmed in matching leather and stitching. Original carpeting kept. Original headliner replaced with new genuine Honda. The cabin reads OEM but feels custom.",
      "JDM Type R steering wheel sent to Gabe Custom for new perforated leather with red stitching to match. Chasing J burnt titanium shift rod and shift knob. Mugen pedals. ID4Motion digital cluster gauges in place of the factory analog setup. New Honda genuine rearview mirror with a Spoon Sports wide-view convex cover. JDM armrest delete in place of the USDM center console — period-correct cabin layout. Brand-new UKDM Type R floor mats.",
      "No head unit. OEM block-off plate in the stereo bay. JL Audio stealth subwoofer box in the spare tire well — custom-fit for the Integra back in the 90s.",
      "No roll cage. This is a street car.",
    ],
  },
];
