# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
npm start          # Dev server on localhost:3000 (frontend only — /api functions need `vercel dev`;
                   # sign-in needs the class hub, so run under its cookie domain)
vercel dev         # Frontend + /api serverless functions
npm run build      # Production build to build/
```

No test runner or linter is configured.

## Deployment

Hosted on Vercel with GitHub auto-deploy on push to `main`. Manual deploy: `vercel --prod`.

Environment variables (see `.env.example`; set in `.env` locally and in the Vercel dashboard):
- `DATABASE_URL` — Neon Postgres connection string (server-side only, used by `/api`)
- `HUB_URL`, `HUB_JWT_PUBLIC_KEY`, `HUB_COOKIE_NAME`, `HUB_APP_SLUG` (`beli`), `HUB_APP_KEY` — class hub (server-side, `/api`); `HUB_PROTECTION_BYPASS` optional
- `CRON_SECRET` — guards the daily sweep (`/api/hub/sweep`, Vercel Cron in `vercel.json`, production only)
- `REACT_APP_HUB_URL`, `REACT_APP_HUB_APP_SLUG` — the same hub URL and slug for the browser (inlined at build time)

## Class hub (sign-in and activity)

Students sign in once, at the class hub; there are no app passwords. The app must be served under
the hub's cookie domain (preview: `beli.preview.cbs-tech-strategy.com`).
- **Browser:** `src/lib/hub-client.ts` is the hub's browser kit (copied; config read adapted for CRA).
  `src/lib/hub.js` calls `initHub()`; pages call `useHubUser()` → `requireUser()` (the hub's `/api/me`),
  which sends signed-out visitors to the hub's `/renew` and back. `apiFetch()` does the same on a 401.
- **Functions:** `api/_lib/hub.js` is a CommonJS port of the hub's `kit/hub.ts` (same behaviour; `jose`
  loaded with dynamic `import()`). `api/_lib/auth.js` reads the cookie (`getHubUser`, `requireUser`);
  every function takes identity from it, never from the request. Admin = `isStaff` (hub admin/TA).
- **Sections:** the hub's `section` claim, matched to the app's sections in `api/_lib/sections.js`
  (keep in sync with `src/data/activities.js`). Unmatched/missing: the student picks once
  (`SectionPicker`, stored on their `students` row). Staff see section tabs and may view any section.
- **Activity:** `POST /api/submissions` reports `run.submitted` ("Submitted a ranking: 1. …" /
  "Updated a ranking: 1. …") through the outbox (`hub_outbox`, `api/_lib/rankingEvents.js`), then
  `waitUntil(flush())`. Snapshot: activity, section, ranking table. `runId` = the submission id;
  `link` = `/?section=…&student=<hub id>` (the student's own page; staff get a read-only view).
  Admin page: waiting count + "Send now" (`/api/hub/outbox`); daily sweep `/api/hub/sweep`.

## Architecture

Classroom tool for CBS where students rank strategic options for a Beli case study, and instructors see real-time consensus + divergence analysis.

**Routing:** `/` → StudentPage, `/admin` → AdminPage (React Router v7 in `src/index.js`).

**Data layer:** `src/data/activities.js` exports `ACTIVITIES` (array of 3 activity configs). Each activity carries its own color theme, content, evaluation pillars, and rankable options. All components receive the relevant activity object as an `act` prop and use its theme colors for inline styles.

**Student flow:** hub sign-in → `GET /api/students` (name + section; SectionPicker if the roster gives none) → locked to their section's brief (Hero + BriefContent) → RankingForm (sortable list with animated swaps, upserts via `POST /api/submissions`) → ClassAverages (shown post-submit, polls every 30s).

**Admin flow:** hub instructors/TAs only ("Instructors only" otherwise) → class hub outbox panel → section tabs → "Analysis" tab (averages bar chart + divergence scores with hover tooltips + item-level outliers) and "Submissions" tab (raw data table). Includes per-section data clearing.

**API (`api/`, Vercel serverless functions, CommonJS):** the browser never talks to the database. `api/_lib/db.js` holds the lazy Neon client (`@neondatabase/serverless`). `students.js` (GET/POST the signed-in person's row and section), `submissions.js` (GET section rankings / own submission / staff: one student's, POST upsert + activity report), `admin.js` (GET all data, DELETE a section; staff only), `hub/outbox.js` (staff), `hub/sweep.js` (cron).

**Neon Postgres tables:** `students` (one per hub person: `student_id` = hub person id, email, name from the hub, section; older typed-name rows have `student_id` NULL), `submissions` (`student_id` FK to `students.id`, section, rankings as JSONB like `{"Option Name": 1, ...}`, unique on student_id+section for upsert) and `hub_outbox`. Schema in `schema.sql`; `db/hub-migration.sql` upgrades an existing database.

**Styling:** All inline React styles using theme variables from the activity object (`act.accent`, `act.border`, `act.contentBg`, etc.). Google Fonts (Playfair Display, DM Sans) imported via CSS `@import`. CSS keyframe animations defined in `<style>` tags within page components.
