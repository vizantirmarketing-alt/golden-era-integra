-- Migration: Add state column to signatures table
-- Stores 2-letter US state codes (e.g., "NV", "CA") or "INTL" for international
-- Nullable initially to allow backfill of existing rows; can be tightened to NOT NULL later.

ALTER TABLE signatures
  ADD COLUMN IF NOT EXISTS state TEXT;

-- Add a check constraint to ensure values are valid state codes or INTL
ALTER TABLE signatures DROP CONSTRAINT IF EXISTS signatures_state_check;
ALTER TABLE signatures ADD CONSTRAINT signatures_state_check
  CHECK (state IS NULL OR state IN (
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
    'DC','INTL'
  ));

-- Backfill existing signatures based on freeform location text
UPDATE signatures SET state = 'NV' WHERE state IS NULL AND location ILIKE '%nevada%';
UPDATE signatures SET state = 'NV' WHERE state IS NULL AND location ILIKE '%vegas%';
UPDATE signatures SET state = 'AZ' WHERE state IS NULL AND location ILIKE '%arizona%';
UPDATE signatures SET state = 'MA' WHERE state IS NULL AND location ILIKE '%boston%';
UPDATE signatures SET state = 'MA' WHERE state IS NULL AND location ILIKE '%massachusetts%';
UPDATE signatures SET state = 'CA' WHERE state IS NULL AND location ILIKE '%california%';

-- Verification query — run manually in SQL Editor after migration:
-- SELECT id, name, location, state FROM signatures ORDER BY created_at DESC;
