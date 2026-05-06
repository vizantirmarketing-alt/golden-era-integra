export { metadata, viewport } from "next-sanity/studio";

/** Matches `next-sanity/studio` server `NextStudio` bridge (login / auth). */
const SANITY_BRIDGE_SRC = "https://core.sanity-cdn.com/bridge.js";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script src={SANITY_BRIDGE_SRC} async type="module" data-sanity-core />
      {children}
    </>
  );
}
