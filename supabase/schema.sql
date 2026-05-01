-- Golden Era Integra — guestbook (run in Supabase SQL Editor)
-- Phase 8: schema + RLS. Writes go through the API (service role), not anon.

create table guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  handle text check (char_length(handle) <= 32),
  message text not null check (char_length(message) between 4 and 280),
  signature_svg text check (signature_svg is null or char_length(signature_svg) <= 100000),
  created_at timestamptz not null default now(),
  ip_hash text -- for rate limiting, not personally identifiable
);

-- Run this in the Supabase SQL Editor to add signature support on an existing database:
-- ALTER TABLE guestbook_entries
--   ADD COLUMN signature_svg text
--   CHECK (signature_svg IS NULL OR char_length(signature_svg) <= 100000);

create index guestbook_created_at_idx on guestbook_entries (created_at desc);

alter table guestbook_entries enable row level security;

-- Public can read
create policy "Anyone can read entries"
  on guestbook_entries for select
  using (true);

-- Inserts only via service role (route handler)
-- No public insert policy — all writes go through /api/guestbook
