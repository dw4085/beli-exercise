-- Beli Exercise: Supabase Schema
-- Run this in the Supabase SQL Editor after creating your project.

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

-- Enable RLS but keep it permissive (classroom tool)
alter table students enable row level security;
alter table submissions enable row level security;

create policy "Allow all inserts on students" on students for insert with check (true);
create policy "Allow all selects on students" on students for select using (true);

create policy "Allow all inserts on submissions" on submissions for insert with check (true);
create policy "Allow all selects on submissions" on submissions for select using (true);
create policy "Allow all updates on submissions" on submissions for update using (true) with check (true);
create policy "Allow all deletes on submissions" on submissions for delete using (true);
create policy "Allow all deletes on students" on students for delete using (true);
