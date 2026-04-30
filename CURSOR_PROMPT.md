# Cursor Prompt — Golden Era Integra

> **Read this entire file before starting any work.** Then execute Phase 0 only and stop. Wait for the user to commit and approve before moving to Phase 1. Repeat for each phase.

---

## Project Overview

**Name:** Golden Era Integra
**Type:** Premium tribute / build documentation site for a 1995 Acura Integra GS-R in Milano Red, based in Las Vegas, NV.
**Owner:** James (JT Holdings Corp / Vizantir Design Studio)
**Brand mark:** `logo.png` (provided in `/public`) — circular badge, sunset gradient (blue → magenta → orange), Vegas skyline, front-facing DC2 illustration.

The site is a Vizantir Design Studio portfolio piece doubling as a personal showcase. It must feel premium, editorial, and JDM-authentic — not a generic enthusiast blog.

---

## Tech Stack — DO NOT DEVIATE

- **Framework:** Next.js (current stable, **16.x or later** — never default to 15 or older)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (v4 if Next 16 supports it cleanly, otherwise v3)
- **Animation:** Framer Motion
- **CMS:** Sanity (project ID `4dgncr6u` — `production` dataset, org `o2C5Mz8F9`)
- **Database:** Supabase (Postgres) — guestbook only for now
- **Deployment:** Vercel
- **Fonts:** Anton (display), Bebas Neue (condensed), Inter (body), JetBrains Mono (mono), Noto Serif JP (kanji) — load via `next/font/google`
- **Icons:** lucide-react

**Forbidden:** Next.js 15 or older. Pages Router (use App Router only). Server Actions for guestbook (use Route Handlers). Tailwind arbitrary-value soup (define design tokens in CSS variables).

---

## Design System — Source of Truth

The static HTML demo is provided as `reference/golden-era-integra-hybrid.html`. **Read it carefully.** It is the authoritative source for visual design. Match it pixel-faithfully when porting.

### Color tokens (CSS variables, defined in `app/globals.css`)

```css
--bg: #fdf6ec;              /* warm cream paper */
--bg-warm: #fde8d4;         /* sunset cream */
--bg-deep: #2a1a3e;         /* Vegas night purple */
--ink: #1a0e2e;             /* deep purple-black ink */
--ink-soft: rgba(26, 14, 46, 0.72);
--ink-faint: rgba(26, 14, 46, 0.5);
--ink-ghost: rgba(26, 14, 46, 0.32);
--line: rgba(26, 14, 46, 0.14);
--line-soft: rgba(26, 14, 46, 0.08);

/* Sunset gradient stops — used in headlines, marquee, accents */
--blue: #3a4fd9;
--magenta: #e838a4;
--pink: #f25d8e;
--orange: #f59e3a;
--amber: #ffc36e;

/* The car — its own identity, distinct from brand gradient */
--milano: #e8224d;
--milano-dark: #b6132c;
```

### Typography rules

- Display headlines: `Anton`, uppercase, line-height 0.95, letter-spacing -0.005em
- Condensed accents: `Bebas Neue`
- Body: `Inter`, 14–16px, line-height 1.7
- Mono labels (eyebrow, meta, spec labels): `JetBrains Mono`, 10–11px, letter-spacing 0.2–0.3em, uppercase
- Kanji: `Noto Serif JP` weight 500, magenta color, letter-spacing 0.2em — used as bilingual annotation alongside English section labels

### Gradient text utility

```css
.grad-text {
  background: linear-gradient(120deg, var(--blue), var(--magenta), var(--orange));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Outline text utility

```css
.outline-text {
  -webkit-text-stroke: 2px var(--ink);
  color: transparent;
}
```

### Section structure

Every chapter uses a 12-column grid: 3-col sticky sidebar (chapter number + label + kanji), 8-col main content starting at column 5.

---

## Content Architecture

### Routes (App Router)

```
app/
├── layout.tsx                  # Root: nav + footer + fonts
├── page.tsx                    # Home: hero, marquee, origin, quote, build summary
├── build/page.tsx              # Full spec sheet (all 4 categories with kanji)
├── gallery/page.tsx            # Full photo grid (CMS-driven)
├── journal/
│   ├── page.tsx                # Journal index
│   └── [slug]/page.tsx         # Individual entry (long-form)
├── guestbook/page.tsx          # Guestbook + feed
├── film/page.tsx               # Video player + episode list
└── api/
    └── guestbook/route.ts      # POST + GET handler with profanity filter
