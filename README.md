# Golden Era Integra

Premium tribute and build-documentation site for a 1995 Acura Integra GS-R (Milano Red) in Las Vegas. A long-form, design-led site documenting the restoration, parts catalog, journal entries, and visitor signature wall.

**Live site:** https://www.goldeneraintegra.com

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity v3 (Studio at `/studio`)
- **Animations:** Framer Motion
- **Database:** Supabase (Postgres) — signature wall storage and rate limiting
- **Hosting:** Vercel
- **Image gallery:** yet-another-react-lightbox
- **Fonts:** Inter, Anton, Bebas Neue, JetBrains Mono, Noto Serif JP

---

## Requirements

- Node.js 20.x or 22.x LTS
- npm (or pnpm/yarn if you adapt commands)

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repository-url>
cd golden-era-integra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in real values:

```bash
cp .env.local.example .env.local
```

See the [Environment Variables](#environment-variables) section below for the full list.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Access Sanity Studio

Studio runs from the `sanity/` directory at the repo root:

```bash
npm run sanity
```

Configure project ID and dataset in `sanity/sanity.config.ts` to match `NEXT_PUBLIC_SANITY_*` in `.env.local`.

---

## Project Structure

```
src/app/                 # Next.js App Router pages
src/components/          # Reusable UI components
sanity/                  # Sanity schema types and Studio config
public/                  # Static assets (logo, hero imagery, etc.)
reference/               # Static visual reference (HTML mockup)
migration.sql            # Supabase signature wall schema
```

---

## Environment Variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL for Open Graph, `sitemap.xml`, and `robots.txt`. No trailing slash. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key (browser reads governed by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role key — never exposed to the client; used in `/api/signatures` for inserts and moderation |
| `SIGNATURE_IP_SALT` | Server only | Daily-rotated salt for hashing client IPs (rate limiting on signature submissions) |
| `ADMIN_TOKEN` | Server only | Bearer token for admin moderation (`DELETE /api/signatures/[id]` and admin query/cookie flows) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Sanity project ID (`4dgncr6u` for this project) |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Dataset name (`production`) |
| `SANITY_API_TOKEN` | Server / tooling | Token with read access for Next.js fetches (and Studio if needed) |
| `NEXT_PUBLIC_GARAGE_SALE_LIVE` | Public | Set to `true` or `1` to expose the live garage sale pages; otherwise `/garage-sale` shows a coming-soon state |
| `RESEND_API_KEY` | Server only | Resend API key for garage sale inquiry emails (`/api/garage-sale-inquiry`); sending domain must be verified in Resend |
| `GARAGE_SALE_INBOX` | Server only | Destination inbox for garage sale inquiries |

On Vercel, set the same variables in **Project → Settings → Environment Variables**. `VERCEL_URL` is provided automatically and is used as a fallback when `NEXT_PUBLIC_SITE_URL` is unset.

---

## Key Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, build narrative hooks, heritage and sessions teasers, signature wall preview |
| `/story` | Origin story (Chapter 01) |
| `/build` | Long-form build documentation with section navigation |
| `/archive` | Photo archive by phase, with lightbox |
| `/sessions` | Photography sessions index (Sanity-driven) |
| `/sessions/[slug]` | Individual session |
| `/garage-sale` | Parts listings (gated by `NEXT_PUBLIC_GARAGE_SALE_LIVE`) |
| `/garage-sale/[slug]` | Individual part listing |
| `/signatures` | Visitor signature wall |
| `/studio` | Sanity Studio (authenticated) |

---

## Sanity Studio

Content types are defined in `sanity/schemas/` and include:

- Vehicle specification categories
- Gallery images
- Journal entries
- Film episodes
- Parts catalog items
- Photography sessions
- Heritage shots

To run Studio locally:

```bash
npm run sanity
```

This runs `sanity dev` from the `sanity/` folder. Project ID and dataset must match the `NEXT_PUBLIC_SANITY_*` values in `.env.local`.

Embedded Studio at `/studio` needs the production origin allowed in Sanity **API → CORS** (Allow credentials: ON). See the comment in `.env.local.example` for the manage URL and project reference.

---

## Supabase (Signature Wall)

The signature wall lets visitors leave a hand-drawn signature with a name, optional location, and short note. Storage and rate limiting are handled by Supabase.

### Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the script in `migration.sql` at the repo root. This creates the `signatures` table, indexes, RLS policies, and validation constraints (including path shape validation and a 50KB payload cap).
3. Copy the project URL, anon key, and service role key into `.env.local`.

### How writes work

Signature submissions go only through `POST /api/signatures` using the service role on the server. This forces every write through the API's rate limiting and validation logic — direct anonymous inserts are blocked at the table level via RLS.

Soft-delete and admin moderation use `ADMIN_TOKEN` as documented in `.env.local.example`.

---

## Build

```bash
npm run lint
npm run build
npm run start
```

---

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com) and select the Next.js framework preset.
3. Add all environment variables from the table above (production and preview environments as needed).
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain after the first deploy.

The app expects the App Router entry at `src/app/`. Dynamic OG images are generated by `src/app/opengraph-image.tsx`.

---

## Performance and Accessibility

Release checklist before shipping major content updates:

- Run **Lighthouse** (Chrome DevTools → Lighthouse) on `/` and major routes; target **≥ 95** Performance on mobile and desktop once production URLs and assets are final.
- Hero imagery: home hero and journal covers use `priority` where appropriate.
- The brand `logo.png` in `/public` should be optimized for web (< 500 KB recommended).

---

## Notes

- Content edits should be made in Sanity Studio at `/studio`. Bulk Sanity imports use optional `npm run import-*` scripts (see `package.json`); those are for migrations, not routine publishing.
- Static visual reference for layout and styling lives at `reference/golden-era-integra-hybrid.html`.
- Commit workflow: `git add .` → `git commit -m "..."` → `git push`. Never chain git commands with `&&`.
- The signature wall paths are validated server-side and constrained at the database level (max 500 strokes, max 2000 points per stroke, 50KB total payload).

---

## License

Private / all rights reserved unless otherwise noted by the owner.
