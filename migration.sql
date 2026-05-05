-- ============================================================================
-- Signature Wall — Supabase schema
-- Run this in Supabase SQL Editor (or via migration)
-- ============================================================================

-- 1. Table
create table if not exists public.signatures (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 40),
  location    text check (char_length(location) <= 40),
  note        text check (char_length(note) <= 60),
  paths       jsonb not null,           -- [{ color, size, points: [[x,y],...] }]
  ip_hash     text not null,            -- sha256(ip + daily_salt) for rate limiting
  user_agent  text,                     -- truncated, for spam analysis
  is_hidden   boolean not null default false,  -- soft-delete flag (admin moderation)
  created_at  timestamptz not null default now()
);

-- 2. Indexes
create index if not exists signatures_created_at_idx on public.signatures (created_at desc);
create index if not exists signatures_ip_hash_idx    on public.signatures (ip_hash, created_at);
create index if not exists signatures_is_hidden_idx  on public.signatures (is_hidden) where is_hidden = false;

-- 3. Enable RLS
alter table public.signatures enable row level security;

-- 4. Policies
-- Anyone (anon) can READ non-hidden signatures
create policy "Public can read visible signatures"
  on public.signatures for select
  to anon, authenticated
  using (is_hidden = false);

-- Anonymous INSERT is BLOCKED at the table level.
-- All inserts must go through the API route (which uses the service role key).
-- This forces every write through our rate-limit + validation logic.
create policy "Block direct anon inserts"
  on public.signatures for insert
  to anon
  with check (false);

-- 5. Validate paths shape (defensive — keeps junk out even if API misbehaves)
create or replace function public.validate_paths(paths jsonb)
returns boolean language plpgsql immutable as $$
declare
  stroke jsonb;
begin
  if jsonb_typeof(paths) <> 'array' then return false; end if;
  if jsonb_array_length(paths) = 0 or jsonb_array_length(paths) > 500 then return false; end if;
  for stroke in select * from jsonb_array_elements(paths) loop
    if not (stroke ? 'color' and stroke ? 'size' and stroke ? 'points') then return false; end if;
    if jsonb_typeof(stroke->'points') <> 'array' then return false; end if;
    if jsonb_array_length(stroke->'points') > 2000 then return false; end if;
  end loop;
  return true;
end;
$$;

alter table public.signatures
  add constraint signatures_paths_valid check (public.validate_paths(paths));

-- 6. Storage cap — reject signatures whose JSON exceeds 50KB
alter table public.signatures
  add constraint signatures_paths_size check (octet_length(paths::text) <= 51200);