```

### Kanji map (use exactly these)

| English | Kanji | Romaji |
|---|---|---|
| Engine | 機関 | kikan |
| Chassis | 車体 | shatai |
| Wheels | 車輪 | sharin |
| Exterior | 外装 | gaisō |
| Origin Story | 起源 | kigen |
| Specification | 仕様 | shiyō |
| Gallery | 写真集 | shashinshū |
| Build Journal | 記録 | kiroku |
| Guestbook | 芳名録 | hōmeiroku |
| In Motion | 走行 | sōkō |

---

## EXECUTION PHASES

> Execute one phase at a time. After each phase: pause, summarize what you did, list any decisions you made, and wait for the user to review, commit, and approve before moving on.

---

### PHASE 0 — Project Initialization

**Goal:** Empty Next.js project that builds and runs.

1. Verify Node.js version (require 20.x or 22.x LTS).
2. Create new Next.js project: TypeScript + App Router + Tailwind + ESLint + `src/` directory + import alias `@/*`. Use the latest stable Next.js (16.x or later — confirm version before scaffolding).
3. Install runtime dependencies: `framer-motion`, `lucide-react`, `@supabase/supabase-js`, `@sanity/client`, `next-sanity`, `@portabletext/react`.
4. Install dev dependencies: `@types/node`.
5. Create `.env.local.example` with placeholder keys (do not commit real keys):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SANITY_PROJECT_ID=4dgncr6u
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=
   ```
6. Add `logo.png` to `/public/logo.png` (the user will drop this in).
7. Confirm `npm run dev` boots cleanly on `localhost:3000`.

**Stop here. Do not proceed.**

---

### PHASE 1 — Design System Foundation

**Goal:** Global styles, fonts, design tokens, and shared layout shell.

1. **Fonts** — in `src/app/layout.tsx` use `next/font/google` to load Anton, Bebas Neue, Inter, JetBrains Mono, Noto Serif JP. Expose as CSS variables (`--font-display`, `--font-body`, `--font-mono`, `--font-jp`).
2. **`src/app/globals.css`** — define the full color token system (see Design System above), gradient utility classes (`.grad-text`, `.outline-text`), grain overlay, and base typography.
3. **`tailwind.config.ts`** — extend theme with the brand colors, font families pointing to CSS variables.
4. **Shared components** in `src/components/`:
   - `Nav.tsx` — fixed top nav with logo lockup, links, mobile hamburger toggle, blur backdrop
   - `Footer.tsx` — three-column footer with logo lockup, sections, follow, credits
   - `ChapterHeader.tsx` — sticky sidebar with chapter number, label, and kanji
   - `Marquee.tsx` — gradient strip with infinite scrolling text + kanji moments
   - `GradHeading.tsx` — H2 helper with `grad`/`outline`/normal span variants
5. **Root `layout.tsx`** — apply font CSS variables to `<html>`, render `<Nav />` and `<Footer />` around `{children}`.

**Stop. The site should now have a working nav and footer on every page, even if pages are empty.**

---

### PHASE 2 — Home Page

**Goal:** Port the home page from the HTML reference exactly.

Sections, in order:
1. Hero — full viewport, sunset gradient background, logo on right, headline on left ("Golden / Era / Integra." with gradient + outline treatments), eyebrow with pulse dot, sub-paragraph, four meta chips (Milano Red R-81, DC2 Chassis, B18C1 VTEC, 8,100 RPM). Hero meta corners with kanji (鈴鹿製作所 1995, 本田技研工業).
2. Marquee — gradient strip, animated, with kanji interleaved (本田, 鈴鹿 1995, 走行).
3. Chapter 01 — Origin Story (起源) — sticky sidebar + 2-column body copy + 3-stat row (170 HP / 2,579 lb / 8,100 RPM with gradient numbers).
4. Quote section — full-bleed sunset gradient with grain overlay, large display quote with italic outline-text emphasis, white star decorations top and bottom.
5. Chapter 02 (preview) — Specification (仕様) intro + "View Full Build →" CTA linking to `/build`.
6. Chapter 03 (preview) — Archive (記録) intro + 3-image teaser grid + "View Full Archive →" linking to `/archive`.
7. Chapter 04 (preview) — Journal (記録) intro + 2 most recent entries + "Read All Entries →" linking to `/journal`.

Use Framer Motion for: hero fade-in (1.2s ease cubic-bezier 0.22, 1, 0.36, 1), scroll-triggered reveals on chapter sections.

**Stop. Verify home page matches the HTML reference visually.**

---

### PHASE 3 — Sanity CMS Setup

**Goal:** Sanity Studio scaffolded with schemas for all dynamic content.

1. Create `sanity/` folder at project root with Sanity v3 Studio config.
2. Use project ID `4dgncr6u`, `production` dataset (org `o2C5Mz8F9`).
3. Schemas to define in `sanity/schemas/`:

   **`specCategory.ts`** — for the `/build` page
   - title (string)
   - kanji (string)
   - order (number)
   - items (array of `{ label: string, value: string, isMilano?: boolean }`)

   **`galleryImage.ts`** — for `/archive`
   - image (image with alt text + hotspot)
   - caption (string)
   - location (string, optional)
   - shotOn (string: "Film 35mm" | "Digital" | "Medium Format")
   - capturedAt (date)
   - order (number)
   - gridSpan (string: enum of g1–g9 to match the asymmetric grid)

   **`journalEntry.ts`** — for `/journal`
   - title (string)
   - slug (slug, source: title)
   - tag (string: enum — Acquisition, Restoration, Engine, Drive, Detail, Other)
   - excerpt (string, max 180 chars)
   - publishedAt (datetime)
   - coverImage (image with alt)
   - body (Portable Text — block content with images, callouts, code blocks)

   **`filmEpisode.ts`** — for `/film`
   - title (string)
   - episodeNumber (number)
   - description (string)
   - videoUrl (url — YouTube/Vimeo embed)
   - duration (string, e.g. "04:18")
   - location (string)
   - publishedAt (datetime)
   - thumbnail (image)

4. Create `src/sanity/client.ts` — typed Sanity client + `urlFor()` image helper using `@sanity/image-url`.
5. Create `src/sanity/queries.ts` — GROQ queries for each content type.
6. Create `src/sanity/types.ts` — TypeScript interfaces matching schemas.

**Stop. Sanity Studio should run via `npm run sanity` (set up the script). Confirm content can be created.**

---

### PHASE 4 — `/build` Page

**Goal:** Full spec sheet pulling from Sanity.

1. Fetch all `specCategory` documents sorted by `order`.
2. Render with the same 12-column chapter layout: sticky sidebar (Chapter 02 / 02 / Specification / 仕様), main content with intro paragraph, then 2-column responsive grid of spec categories.
3. Each category renders:
   - English name (Anton 2rem) + kanji (Noto Serif JP magenta with gradient rule preceding it)
   - Index counter (01 / 04, 02 / 04, etc.)
   - List of label/value rows with hover state (border + value color shifts to magenta)
   - `isMilano: true` rows render value in `--milano` color, weight 600

**Stop.**

---

### PHASE 5 — `/archive` Page

**Goal:** Full photo grid pulling from Sanity.

1. Fetch all `galleryImage` documents sorted by `order`.
2. Use Next.js `<Image>` with Sanity's `urlFor()` for proper optimization, hot-spot, and responsive sizing.
3. Asymmetric 12-column grid using the `gridSpan` field (g1–g9 maps to grid-column/row spans matching the HTML reference).
4. Hover state: gradient border on the image, caption fades in from bottom with gradient-to-transparent overlay.
5. Click opens a lightbox modal (Framer Motion) with full image + caption + location + shotOn metadata.
6. Add Framer Motion stagger reveal as items enter viewport.

**Stop.**

---

### PHASE 6 — `/journal` Pages

**Goal:** Journal index + individual entry routes.

1. **`/journal`** — fetch all `journalEntry` sorted by `publishedAt` desc. Render as the journal entry list from the HTML reference: 12-col grid row per entry (date / tag / title+excerpt / "Read →"), gradient border animation on hover, link to `/journal/[slug]`.

2. **`/journal/[slug]`** — long-form entry page:
   - Hero: cover image full-bleed top with title overlay (Anton, gradient on key word) + meta strip (date, tag, reading time)
   - Body: Portable Text rendered with custom serializers — block image with caption, callout block, blockquote with magenta left rule
   - Footer: prev/next entry navigation, back-to-journal link

**Stop.**

---

### PHASE 7 — `/film` Page

**Goal:** Video episode listing.

1. Fetch all `filmEpisode` sorted by `episodeNumber` desc.
2. Featured episode (most recent) renders large 21:9 video frame matching the HTML reference (gradient play button, bottom-left title, bottom-right duration, top-left "NOW PLAYING" with pulse dot in milano red).
3. Below: list of older episodes as smaller 16:9 cards, 3-column responsive grid.
4. Embed YouTube/Vimeo via the `videoUrl` field — use a click-to-play pattern (don't autoload iframes for performance).

**Stop.**

---

### PHASE 8 — Supabase Guestbook Setup

**Goal:** Database schema + connection, no UI yet.

1. **Supabase project setup** — user creates the project manually in Supabase dashboard. The agent provides the SQL to run.

2. **SQL schema** (provide as `supabase/schema.sql`):
   ```sql
   create table guestbook_entries (
     id uuid primary key default gen_random_uuid(),
     name text not null check (char_length(name) between 1 and 40),
     handle text check (char_length(handle) <= 32),
     message text not null check (char_length(message) between 4 and 280),
     created_at timestamptz not null default now(),
     ip_hash text -- for rate limiting, not personally identifiable
   );

   create index guestbook_created_at_idx on guestbook_entries (created_at desc);

   alter table guestbook_entries enable row level security;

   -- Public can read
   create policy "Anyone can read entries"
     on guestbook_entries for select
     using (true);

   -- Inserts only via service role (route handler)
   -- No public insert policy — all writes go through /api/guestbook
   ```

3. **`src/lib/supabase.ts`** — two clients: anon client for public reads (via `NEXT_PUBLIC_*` env vars), service-role client for writes (used only in route handlers, never exposed to browser).

4. **Type interface** for `GuestbookEntry` matching schema.

**Stop.**

---

### PHASE 9 — Profanity Filter + API Route

**Goal:** Server-side validation that the client cannot bypass.

1. Install `obscenity` from npm — current best-in-class profanity library, handles leetspeak/transformations correctly.

2. **`src/lib/profanity.ts`** — wrap obscenity matcher with a single `containsProfanity(text: string): boolean` export. Use the English preset dataset.

3. **`src/app/api/guestbook/route.ts`** — Route Handler with `GET` and `POST`:

   **GET** — return latest 100 entries from Supabase, ordered desc.

   **POST** — accept JSON `{ name, handle, message }`. Validation pipeline (return 400 on any failure):
   - `name`: required, 1–40 chars
   - `handle`: optional, ≤32 chars, sanitize to `@[a-zA-Z0-9._]+` format (strip leading @s, reject other chars)
   - `message`: required, 4–280 chars
   - Run `containsProfanity()` on name + handle + message — if any return true, respond 400 with `{ error: 'Your post contains language that isn\'t allowed.' }`
   - Hash IP (sha256 with a server-side salt) and store as `ip_hash`
   - Rate limit: max 3 posts per hour per ip_hash — return 429 if exceeded
   - Insert via service-role client
   - Return 201 with the new entry

4. Add Zod for body validation.

**Stop.**

---

### PHASE 10 — `/guestbook` Page

**Goal:** UI for the guestbook, wired to the API.

1. Match the HTML reference exactly: 5/7 column split (form left, feed right), gradient top rule on form card, gradient avatars in feed.
2. **Form** — controlled inputs (name, handle, message), live counter on message (turns milano-red >250 chars), client-side validation mirrors server (instant feedback), submit calls `POST /api/guestbook`.
3. **Feed** — fetches `GET /api/guestbook` on mount + after each successful post. Sort newest-first. Avatar gradient generated deterministically from name (use the palette rotation from the HTML reference).
4. Status messages: success (orange tint) or error (milano tint) with auto-dismiss after 4s.
5. Use Framer Motion to fade-in new entries at the top of the feed.
6. **Important**: keep client-side profanity check too for instant UX, but server is the real gate.

**Stop.**

---

### PHASE 11 — Polish & Deploy Prep

1. **Metadata** — `generateMetadata` per route with proper OG image (use the logo + a generated card), Twitter card, descriptions.
2. **Sitemap & robots** — `app/sitemap.ts` and `app/robots.ts`.
3. **Loading states** — `loading.tsx` skeletons for each dynamic route.
4. **404 page** — `not-found.tsx` with the brand styling.
5. **Performance audit** — Lighthouse target ≥95 on mobile + desktop. Compress logo.png if >500KB. Set `priority` on hero images.
6. **Accessibility pass** — focus states on all interactive elements, alt text on all images, aria labels on icon-only buttons, keyboard nav on lightbox + mobile menu, color contrast on all text/background pairings.
7. **README.md** — installation, env vars, Sanity Studio commands, Supabase setup, deployment to Vercel.

**Stop. Project is deploy-ready.**

---

## Workflow Rules — Strict

- **One phase at a time.** Do not bleed work from later phases into the current one.
- **No `git add -A`. No `&&` chaining.** The user commits manually using:
  ```
  git add .
  git commit -m "feat(scope): message"
  git push
  ```
- The agent **does not run git commands**. The user reviews and commits between every phase.
- **No `npm run build` automation** — the user runs it when they want to verify.
- After each phase: produce a summary of what changed, list any decisions made, list any TODOs deferred.

## Vizantir Brand Notes (for code quality)

This is a portfolio piece for Vizantir Design Studio, a premium agency. Code quality reflects on the brand:
- No `console.log` left in committed code
- No commented-out code
- Components stay small (< 200 lines preferred)
- Server vs client components used deliberately (default to server, opt into client only when needed)
- Type safety is non-negotiable — no `any`, no `as unknown as`

---

## Reference Files Provided

- `reference/golden-era-integra-hybrid.html` — the visual source of truth
- `public/logo.png` — brand mark
- `userMemories.md` (optional) — owner's existing preferences and workflow rules

---

**Begin with Phase 0. Stop after each phase. Wait for the user.**
