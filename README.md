# Golden Era Integra — Cursor Setup

## Files in this bundle

- `CURSOR_PROMPT.md` — the master prompt for Cursor, structured into 12 phases
- `golden-era-integra-hybrid.html` — visual reference (drop into `reference/` folder of new project)
- `logo.png` — brand mark (drop into `public/` folder of new project)

## How to use this with Cursor

### 1. Set up the project folder

```bash
mkdir golden-era-integra
cd golden-era-integra
```

Inside that folder, create a `reference/` directory and drop `golden-era-integra-hybrid.html` into it. Drop `CURSOR_PROMPT.md` at the root. The `logo.png` will go into `public/` after Phase 0 creates the Next.js scaffold.

### 2. Open in Cursor

Open the folder in Cursor and start a new chat in Composer mode (Cmd+I).

### 3. The opening prompt to give Cursor

Paste this exactly:

```
Read CURSOR_PROMPT.md in full before doing anything. Then execute Phase 0 only and stop. Do not start Phase 1 until I tell you to.
```

Cursor will read the full spec, scaffold the Next.js project, and stop. Review the changes, run `git add . / git commit -m "..." / git push` manually (3 separate lines as you prefer), then in a new chat say:

```
Phase 0 looks good. Execute Phase 1 only and stop.
```

Repeat for each phase.

### 4. Why structured this way

The prompt is one master file because the project context — design system, kanji map, color tokens, routing — needs to stay consistent across all 12 phases. But it explicitly tells Cursor to execute one phase at a time and stop, which preserves your normal "focused single-phase prompts" workflow. You commit between every phase. Cursor never runs git for you.

## Things to do BEFORE starting

1. **Verify Node version** — install Node 20.x or 22.x LTS via nvm if you don't have it.
2. **Sanity** — project ID `4dgncr6u`, dataset `production` (org `o2C5Mz8F9`). Copy `.env.local.example` to `.env.local` and set the `NEXT_PUBLIC_SANITY_*` values to match.
3. **Create Supabase project** — Phase 8 needs an empty Supabase project. Create one at supabase.com, grab the URL + anon key + service role key, drop them into `.env.local` when Cursor asks. Don't share these with Cursor — Cursor only needs the placeholder names.
4. **Have the logo handy** — drop `logo.png` into `public/` immediately after Phase 0 finishes.

## Decisions Cursor will likely ask you about

- Tailwind v3 vs v4 (depends on Next.js 16 compatibility at build time — let Cursor decide)
- Sanity Studio embedded in the same Next.js app vs separate project (recommend separate `sanity/` folder per the prompt — easier to deploy independently)
- Whether to use Vercel Postgres instead of Supabase (don't — Supabase is in your stack already, switching introduces friction)

## When this is done

You'll have a deploy-ready Next.js 16 site, fully CMS-driven, with a working guestbook, ready for Vercel. The total scope is roughly 2-4 evenings of focused work depending on how much you tweak between phases.

Once shipped, the natural next steps are: real photography swap-in, journal content backfill, video uploads, Vegas-area SEO (you've already established the geo-targeting pattern from your other Vizantir work).
