# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
npm start          # Dev server on localhost:3000
npm run build      # Production build to build/
```

No test runner or linter is configured.

## Deployment

Hosted on Vercel with GitHub auto-deploy on push to `main`. Manual deploy: `vercel --prod`.

Environment variables (set in `.env` locally and in Vercel dashboard for production):
- `REACT_APP_SUPABASE_URL` — Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` — Supabase anon key
- `REACT_APP_ADMIN_PASSWORD` — Password for `/admin` route

## Architecture

Classroom tool for CBS where students rank strategic options for a Beli case study, and instructors see real-time consensus + divergence analysis.

**Routing:** `/` → StudentPage, `/admin` → AdminPage (React Router v7 in `src/index.js`).

**Data layer:** `src/data/activities.js` exports `PASSWORDS` (section passwords) and `ACTIVITIES` (array of 3 activity configs). Each activity carries its own color theme, content, evaluation pillars, and rankable options. All components receive the relevant activity object as an `act` prop and use its theme colors for inline styles.

**Student flow:** LoginScreen (name + section password → Supabase upsert → localStorage session) → locked to their section's brief (Hero + BriefContent) → RankingForm (sortable list with animated swaps, upserts to Supabase) → ClassAverages (shown post-submit, polls every 30s).

**Admin flow:** Password gate (sessionStorage) → section tabs → "Analysis" tab (averages bar chart + divergence scores with hover tooltips + item-level outliers) and "Submissions" tab (raw data table). Includes per-section data clearing.

**Supabase tables:** `students` (name, section, unique on both) and `submissions` (student_id FK, section, rankings as JSONB like `{"Option Name": 1, ...}`, unique on student_id+section for upsert). Schema in `supabase-schema.sql`. RLS is permissive (all operations allowed); section passwords provide access control.

**Styling:** All inline React styles using theme variables from the activity object (`act.accent`, `act.border`, `act.contentBg`, etc.). Google Fonts (Playfair Display, DM Sans) imported via CSS `@import`. CSS keyframe animations defined in `<style>` tags within page components.
