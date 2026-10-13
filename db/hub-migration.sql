-- Beli Exercise: class hub sign-in (idempotent; safe to run more than once).
-- Run in the Neon SQL Editor on an existing database. schema.sql already includes all of this.

-- Students are now the class hub's people: one row per hub person id, named from the hub.
-- Old typed-name rows keep student_id NULL and survive (with their submissions).
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id UUID UNIQUE;  -- hub person id
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
-- Names no longer identify anyone (two people may share one)
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_name_section_key;

-- Activity reports held until the class hub has them (kit OUTBOX_TABLE_SQL)
CREATE TABLE IF NOT EXISTS hub_outbox (
  id               UUID PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  event            JSON NOT NULL,          -- the report as sent (JSON keeps the snapshot's field order)
  attempts         INTEGER NOT NULL DEFAULT 0,
  last_attempt_at  TIMESTAMPTZ,
  last_error       TEXT,
  delivered_at     TIMESTAMPTZ,
  failed_at        TIMESTAMPTZ             -- rejected by the hub as malformed; not retried
);
CREATE INDEX IF NOT EXISTS hub_outbox_pending ON hub_outbox (created_at) WHERE delivered_at IS NULL AND failed_at IS NULL;
