-- Beli Exercise: Neon Postgres Schema
-- Run this in the Neon SQL Editor after creating your project.

-- Students table
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  section text not null,
  created_at timestamptz default now(),
  unique (name, section)
);

-- Submissions table
create table submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  section text not null,
  rankings jsonb not null,
  submitted_at timestamptz default now(),
  unique (student_id, section)
);
