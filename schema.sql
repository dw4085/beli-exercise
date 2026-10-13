-- Beli Exercise: Neon Postgres Schema
-- Run this in the Neon SQL Editor after creating your project (idempotent).
-- For an existing database, db/hub-migration.sql adds the class hub changes.

-- Students: one row per class hub person (student_id = hub person id), named from the hub.
-- Rows from before the hub (typed names) have student_id NULL.
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  student_id uuid unique,
  email text,
  name text not null,
  section text not null,
  created_at timestamptz default now()
);

-- Submissions table (student_id references students.id)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  section text not null,
  rankings jsonb not null,
  submitted_at timestamptz default now(),
  unique (student_id, section)
);

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
