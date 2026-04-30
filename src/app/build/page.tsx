import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { seo } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: seo.buildStory.titleAbsolute },
  description: seo.buildStory.description,
  openGraph: {
    title: seo.buildStory.titleAbsolute,
    description: seo.buildStory.description,
  },
  twitter: {
    title: seo.buildStory.titleAbsolute,
    description: seo.buildStory.description,
  },
};

export default function BuildPage() {
  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-16">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 02"
                number="02"
                label="The Build"
                kanji="ハント"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-8 !text-balance sm:!pr-4">
              Hunted, not <span className="grad">bought</span>.
            </GradHeading>
            <p className="body-copy max-w-[42rem]">
              Four years of sourcing, restoring, and waiting. The full build story.
            </p>
          </div>
        </div>

        <article className="mx-auto max-w-[48rem] space-y-6">
          <p className="body-copy">
            When I bought the car in 2021, I had a vision. I wanted to restore it with
            as much Honda genuine as I could find. Not because anyone was checking. I
            just wanted it done right.
          </p>
          <p className="body-copy">
            Honda genuine parts are hard to come by. New, you spend hours online
            tracking them down. Used, you&apos;re calling junkyards and hoping someone
            pulled a clean one. I did a lot of both. Most of what&apos;s on the car
            came from Japan. Four years of looking. Whatever I couldn&apos;t find
            genuine, I made sure was new and correct.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            The body
          </h2>
          <p className="body-copy">
            The car is a &apos;95 GS-R, but I wanted the 98-spec front and rear —
            that&apos;s the look I prefer. An Acura dealer in the States happened to have
            a brand-new 98-spec front bumper sitting on a shelf. I bought it. The rear
            bumper I hunted at junkyards until I found a clean one. The trunk weather
            strip took months — I wasn&apos;t going to settle for one that was almost
            right.
          </p>
          <p className="body-copy">
            Same approach with the rest of the body. Type R rear spoiler, Type T side
            skirts, Type T rear valance, quad headlight conversion. Everything had to be
            mint. If it wasn&apos;t right, I waited. The car runs a First Molding carbon
            kevlar hood from Japan — the original OEM hood is in storage as a backup.
          </p>
          <p className="body-copy">
            I shaved the rear windshield washer nozzle, the antenna, and both door
            bumpers. Small details, but they keep the body lines clean. The fenders,
            trunk, and side mirrors all came with the car in good condition. Sometimes
            the right move is leaving original stuff alone.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Paint
          </h2>
          <p className="body-copy">
            R-81. Same code as the VIN. No wraps, no color change. To do it legit I had
            to pull every piece of glass before paint — I don&apos;t like taping around
            rubber trim. The whole car came down to bare metal first. Sand-down, prep,
            paint, clear. About fifteen thousand dollars in paint work. Worth every
            dollar.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Glass and trim
          </h2>
          <p className="body-copy">
            Most of the glass on the car came from somewhere I had to hunt for. I wanted
            as many pieces as I could find with the Honda stamp on them. New old stock
            from Japan when I could get it. Junkyard pulls when I couldn&apos;t.
          </p>
          <p className="body-copy">
            The rear hatch glass story is the one I tell most. I bought a whole rear
            hatch from a junkyard just so my glass guy could carefully cut the back
            window out with the weather strip intact. Anything I could find with a Honda
            stamp on it went on this car. Roof liner, sun shade, seatbelt buckles,
            windshield molding, weather strip, wipers, horns, bolts. Most of it sourced
            from Japan.
          </p>
          <p className="body-copy">
            The windshield, driver and passenger windows, sunroof glass, and one quarter
            panel ended up generic — those weren&apos;t available genuine. But
            everything around them is Honda.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Wheels
          </h2>
          <p className="body-copy">
            Volk TE37 in bronze. Wrapped in 225/45ZR16 Toyo Proxes. The TE37 is the
            wheel that defined this generation of Honda — putting them on a Milano Red
            GS-R isn&apos;t a flex, it&apos;s just where the car was always supposed to
            end up.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Suspension
          </h2>
          <p className="body-copy">
            KW V3 coilovers. Spoon Sports bushings throughout — every bushing in the
            chassis. Spoon Sports strut bar up front. ASR sway bars front and rear. PCI
            front upper control arms and PCI rear lower control arms.
          </p>
          <p className="body-copy">
            The ride doesn&apos;t fight you. The car turns in like it knows where
            you&apos;re going.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Brakes
          </h2>
          <p className="body-copy">
            Spoon Sports twin-block calipers. StopTech rotors. Spoon Sports pads. Spoon
            Sports stainless steel lines. Chase Bay brake booster delete kit.
          </p>
          <p className="body-copy">
            Pedal feel is direct. No spongy modern car nonsense. You press, the car
            stops.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Engine
          </h2>
          <p className="body-copy">
            The B18C is stock displacement, but it&apos;s not stock. The block went to
            CSS for a full machine job: bore and hone, deck, jet wash, crank straightness
            check, crank micropolish, ring gap set, bearing clearance set. Reassembled
            with Traum forged 81.5mm 10:1 flat-top pistons, Scat forged H-beam
            connecting rods, ARP 2000 rod bolts, full set of race bearings.
          </p>
          <p className="body-copy">
            The head went through the same jet wash process but kept stock GS-R internals
            — no cams, no porting. The factory head on a B18C is already a piece of art.
            I didn&apos;t want to mess with what Honda did.
          </p>
          <p className="body-copy">
            Skunk2 Pro Series intake manifold. GruppeM carbon fiber air intake. Skunk2
            throttle body. 5Zigen Jasma-certified header. Greddy Extreme catback.
            Skunk2 Alpha radiator with a Spal fan. DigitDizzy distributor delete with
            coil-on-plug conversion. Walbro fuel pump with Injector Dynamics injectors.
            Hondata for tuning.
          </p>
          <p className="body-copy">
            The engine bay itself I painted R-81 to match the body. Wires tucked. Every
            nut, bolt, and washer in the engine bay is burnt titanium — same finish, top
            to bottom.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Drivetrain
          </h2>
          <p className="body-copy">
            Competition Clutch with a lightweight flywheel. Transmission rebuilt with
            Synchrotech synchros. M-Factory limited slip differential. Insane Shaft axles
            to handle the power.
          </p>
          <p className="body-copy">
            Shifting is short, mechanical, and honest. The way a Honda transmission is
            supposed to feel.
          </p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            Interior
          </h2>
          <p className="body-copy">
            Original GS-R seats — front and rear — reupholstered in leather with red
            stitching. Original door cards retrimmed in matching leather and stitching.
            Original carpeting kept. Original headliner replaced with new genuine Honda.
            The cabin reads OEM but feels custom.
          </p>
          <p className="body-copy">
            JDM steering wheel reupholstered in leather with red stitching to match.
            Chasing J burnt titanium shift rod and shift knob. Mugen pedals. ID4Motion
            digital cluster gauges in place of the factory analog setup. The factory
            stereo bay has a Honda OEM block-off plate — no head unit, no speakers
            I&apos;m worried about.
          </p>
          <p className="body-copy">No roll cage. This is a street car.</p>

          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
            The point
          </h2>
          <p className="body-copy">
            When you spend four years hunting parts, the car isn&apos;t really the point
            anymore. The hunt is the point. So is the time in the shop. So is finding a
            brand-new 98 bumper on some Acura dealer&apos;s shelf in the middle of
            nowhere.
          </p>
          <p className="body-copy">
            Most of this car came from people letting things go — Japan parting out cars
            I&apos;ll never see, junkyards where someone pulled a clean rear bumper before
            it got crushed, a shelf at a dealer that hadn&apos;t moved in twenty years.
          </p>
          <p className="body-copy">
            The car is mostly done. Small things still on the list. There&apos;s always
            small things.
          </p>
        </article>
      </div>
    </div>
  );
}
